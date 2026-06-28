import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OAuthSuccess = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadOAuthUser = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/auth/oauth/callback", {
                    credentials: "include",
                });

                const data = await res.json();

                if (data !== null) {
                    login(data.data);
                    const role = data.data.role;
                    if (role === 'ADMIN') navigate('/admin/dashboard');
                    else if (role === 'SELLER') navigate('/seller/dashboard');
                    else navigate('/');
                }
            } catch (e) {
                console.error("Error: Info User OAuth", e);
            }
        };

        loadOAuthUser();
    }, [navigate]);

    return <p>Logging in...</p>;
};

export default OAuthSuccess;