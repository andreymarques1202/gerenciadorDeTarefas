import { Route, BrowserRouter, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import InitialPage from "../pages/InitialPage";
import { useAuth } from "../hooks/AuthContext";
import HomePage from "../pages/HomePage";
import EditPage from "../pages/EditPage";
import CreatePage from "../pages/CreatePage";
import SettingsPage from "../pages/SettingsPage";
import Error404Page from "../pages/Error404Page";

const RouterPages = () => {
    const {loggedIn} = useAuth();
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={loggedIn ? <HomePage/> : <InitialPage/>}/>
                <Route path="/login" element={loggedIn ? <Error404Page/> : <LoginPage/>}/>
                <Route path="/registro" element={loggedIn ? <Error404Page/> : <RegisterPage/>}/>
                <Route path="/editar/:id" element={loggedIn ? <EditPage/> : <Error404Page/>}/>
                <Route path="/criar/tarefa" element={loggedIn ? <CreatePage/> : <Error404Page/>}/>
                <Route path="/configurações" element={loggedIn ? <SettingsPage/> : <Error404Page/>}/>
                <Route path="*" element={<Error404Page/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default RouterPages;