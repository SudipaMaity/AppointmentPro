
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function FacultyDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadAppointments = async () => {
        try {
            const { data } = await API.get(
                "/appointments/faculty-appointments"
            );

            setAppointments(data.appointments);
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to load appointments"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAppointments();
    }, []);

    const handleComplete = async (id) => {
        try {
            await API.patch(`/appointments/update-status/${id}`, {
                status: "completed"
            });

            alert("Appointment marked as completed!");
            await loadAppointments();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to update appointment"
            );
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const confirmed = appointments.filter(
        (a) => a.status === "confirmed"
    ).length;

    const completed = appointments.filter(
        (a) => a.status === "completed"
    ).length;

    return (
        <div className="dashboard">

            <header className="dashboard-header">
                <div>
                    <h2>AppointmentPro</h2>
                    <p>Faculty Portal</p>
                </div>

                <div className="header-user">
                    <span>Welcome, {user?.name}</span>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </header>

            <main className="dashboard-content">

                <section className="welcome-section">
                    <h1>Faculty Dashboard</h1>
                    <p>Manage your student appointments.</p>
                </section>

                <section className="stats-grid">
                    <div className="stat-card">
                        <h3>{appointments.length}</h3>
                        <p>Total Appointments</p>
                    </div>

                    <div className="stat-card">
                        <h3>{confirmed}</h3>
                        <p>Confirmed</p>
                    </div>

                    <div className="stat-card">
                        <h3>{completed}</h3>
                        <p>Completed</p>
                    </div>
                </section>

                <section className="dashboard-card">
                    <h2>Student Appointments</h2>

                    {loading ? (
                        <p>Loading appointments...</p>
                    ) : appointments.length === 0 ? (
                        <p className="empty-message">
                            No appointments booked yet.
                        </p>
                    ) : (
                        <div className="appointment-list">
                            {appointments.map((appointment) => (
                                <div
                                    className="appointment-item"
                                    key={appointment._id}
                                >
                                    <div>
                                        <h3>
                                            {appointment.student?.name || "Student"}
                                        </h3>

                                        <p>
                                            Email: {appointment.student?.email}
                                        </p>

                                        <p>
                                            Department: {appointment.student?.department || "N/A"}
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

                                    {appointment.status === "confirmed" && (
                                        <button
                                            className="complete-btn"
                                            onClick={() => handleComplete(appointment._id)}
                                        >
                                            Mark Completed
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </main>
        </div>
    );
}

export default FacultyDashboard;
