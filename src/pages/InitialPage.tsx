import { Navbar } from "../components/navbar/Navbar";

const InitialPage = () => {
    return (
        <>
            <Navbar/>
            <div className="home-initial-container">
                <h1 className="title-initial-home">Gerenciamento de Tarefas com o MyTasks</h1>
            <section className="features">
                <div className="feature">
                    <h2>📝 Tarefas Rápidas</h2>
                    <p>Crie, edite e remova tarefas com poucos cliques.</p>
                </div>
                <div className="feature">
                    <h2>📊 Relatórios Simples</h2>
                    <p>Visualize seu desempenho e status de suas tarefas.</p>
                </div>
                <div className="feature">
                    <h2>✅ Organização Eficiente</h2>
                    <p>Mantenha o foco com categorias e prioridades.</p>
                </div>
            </section>
        </div>
        </>
    );
};

export default InitialPage;
