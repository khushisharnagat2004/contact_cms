import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    console.log("user data=",user);      
    return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
