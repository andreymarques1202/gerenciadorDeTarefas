import error404 from "../assets/404Error.svg";
import error404NotAutorized from "../assets/404ErrorNotAutorized.svg";

const Error404Page  = () => {
    return(
        <div className="container-error">
            {window.location.pathname === "/login" || window.location.pathname === "/registro" ? (
                <img src={error404NotAutorized} alt="Error 404 svg" />
            ) : (
                <img src={error404} alt="Error 404 svg" />
            )}
        </div>
    );
}

export default Error404Page;