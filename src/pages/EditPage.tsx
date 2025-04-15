import { FaRegSave } from "react-icons/fa";
import { NavbarLogged } from "../components/navbar/Navbar";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

interface TaskProps {
    title: string;
    description: string;
    priority: "alta" | "media" | "baixa";
    status: "pendente" | "em andamento" | "concluida";
}

const EditPage = () => {
    const { id } = useParams(); 
    const [formData, setFormData] = useState<TaskProps>({
        title: "",
        description: "",
        priority: "baixa",
        status: "em andamento"
    });

    const [editResponse, setEditResponse] = useState({
        show: false,
        alert: "",
        message: ""
    });

    const token = localStorage.getItem("token");


    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const fetchTask = async () => {
                try {
                    const response = await axios.get(`https://gerenciadordetarefasbackend.onrender.com/api/tasks/${id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });
                    setFormData(response.data);
                } catch (error) {
                    console.error("Erro ao buscar a tarefa:", error);
                }
            };

            fetchTask();
        }
    }, [id]);


    const handleChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = ev.target;

        setFormData(prevData => ({...prevData, [name]: value}));
    }

    const handlePriority = (ev: React.ChangeEvent<HTMLInputElement>) => {
        if(ev.target.value === "1") {
            setFormData(prevData => ({...prevData, priority: "baixa"}));
        } else if(ev.target.value === "2") {
            setFormData(prevData => ({...prevData, priority: "media"}));
        } else {
            setFormData(prevData => ({...prevData, priority: "alta"}));
        }
    }

    console.log(formData)

    const handleSave = async () => {
            try {
                const response = await axios.put(`https://gerenciadordetarefasbackend.onrender.com/api/tasks/${id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if(response.data.message) {

                    setEditResponse({
                        show: true,
                        alert: "alert-success",
                        message: response.data.message
                    });

                    setTimeout(() => {
                        navigate("/");
                    }, 1000);
                }
                
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                if (err.response && err.response.data?.error) {
                    const errorObj = err.response.data.error;
                    const errorMessages: string[] = [];
            
                    Object.keys(errorObj).forEach((key) => {
                        errorMessages.push(...errorObj[key]);
                    });
            
                    setEditResponse({
                        show: true,
                        alert: "alert-danger",
                        message: errorMessages.join("")
                    });
            
                } else {
                    setEditResponse({
                        show: true,
                        alert: "alert-danger",
                        message: "Erro inesperado. Tente novamente mais tarde."
                    });
                }
            }
    }

    const handleDelete = async () => {
        if (id) {
            try {
                const response = await axios.delete(`https://gerenciadordetarefasbackend.onrender.com/api/tasks/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                if(response.data.message) {

                    setEditResponse({
                        show: true,
                        alert: "alert-success",
                        message: response.data.message
                    });

                    setTimeout(() => {
                        navigate("/");
                    }, 1000);
                }
                
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                if (err.response && err.response.data?.error) {
                    const errorObj = err.response.data.error;
                    const errorMessages: string[] = [];
            
                    Object.keys(errorObj).forEach((key) => {
                        errorMessages.push(...errorObj[key]);
                    });
            
                    setEditResponse({
                        show: true,
                        alert: "alert-danger",
                        message: errorMessages.join("")
                    });
            
                } else {
                    setEditResponse({
                        show: true,
                        alert: "alert-danger",
                        message: "Erro inesperado. Tente novamente mais tarde."
                    });
                }
            }
        }
    }

    if (!formData) {
        return <div>Carregando...</div>;
    }

    return(
        <>
            <NavbarLogged/>
            <div className="container-edit">
                <div className="title-edit">
                    <h1 className="fw-bold">Editar Tarefa</h1>
                </div>
                {editResponse.show === true && (
                    <div className={`alert ${editResponse.alert}`} role="alert">
                        {editResponse.message}
                    </div>
                )}
                <div className="form-container-edit">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label fw-bold">Titulo</label>
                            <input type="text" className="form-control" name="title" id="title" placeholder="Titulo da tarefa" value={formData.title} onChange={handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label fw-bold">Descrição</label>
                            <textarea className="form-control" name="description" id="description" placeholder="Descrição da tarefa" value={formData.description} onChange={handleChange}></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Status</label>
                            <select className="form-select" aria-label="Status" name="status" value={formData.status} onChange={handleChange}>
                                <option value="" disabled>status da tarefa</option>
                                <option value="pendente" className="bg-danger text-light">Pendente</option>
                                <option value="em andamento" className="bg-warning">Em Andamento</option>
                                <option value="concluida" className="bg-success text-light">Concluida</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="priority" className="form-label fw-bold">Prioridade</label>
                            <div className="container-priority-input">
                                <p className="text-success fw-bold">Baixa</p>
                                <p className="text-warning fw-bold">Media</p>
                                <p className="text-danger fw-bold">Alta</p>
                            </div>
                            <input type="range" className="form-range" min="1" max="3" name="priority" id="priority" onChange={handlePriority} value={formData.priority === "baixa" ? 1 : formData.priority === "media" ? 2 : 3}/>
                        </div>
                        <div className="container-edit-buttons">
                            <button className="btn-save fw-bold" type="button" onClick={handleSave}>Salvar <FaRegSave color="#dc3545" size={20}/></button>
                            <button className="btn btn-danger fw-bold" type="button" onClick={handleDelete}>Deletar <MdDelete color="#f5f5f5" size={20}/></button>
                        </div>
                    </form>
                </div>
            </div>

        </>
    );
}

export default EditPage;