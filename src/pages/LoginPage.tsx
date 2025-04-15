import { useState } from "react";
import { Navbar } from "../components/navbar/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

interface LoginFormData {
    username_or_email: string;
    password: string;
}

const LoginPage = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        username_or_email: "",
        password: ""
    });

    const [loginResponse, setLoginResponse] = useState({
        show: false,
        message: ""
    })

    const {login} = useAuth();

    const navigate = useNavigate();

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = ev.target;
        setFormData(prevData => ({...prevData, [name]: value}));
    }

    const handleSumit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        try {
            const response = await axios.post("https://gerenciadordetarefasbackend.onrender.com/api/login", formData);

            if(response.data.token) {
                login(response.data.token);
                navigate("/");      
            }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (err.response && err.response.data?.error) {
            const error = err.response.data.error;
        
            if (typeof error === "string") {
              setLoginResponse({
                show: true,
                message: error,
              });
        
            } else if (typeof error === "object") {
              const errorMessages: string[] = [];
              Object.keys(error).forEach((key) => {
                errorMessages.push(...error[key]);
              });
        
              setLoginResponse({
                show: true,
                message: errorMessages.join(" ")
              });
            }
        
          } else {
            setLoginResponse({
              show: true,
              message: "Erro inesperado. Tente novamente."
            });
          }
        
        };
    }
    
    return(
        <>
            <Navbar/>
            <form className="form-container" onSubmit={handleSumit}>
                {loginResponse.show === true && (
                    <div className="alert alert-danger" role="alert">
                        {loginResponse.message}
                    </div>
                )}
                <div className="mb-3">
                    <label htmlFor="username_or_email" className="form-label fw-bold">Username ou Email</label>
                    <input type="text" name="username_or_email" id="username_or_email" className="form-control" placeholder="Digite seu username ou email" value={formData.username_or_email} onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-bold">Password</label>
                    <input type="password" name="password" id="password" className="form-control" placeholder="Digite sua senha" value={formData.password} onChange={handleChange}/>
                </div>
                <div className="d-grid gap-2 mt-4">
                    <button className="btn btn-danger fw-italic">Logar</button>
                </div>
            </form>
        </>
    );
}

export default LoginPage;