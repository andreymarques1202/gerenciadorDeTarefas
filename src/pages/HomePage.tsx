import { MdFormatListBulletedAdd } from "react-icons/md";
import TaskCard from "../components/card/Card";
import { NavbarLogged } from "../components/navbar/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Task {
    id: number;
    title: string;
    description: string;
    priority: "baixa" | "media" | "alta";
    status: "pendente" | "em andamento" | "concluida";
}
  

const HomePage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("Token não encontrado!");
                    return;
                }
    
                const response = await axios.get("https://gerenciadordetarefasbackend.onrender.com/api/user/tasks", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setTasks(response.data);
            } catch (error) {
                console.error("Erro ao pegar as tarefas:", error);
            }
        }

        fetchData();
    }, []);

    return (
        <>
            <NavbarLogged/>
            <div className="dashboard-layout">
                <h1 className="fw-bold text-center mb-4">Tarefas</h1>
                <div className="d-flex p-2 justify-content-center">
                    <button className="btn btn-success" onClick={() => navigate("/criar/tarefa")}>Criar Nova Tarefa <MdFormatListBulletedAdd className="ms-2" size={20}/></button>
                </div>
                <div className="container">
                    <div className="row justify-content-center">
                        {tasks.map((task) => (
                                <div key={task.id} className="col-12 col-sm-6 col-md-4 mb-4">
                                    <TaskCard
                                        title={task.title}
                                        description={task.description}
                                        priority={task.priority}
                                        status={task.status}
                                        id={task.id}
                                    />
                                </div>
                            ))}
                    </div>
                </div>

            </div>
        </>
      );
}

export default HomePage;
