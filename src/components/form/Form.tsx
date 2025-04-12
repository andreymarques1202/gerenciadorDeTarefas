import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { PiWarningCircleBold } from "react-icons/pi";
import { TbCancel } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";

interface NewPassword {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    username: string;
}


const ModalForm = () => {
    const [formType, setFormType] = useState("");
    
    const handleEnterPassword = () => {
        const btn = document.querySelector(".password-btn");

        btn?.classList.add("active");
    }

    const handleEnterEmail= () => {
        const btn = document.querySelector(".email-btn");

        btn?.classList.add("active");
    }

    const handleLeavePassword = () => {
        const btn = document.querySelector(".password-btn");

        btn?.classList.remove("active");
    }

    const handleLeaveEmail= () => {
        const btn = document.querySelector(".email-btn");

        btn?.classList.remove("active");
    }

    return(
        <>
            {formType !== "password" && formType !== "profile" && (
                <div className="container">
                    <div className="card bg-dark">
                        <div className="container-settings-options">
                            <button className="btn-save-form email-btn" onMouseEnter={handleEnterEmail} onMouseLeave={handleLeaveEmail} onClick={() => setFormType("profile")}>Alterar Dados do Perfil</button>
                            <button className="btn-save-form password-btn" onMouseEnter={handleEnterPassword} onMouseLeave={handleLeavePassword} onClick={() => setFormType("password")}>Alterar Senha</button>
                        </div>
                    </div>
                </div>
            )}
            {formType === "password" && <FormPassword/>}
            {formType === "profile" && <FormProfile/>}
        </>
    );
}

const FormPassword = () => {
    const [formData, setFormData] = useState<NewPassword>({
        current_password: "",
        new_password: "",
        new_password_confirmation: ""
    });

    const [updateResponse, setUpdateResponse] = useState({
        show: false,
        alert: "",
        message: ""
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [btnCurrent, setBtnCurrentPass] = useState(false);
    const [btnNewPass, setBtnNewPass] = useState(false);
    const [btnConfirm, setBtnConfirm] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
    
    const navigate = useNavigate();
    const {logout} = useAuth();

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = ev.target;
    
    
        let errorMsg: string | null = null;

        if (value.trim() === "") {
            errorMsg = "Este campo não pode estar vazio.";
        } else if (name === "new_password") {
            const hasUppercase = /[A-Z]/.test(value);
            const hasLowercase = /[a-z]/.test(value);
            const hasNumber = /\d/.test(value);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
            const sizePassword = /^.{8,}$/.test(value);


            if(value === formData.current_password) {
                errorMsg = "A senha não deve ser a mesma da atual." 
            } else if (!hasUppercase) {
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

        }

        setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
    

        if(name === "new_password_confirmation") {
            if(value !== formData.new_password) {
                errorMsg = "A Senhas precisam ser iguais.";
            }
        }

        if (errorMsg) {
            ev.target.classList.add("is-invalid");
        } else {
            ev.target.classList.remove("is-invalid");
        }

        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
    
            const allFieldsFilled = Object.values(updatedData).every((field) => field.trim() !== "");
            
            const passwordsMatch = updatedData.new_password_confirmation === updatedData.new_password;
    
            const btn = document.querySelector(".btn-password-alter") as HTMLButtonElement;
            
            if (allFieldsFilled && passwordsMatch) {
                btn.disabled = false;
                btn.classList.add("active");
            } else {
                btn.disabled = true;
                btn.classList.remove("active");
            }
    
            return updatedData;
        });

    }


    const handleFocus = (ev: React.FocusEvent<HTMLInputElement>): void => {
        const input = ev.target;

        input.style.borderBottom = "1px solid #ff640a";
    }

    const handleBlur = (ev: React.FocusEvent<HTMLInputElement>): void => {
        const input = ev.target;

        input.style.borderBottom = "1px solid #fff";
    }


    const togglePasswordVisibility = (field: string) => {
        if (field === "current_password") {
            setShowCurrentPassword(!showCurrentPassword);
            
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            btnCurrent ? setBtnCurrentPass(false) : setBtnCurrentPass(true);
            
        } else if (field === "new_password") {
            setShowNewPassword(!showNewPassword);


            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            btnNewPass ? setBtnNewPass(false) : setBtnNewPass(true);

        } else if (field === "new_password_confirmation") {
            setShowConfirmPassword(!showConfirmPassword);
           
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            btnConfirm ? setBtnConfirm(false) : setBtnConfirm(true);
        }
    };

    

    const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        console.log(formData);

        try {
            const token = localStorage.getItem("token");

            const response = await axios.put("http://localhost:8000/api/user/password", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.data.message) {
                setUpdateResponse({show: true, alert: "alert-success", message: response.data.message});

                await axios.post("http://localhost:8000/api/logout", {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                logout();
                navigate("/login");
                
            }
            
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch(err: any) {
            if (err.response && err.response.data?.error) {
                const errorObj = err.response.data.error;
                const errorMessages: string[] = [];
        
                Object.keys(errorObj).forEach((key) => {
                    errorMessages.push(...errorObj[key]);
                });
        
                setUpdateResponse({
                    show: true,
                    alert: "alert-danger",
                    message: errorMessages.join("")
                });
        
            } else {
                setUpdateResponse({
                    show: true,
                    alert: "alert-danger",
                    message: "Erro inesperado. Tente novamente mais tarde."
                });
            }
        }
    }

    return(
        <div className="conteiner mt-5">
            <form onSubmit={handleSubmit} className="mt-5 mb-5">
                {updateResponse.show === true && (
                    <div className={`alert ${updateResponse.alert}`} role="alert">
                        {updateResponse.message}
                    </div>
                )}
                <div className="card text-bg-dark">
                    <div className="card-body">
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <h1 className="fs-3 fw-bold">Alterar Senha</h1>
                            <p className="fs-6 fw-semibold text-secondary">Escolha uma única para manter sua conta segura</p>
                        </div>
                        <div className="position-relative mb-3">
                            <label htmlFor="current_password" className="form-label fw-lighter text-light mb-1">Senha Atual</label>
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                name="current_password"
                                id="current_password"
                                className="form-control bg-transparent text-light no-focus"
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                value={formData.current_password}
                            />
                            <p className="btn btn-dark position-absolute top-0 end-0" onClick={() => togglePasswordVisibility("current_password")}>{btnCurrent? "Ocultar" : "Exibir"}</p>
                            {errors.current_password && <div className="invalid-feedback">{errors.current_password}</div>}
                        </div>
                        <div className="position-relative mb-3">
                            <label htmlFor="new_password" className="form-label fw-lighter text-light mb-1">Nova Senha</label>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                name="new_password"
                                id="new_password"
                                className="form-control bg-transparent text-light no-focus"
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                value={formData.new_password}
                            />
                            <p className="btn btn-dark position-absolute top-0 end-0" onClick={() => togglePasswordVisibility("new_password")}>{btnNewPass ? "Ocultar" : "Exibir"}</p>
                            {errors.new_password && <div className="invalid-feedback">{errors.new_password}</div>}
                        </div>
                        <div className="position-relative mb-3">
                            <label htmlFor="new_password_confirmation" className="form-label fw-lighter text-light mb-1">Confirmar Senha</label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="new_password_confirmation"
                                id="new_password_confirmation"
                                className="form-control bg-transparent text-light no-focus"
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                value={formData.new_password_confirmation}
                            />
                            <p className="btn btn-dark position-absolute top-0 end-0" onClick={() => togglePasswordVisibility("new_password_confirmation")}>{btnConfirm ? "Ocultar" : "Exibir"}</p>
                            {errors.new_password_confirmation && <div className="invalid-feedback">{errors.new_password_confirmation}</div>}
                        </div>
                        <div className="footer d-flex flex-column mt-4">
                            <div className="d-flex mb-3">
                                <PiWarningCircleBold size={30} className="me-2"/>
                                <p className="text-warning-password fw-light">Alterações de senha fará com que sua conta saia do seu dispositivo. Você precisará logar e digitar sua senha alterada novamente.</p>
                            </div>
                            <button className="btn-password-alter w-auto" disabled>ALTERAR SENHA</button>
                            <button className="btn-save p-2 fw-bold mt-2" type="button" onClick={() => navigate(-1)}>Cancelar<TbCancel color="#dc3545" className="ms-2" size={20}/></button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export const FormProfile = () => {
    const [userData, setUserData] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
    });

    const [updateResponse, setUpdateResponse] = useState({
        show: false,
        alert: "",
        message: ""
    });

    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
    
                const response = await axios.get("http://localhost:8000/api/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });    
                setUserData(response.data);
            } catch (error) {
                console.error("Erro ao buscar usuário autenticado:", error);
            }
        };
    
        fetchUser();
    }, []);

    const handleShowForm = () => {
        setShowForm(true);
    }
    

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = ev.target;
        const btn = document.querySelector(".btn-save-form");

        setFormData(prevData => ({...prevData, [name]: value}));

        btn?.classList.add("active");

    }

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.put("http://localhost:8000/api/user", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.data.message) {
                setUpdateResponse({show: true, alert: "alert-success", message: response.data.message});
                
                setTimeout(() => {
                    navigate("/");
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
        
                setUpdateResponse({
                    show: true,
                    alert: "alert-danger",
                    message: errorMessages.join(" ")
                });
        
            } else {
                setUpdateResponse({
                    show: true,
                    alert: "alert-danger",
                    message: "Erro inesperado. Tente novamente mais tarde."
                });
            }
        }
    }
            
    return(
    <div className="container">
        <form className="mt-5 mb-5">
            {showForm ? (
                <div className="card text-bg-dark py-4">
                    {updateResponse.show === true && (
                        <div className={`alert ${updateResponse.alert}`} role="alert">
                            {updateResponse.message}
                        </div>
                    )}
                    
                    <div className="card-body text-center">
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <h1 className="fs-3 fw-bold" style={{fontFamily: "roboto-semibold"}}>Alterar Dados do perfil</h1>
                            <p className="fs-6 fw-semibold text-secondary">Altere os dados de seu perfil da maneira que quiser como nome, email ou username</p>
                        </div>
                        <div className="d-flex flex-column text-start mt-4">
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Nome</label>
                                <input type="text" name="name" id="name" className="form-control" placeholder="digite seu nome" onChange={handleChange}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input type="text" name="username" id="username" className="form-control" placeholder="digite seu username" onChange={handleChange}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">E-mail</label>
                                <input type="email" name="email" id="email" className="form-control" placeholder="digite seu email" onChange={handleChange}/>
                            </div>
                        </div>
                        <div className="d-flex flex-column justify-content-center align-items-center mt-5">
                            <button className="btn-save-form" style={{fontFamily: "roboto-bold"}} type="button" onClick={handleSubmit}>Atualizar Dados <FaRegSave color="#f5f5f5" className="ms-2" size={20}/></button>
                            <button className="btn-save p-2 fw-bold mt-2" type="button" onClick={() => navigate(-1)}>Cancelar<TbCancel color="#dc3545" className="ms-2" size={20}/></button>
                        </div>
                    </div>
                </div>
            ) : (
            <>
                <div className="card text-bg-dark py-4">
                    <div className="card-body text-center">
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <h1 className="fs-3 fw-bold" style={{fontFamily: "roboto-semibold"}}>Alterar Dados do perfil</h1>
                            <p className="fs-6 fw-semibold text-secondary">Altere os dados de seu perfil da maneira que quiser como nome, email ou username</p>
                        </div>
                        {userData && (
                            <div className="d-flex flex-column text-start mt-4">
                                <p className="fw-bold text-light">Dados Atuais</p>
                                <hr />
                                <p className="text-label-email fw-normal text-secondary">Nome Atual</p>
                                <h2 className="text-light" style={{fontFamily: "roboto-medium", fontSize: "18px"}}>{userData.name}</h2>
                                <p className="text-label-email fw-normal text-secondary">E-mail Atual</p>
                                <h2 className="text-light" style={{fontFamily: "roboto-medium", fontSize: "18px"}}>{userData.email}</h2>
                                <p className="text-label-email fw-normal text-secondary">Username Atual</p>
                                <h2 className="text-light" style={{fontFamily: "roboto-medium", fontSize: "18px"}}>{userData.username}</h2>
                            </div>
                        )}
                        <div className="d-flex flex-column justify-content-center align-items-center mt-5">
                            <p className="text-label-email text-light" style={{fontSize: "12px"}}>Quando clicar no botão abaixo, o formulário para alterar seus dados irá carregar...</p>
                            <button className="btn-save-form active" style={{fontFamily: "roboto-bold"}} onClick={handleShowForm}>FORMULÁRIO PARA ALTERAR DADOS</button>
                            <button className="btn-save p-2 fw-bold mt-2" type="button" onClick={() => navigate(-1)}>Cancelar<TbCancel color="#dc3545" className="ms-2" size={20}/></button>
                        </div>
                    </div>
                </div>
            </>
            )}
        </form>
    </div>
    );
}


export default ModalForm;