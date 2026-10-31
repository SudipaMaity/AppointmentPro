
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Dashboard.css";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalStudents: 0,
        totalFaculty: 0,
        totalAppointments: 0,
        confirmedAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0
    });

    const [appointments, setAppointments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchStats = async () => {
        try {
            const response = await API.get("/admin/stats");
            setStats(response.data.stats);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load dashboard statistics."
            );
        } finally {
            setLoading(false);
        }
    };

    // fetch all
    const fetchAppointments = async () => {
        try {
            const response = await API.get("/admin/all-appointments");
            setAppointments(response.data.appointments);
        } catch (err) {
            console.log("Unable to fetch appointments:", err);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchAppointments();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        window.location.reload();
    };

    const statCards = [
        { title: "Total Students", value: stats.totalStudents },
        { title: "Total Faculty", value: stats.totalFaculty },
        { title: "Total Appointments", value: stats.totalAppointments },
        { title: "Confirmed", value: stats.confirmedAppointments },
        { title: "Completed", value: stats.completedAppointments },
        { title: "Cancelled", value: stats.cancelledAppointments }
    ];

    return (
        <div className="dashboard">

            <header className="dashboard-header">
                <div>
                    <h2>Admin Dashboard</h2>
                    <p>AppointmentPro Management Overview</p>
                </div>

                <div className="header-user">
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            <main className="dashboard-content">

                <section className="welcome-section">
                    <h1>Dashboard Overview</h1>
                    <p>
                        Monitor students, faculty and appointments.
                    </p>
                </section>

                {loading ? (
                    <p>Loading dashboard statistics...</p>
                ) : error ? (
                    <p className="empty-message">{error}</p>
                ) : (
                    <div className="stats-grid">
                        {statCards.map((card) => (
                            <div className="stat-card" key={card.title}>
                                <p>{card.title}</p>
                                <h3>{card.value}</h3>
                            </div>
                        ))}
                    </div>
                )}


                <section className="dashboard-card">
                    <h2>All Appointments</h2>

                    {appointments.length === 0 ? (
                        <p className="empty-message">No appointments found.</p>
                    ) : (
                        <div className="appointment-list">
                            {appointments.map((appointment) => (
                                <div className="appointment-item" key={appointment._id}>
                                    <div>
                                        <h3>{appointment.student?.name || "Unknown Student"}</h3>
                                        <p>
                                            Student: {appointment.student?.email || "N/A"}
                                        </p>
                                        <p>
                                            Faculty: {appointment.faculty?.name || "N/A"}
                                        </p>
                                        <p>
                                            Date: {new Date(appointment.date).toLocaleDateString("en-IN")}
                                        </p>
                                        <p>Time: {appointment.time}</p>
                                        <p>Reason: {appointment.reason}</p>
                                        <span className={`status ${appointment.status}`}>
                                            {appointment.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>


            </main>
        </div>
    );
};

export default AdminDashboard;
