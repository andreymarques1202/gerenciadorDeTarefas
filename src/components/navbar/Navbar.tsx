import { Link, useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { MdSettings} from "react-icons/md";
import { BiTask } from "react-icons/bi";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/AuthContext";

export const Navbar = () => {
    return(
        <header>
            <nav className="navbar navbar-light bg-light-subtle navbar-expand-lg fixed-top">
                <div className="container">
                    <a href="/" className="navbar-brand me-5">
                        <h1 className="fw-bold">MyTasks <BiTask size={25}/></h1>
                    </a>

                    <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#menu-links">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="menu-links">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item me-2 mb-2 mb-lg-0">
                                {window.location.pathname === "/registro" ? (
                                    <Link to="/" className="btn btn-dark w-100 w-lg-auto">Home</Link>
                                ) : (
                                    <Link to="/registro" className="btn btn-dark w-100 w-lg-auto">Registre-se</Link>
                                )}
                            </li>
                            <li className="nav-item">
                                {window.location.pathname === "/login" ? (
                                    <Link to="/" className="btn btn-danger w-100 w-lg-auto">Home</Link>
                                ) : (
                                    <Link to="/login" className="btn btn-danger w-100 w-lg-auto">Entrar</Link>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export const NavbarLogged = () => {
    const [user, setUser] = useState({name: ""});
    const navigate = useNavigate();
    const {logout} = useAuth();
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
    
                const response = await axios.get("https://gerenciadordetarefasbackend.onrender.com/api/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                setUser({name: response.data.name});
            } catch (error) {
                console.error("Erro ao buscar usuário autenticado:", error);
            }
        };
    
        fetchUser();
    }, []);
    

    

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("https://gerenciadordetarefasbackend.onrender.com/api/logout", {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 200) {
                logout();
                navigate("/");
            }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch(err: any) {
            if (err.response) {
                console.log("Erro da API:", err.response.data);
            } else {
                console.log("Erro inesperado:", err.message);
            }
        }
    }

    return(
        <header>
            <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                <div className="container">
                    <a href="/" className="navbar-brand d-flex align-items-center">
                        <h1 className="fw-bold mb-0 me-2">MyTasks</h1>
                        <BiTask size={25} />
                    </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav ms-auto align-items-center">

                    <li className="nav-item dropdown">
                        <button
                        className="btn btn-dark dropdown-toggle btn-profile px-3 py-2"
                        type="button"
                        id="profileDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        >
                        <span className="fw-bold text-light">{user.name}</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end mt-2" aria-labelledby="profileDropdown">
                        {window.location.pathname !== "/" && (
                            <li>
                                <Link className="dropdown-item mb-2" to="/">
                                    <FaHome /> Home
                                </Link>
                            </li>
                        )}
                        <li>
                            <Link className="dropdown-item mb-2" to="/configurações">
                                <MdSettings /> Settings
                            </Link>
                        </li>
                        <hr />
                        <li>
                            <button className="dropdown-item text-danger" onClick={handleLogout}>
                            <CiLogout /> Logout
                            </button>
                        </li>
                        </ul>
                    </li>
                    </ul>
                </div>
                </div>
            </nav>
        </header>

    );
}