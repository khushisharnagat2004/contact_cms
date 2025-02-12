import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext"; // Ensure correct path
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import ProtectedRoute from "./ProtectedRoute";
import Auth from "./Auth";

function App() {
    return (
        <Router> {/* Router should wrap everything */}
            <AuthProvider> {/* Now inside Router, so useNavigate works */}
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Auth />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Route */}
                    <Route 
                        path="/app" 
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
