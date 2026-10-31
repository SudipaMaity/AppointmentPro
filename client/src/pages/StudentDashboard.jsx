
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function StudentDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [faculty, setFaculty] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        try {
            const [facultyRes, appointmentRes] = await Promise.all([
                API.get("/faculty/all"),
                API.get("/appointments/my-appointments")
            ]);

            setFaculty(facultyRes.data.faculty);
            setAppointments(appointmentRes.data.appointments);
        } catch (error) {
            alert(error.response?.data?.message || "Unable to load dashboard");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleBooking = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await API.post("/appointments/book", {
                facultyId: selectedFaculty,
                date,
                time,
                reason
            });

            alert("Appointment booked successfully!");

            setSelectedFaculty("");
            setDate("");
            setTime("");
            setReason("");

            await loadData();
        } catch (error) {
            alert(error.response?.data?.message || "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) {
            return;
        }

        try {
            await API.put(`/appointments/cancel/${id}`);
            alert("Appointment cancelled successfully!");
            await loadData();
        } catch (error) {
            alert(error.response?.data?.message || "Cancellation failed");
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="dashboard">

            <header className="dashboard-header">
                <div>
                    <h2>AppointmentPro</h2>
                    <p>Student Portal</p>
                </div>

                <div className="header-user">
                    <span>Welcome, {user?.name}</span>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </header>

            <main className="dashboard-content">

                <section className="welcome-section">
                    <h1>Student Dashboard</h1>
                    <p>Manage your faculty appointments in one place.</p>
                </section>

                <section className="stats-grid">
                    <div className="stat-card">
                        <h3>{appointments.length}</h3>
                        <p>Total Appointments</p>
                    </div>

                    <div className="stat-card">
                        <h3>{appointments.filter(a => a.status === "confirmed").length}</h3>
                        <p>Confirmed</p>
                    </div>

                    <div className="stat-card">
                        <h3>{appointments.filter(a => a.status === "completed").length}</h3>
                        <p>Completed</p>
                    </div>
                </section>

                <section className="dashboard-card">
                    <h2>Book an Appointment</h2>

                    <form onSubmit={handleBooking} className="booking-form">

                        <label>Select Faculty</label>
                        <select
                            value={selectedFaculty}
                            onChange={(e) => setSelectedFaculty(e.target.value)}
                            required
                        >
                            <option value="">Choose Faculty</option>

                            {faculty.map((f) => (
                                <option key={f._id} value={f._id}>
                                    {f.name} - {f.department}
                                </option>
                            ))}
                        </select>

                        <label>Appointment Date</label>
                        <input
                            type="date"
                            min={today}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />

                        <label>Appointment Time</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />

                        <label>Reason for Appointment</label>
                        <textarea
                            placeholder="Enter the purpose of your appointment"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? "Booking..." : "Book Appointment"}
                        </button>
                    </form>
                </section>

                <section className="dashboard-card">
                    <h2>My Appointments</h2>

                    {appointments.length === 0 ? (
                        <p className="empty-message">
                            You haven't booked any appointments yet.
                        </p>
                    ) : (
                        <div className="appointment-list">
                            {appointments.map((appointment) => (
                                <div className="appointment-item" key={appointment._id}>
                                    <div>
                                        <h3>{appointment.faculty?.name || "Faculty"}</h3>
                                        <p>{appointment.faculty?.department}</p>
                                        <p>
                                            {new Date(appointment.date).toLocaleDateString("en-IN")}
                                            {" "} | {appointment.time}
                                        </p>
                                        <p>Reason: {appointment.reason}</p>

                                        <span className={`status ${appointment.status}`}>
                                            {appointment.status}
                                        </span>
                                    </div>

                                    {appointment.status === "confirmed" && (
                                        <button
                                            className="cancel-btn"
                                            onClick={() => handleCancel(appointment._id)}
                                        >
                                            Cancel
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

export default StudentDashboard;
