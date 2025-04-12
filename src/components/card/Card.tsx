import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface TaskCardProps {
    title: string;
    description: string;
    priority: "alta" | "media" | "baixa";
    status: "pendente" | "em andamento" | "concluida";
    id: number;
}
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "danger";
      case "media":
        return "warning";
      case "baixa":
        return "success";
      default:
        return "secondary";
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return "secondary";
      case "em andamento":
        return "primary";
      case "concluida":
        return "success";
      default:
        return "light";
    }
  };
  
  const TaskCard: React.FC<TaskCardProps> = ({ title, description, priority, status, id }) => {
    const navigate = useNavigate();
  
    return (
      <div className="card mb-3 shadow-sm border m-4" style={{ maxWidth: "350px", fontSize: "0.9rem" }}>
        <div className={`card-header py-2 px-3 bg-${getPriorityColor(priority)} text-white`}>
          <strong>{title}</strong>
        </div>
  
        <div className="card-body bg-light py-3 px-3">
          <p className="mb-2">{description}</p>
  
            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <span className={`badge bg-${getPriorityColor(priority)} px-2 py-1`}>
                    Prioridade: {priority}
                </span>
                <span className={`badge bg-${getStatusBadge(status)} px-2 py-1`}>
                    Status: {status}
                </span>
            </div>

  
          <button onClick={() => navigate(`/editar/${id}`)} className="btn btn-sm btn-outline-primary w-100 mt-2">
            Editar <FaRegEdit size={14}/>
          </button>
        </div>
      </div>
    );
  };
  
  export default TaskCard;