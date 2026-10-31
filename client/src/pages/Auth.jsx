
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Auth() {
    const [isLogin, setIsLogin] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        department: ""
    });

    const { login, register, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isLogin) {
                const data = await login(
                    formData.email,
                    formData.password
                );

                if (data.user.role === "student") {
                    navigate("/student-dashboard");
                } else if (data.user.role === "faculty") {
                    navigate("/faculty-dashboard");
                } else {
                    navigate("/admin-dashboard");
                }
            } else {
                await register(formData);

                alert("Registration successful! Please login.");

                setIsLogin(true);
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    department: ""
                });
            }
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <div className="auth-header">
                    <h1>AppointmentPro</h1>
                    <p>College Faculty Appointment Portal</p>
                </div>

                <div className="auth-tabs">
                    <button
                        className={isLogin ? "active" : ""}
                        onClick={() => setIsLogin(true)}
                        type="button"
                    >
                        Login
                    </button>

                    <button
                        className={!isLogin ? "active" : ""}
                        onClick={() => setIsLogin(false)}
                        type="button"
                    >
                        Register
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    {!isLogin && (
                        <>
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                            <label>Department</label>
                            <input
                                type="text"
                                name="department"
                                placeholder="Enter your department"
                                value={formData.department}
                                onChange={handleChange}
                            />
                        </>
                    )}

                    <label>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button
                        className="auth-submit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Please wait..."
                            : isLogin
                                ? "Login"
                                : "Create Account"}
                    </button>

                </form>

                <p className="auth-footer">
                    {isLogin
                        ? "Don't have an account?"
                        : "Already have an account?"}

                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? "Register" : "Login"}
                    </button>
                </p>

            </div>
        </div>
    );
}

export default Auth;
