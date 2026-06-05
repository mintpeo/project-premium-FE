import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext.tsx";

const OAuthSuccess = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadGoogleUser = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/auth/google", {
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
                console.error("Error: Info User Google", e);
            }
        };

        loadGoogleUser();
    }, [navigate]);

    return <p>Logging in...</p>;
};

export default OAuthSuccess;