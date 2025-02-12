import { useContext, useState } from "react";
import { AuthContext } from "./context/authContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        const success = await register(name, email, password);
        if (success) {
            navigate("/login"); // Redirect to login page after successful registration
        }
    };

    return (
        <div class="container mt-5">
            <h2 class="text-center mb-4">Register</h2>
            <form onSubmit={handleRegister}>
                <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" id="name" class="form-control" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" id="email" class="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" id="password" class="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" class="btn btn-primary w-100">Register</button>
            </form>
        </div>

    );
};

export default Register;
