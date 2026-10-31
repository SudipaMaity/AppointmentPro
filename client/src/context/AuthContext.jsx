
import React, { createContext, useContext, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem("user");

            if (!savedUser) return null;

            return JSON.parse(savedUser);
        } catch (error) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            return null;
        }
    });


    const [loading, setLoading] = useState(false);

    // Login
    const login = async (email, password) => {
        setLoading(true);

        try {
            const { data } = await API.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            setUser(data.user);

            return data;
        } finally {
            setLoading(false);
        }
    };

    // Register
    const register = async (formData) => {
        setLoading(true);

        try {
            const { data } = await API.post("/auth/register", formData);
            return data;
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, login, register, logout, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
