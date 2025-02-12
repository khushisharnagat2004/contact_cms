import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const navigate = useNavigate(); 
    const api_url = "http://localhost:4000";

    // ✅ Check if user is already logged in (on page refresh)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch(`${api_url}/api/auth/me`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
            .then(async (res) => {
                const text = await res.text();
                try {
                    return JSON.parse(text); // Try parsing response as JSON
                } catch {
                    console.error("Invalid JSON response:", text);
                    return null;
                }
            })
            .then((data) => {
                if (data?.success) {
                    setUser(data.user);
                } else {
                    console.error("Auth Error:", data?.message || "Invalid response");
                    localStorage.removeItem("token");
                    setUser(null);
                }
            })
            .catch(err => console.error("Auth Check Error:", err));
        }
    }, []);

    // ✅ Login function with better error handling
    const login = async (email, password) => {
        try {
            const response = await fetch(`${api_url}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const text = await response.text(); // Read response as text
            try {
                const data = JSON.parse(text); // Try to parse JSON
                if (data.success) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify({ userId: data.userId }));
                    setUser({ userId: data.userId });
                    navigate("/app");
                    return true;
                } else {
                    alert(data.message);
                    return false;
                }
            } catch {
                console.error("Login Error: Invalid JSON response:", text);
                return false;
            }
        } catch (error) {
            console.error("Login Error:", error);
            return false;
        }
    };

    // ✅ Register function with error handling
    const register = async (name, email, password) => {
        try {
            const response = await fetch(`${api_url}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const text = await response.text();
            try {
                const data = JSON.parse(text);
                return data.success;
            } catch {
                console.error("Registration Error: Invalid JSON response:", text);
                return false;
            }
        } catch (error) {
            console.error("Registration Error:", error);
            return false;
        }
    };

    // ✅ Logout function
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null); 
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
