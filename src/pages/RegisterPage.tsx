import { useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { Navbar } from "../components/navbar/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";


interface RegisterFormData {
    name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
}

interface Response {
    show: boolean;
    alert: string;
    message: string;
}

const RegisterPage = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: ""
    });
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
    const [success, setSuccess] = useState<{ [key: string]: string[] }>({});

    const [registerResponse, setRegisterResponse] = useState<Response>({
        show: false,
        alert: "",
        message: ""
    });

    const navigate = useNavigate();

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = ev.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    
        let errorMsg = null;
        const successMsg: string[] = [];
    
        if (value.trim() === "") {
            errorMsg = "Este campo não pode estar vazio.";
        } else if (name === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMsg = "Insira um email válido, ex: email@example.com.";
            }
        } else if (name === "password") {
            const hasUppercase = /[A-Z]/.test(value);
            const hasLowercase = /[a-z]/.test(value);
            const hasNumber = /\d/.test(value);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
            const sizePassword = /^.{8,}$/.test(value);
    
            if (!hasUppercase) {
                errorMsg = "A senha deve conter pelo menos uma letra maiúscula.";
            } else if (!hasLowercase) {
                errorMsg = "A senha deve conter pelo menos uma letra minúscula.";
            } else if (!hasNumber) {
                errorMsg = "A senha deve conter pelo menos um número.";
            } else if (!hasSpecial) {
                errorMsg = "A senha deve conter pelo menos um caractere especial.";
            } else if (!sizePassword) {
                errorMsg = "A senha deve ter pelo menos 8 caracteres.";
            }
    
            if (hasUppercase) {
                successMsg.push("A senha contém pelo menos uma letra maiúscula.");
            }
            if (hasLowercase) {
                successMsg.push("A senha contém pelo menos uma letra minúscula.");
            }
            if (hasNumber) {
                successMsg.push("A senha contém pelo menos um número.");
            }
            if (hasSpecial) {
                successMsg.push("A senha contém pelo menos um caractere especial.");
            }
        }
    
        if (name === "password_confirmation") {
            if (value !== formData.password) {
                errorMsg = "As senhas precisam ser iguais.";
            }
        }
    
        setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
        setSuccess((prevSuccess) => ({ ...prevSuccess, [name]: successMsg }));
    
        if (errorMsg) {
            ev.target.classList.add("is-invalid");
        } else {
            ev.target.classList.remove("is-invalid");
        }
    
        if (successMsg.length > 0) {
            ev.target.classList.add("is-valid");
        } else {
            ev.target.classList.remove("is-valid");
        }
    };


    const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        const newErrors: { [key: string]: string | null } = {};

        Object.entries(formData).forEach(([key, value]) => {
            if (value.trim() === "") {
                newErrors[key] = "Este campo não pode estar vazio.";
            }
        });

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error !== null)) {
            return;
        }

        try {
            const response = await axios.post("https://gerenciadordetarefasbackend.onrender.com/api/register", formData);

            if(response.data.message) {
                setRegisterResponse({show: true, alert: "alert-success", message: response.data.message});
                
                setTimeout(() => {
                    navigate("/login");
                }, 2000)
            }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (err.response && err.response.data?.error) {
                const errorObj = err.response.data.error;
                const errorMessages: string[] = [];
        
                Object.keys(errorObj).forEach((key) => {
                    errorMessages.push(...errorObj[key]);
                });
        
                setRegisterResponse({
                    show: true,
                    alert: "alert-danger",
                    message: errorMessages.join(" ")
                });
        
                console.log("Mensagens da API:", errorMessages);
            } else {
                setRegisterResponse({
                    show: true,
                    alert: "alert-danger",
                    message: "Erro inesperado. Tente novamente mais tarde."
                });
                console.log("Erro inesperado:", err.message);
            }
        }
        
    }


    return(
        <>
            <Navbar/>
            <div className="container-register-page">
                <div className="container d-flex justify-content-center align-items-center vh-100 mt-5">
                    <form className="form-container-register bg-dark rounded shadow-sm border border-light" noValidate onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <h1 className="text-center text-light">Registrar Usuário</h1>
                        </div>

                        {registerResponse.show === true && (
                            <div className={`alert ${registerResponse.alert}`} role="alert">
                                {registerResponse.message}
                            </div>
                        )}

                        <label htmlFor="name" className="text-light mb-2">Nome</label>
                        <div className="input-group mb-4">
                            <span className="input-group-text pe-2">
                                <FaUser />
                            </span>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                placeholder="nome do usuário"
                                onChange={handleChange}
                                required
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>

                        <label htmlFor="username" className="text-light mb-2">Username</label>
                        <div className="input-group mb-4">
                            <span className="input-group-text pe-2">
                                <FaUser />
                            </span>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                placeholder="username"
                                onChange={handleChange}
                                required
                            />
                            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                        </div>

                        <label htmlFor="email" className="text-light mb-2">Email</label>
                        <div className="input-group mb-4">
                            <span className="input-group-text pe-2">
                                <MdAlternateEmail />
                            </span>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                placeholder="email@example.com"
                                onChange={handleChange}
                                required
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        <label htmlFor="password" className="text-light mb-2">Senha</label>
                        <div className="input-group mb-4">
                            <span className="input-group-text pe-2">
                                <FaLock />
                            </span>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                placeholder="senha do usuário"
                                onChange={handleChange}
                                required
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                            {success.password && success.password.length > 0 && (
                                <div className="valid-feedback">
                                    {success.password.map((msg, index) => (
                                        <div key={index}>{msg}</div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <label htmlFor="password_confirmation" className="text-light mb-2">Confirmar Senha</label>
                        <div className="input-group mb-2">
                            <span className="input-group-text pe-2">
                                <FaLock />
                            </span>
                            <input
                                type="password"
                                name="password_confirmation"
                                id="password_confirmation"
                                className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                                placeholder="confirmar senha"
                                onChange={handleChange}
                                required
                            />
                            {errors.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation}</div>}
                        </div>

                        <button className="btn btn-light mt-4 w-100 btn-register" type="submit">
                            Registrar
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default RegisterPage;