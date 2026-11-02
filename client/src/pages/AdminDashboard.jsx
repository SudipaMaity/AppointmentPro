
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Dashboard.css";

const AdminDashboard = () => {
    const navigate = useNavigate();

    // Dashboard statistics
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalFaculty: 0,
        totalAppointments: 0,
        confirmedAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0
    });

    // Data states
    const [appointments, setAppointments] = useState([]);
    const [faculties, setFaculties] = useState([]);

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [facultyListError, setFacultyListError] = useState("");

    // Faculty registration form
    const [facultyForm, setFacultyForm] = useState({
        name: "",
        email: "",
        password: "",
        department: "",
        designation: ""
    });

    const [facultyLoading, setFacultyLoading] = useState(false);
    const [facultyMessage, setFacultyMessage] = useState("");
    const [facultyError, setFacultyError] = useState("");

    // Fetch dashboard statistics
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

    // Fetch all appointments
    const fetchAppointments = async () => {
        try {
            const response = await API.get("/admin/all-appointments");
            setAppointments(response.data.appointments || []);
        } catch (err) {
            console.log("Unable to fetch appointments:", err);
        }
    };

    // Fetch all faculty members
    const fetchFaculties = async () => {
        try {
            const response = await API.get("/faculty/all");
            setFaculties(response.data.faculty || []);
            setFacultyListError("");
        } catch (err) {
            console.log("Unable to fetch faculty:", err);
            setFacultyListError("Unable to load faculty members.");
        }
    };

    // Load dashboard data
    useEffect(() => {
        fetchStats();
        fetchAppointments();
        fetchFaculties();
    }, []);

    // Handle faculty form inputs
    const handleFacultyChange = (e) => {
        setFacultyForm({
            ...facultyForm,
            [e.target.name]: e.target.value
        });
    };

    // Register faculty
    const handleFacultySubmit = async (e) => {
        e.preventDefault();

        setFacultyLoading(true);
        setFacultyMessage("");
        setFacultyError("");

        try {
            const response = await API.post(
                "/admin/create-faculty",
                facultyForm
            );

            setFacultyMessage(response.data.message);

            // Clear form
            setFacultyForm({
                name: "",
                email: "",
                password: "",
                department: "",
                designation: ""
            });

            // Refresh dashboard data
            await Promise.all([
                fetchStats(),
                fetchFaculties()
            ]);

        } catch (err) {
            setFacultyError(
                err.response?.data?.message ||
                "Unable to register faculty."
            );
        } finally {
            setFacultyLoading(false);
        }
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        window.location.reload();
    };

    // Statistics cards
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

            {/* Dashboard Header */}
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

                {/* Welcome Section */}
                <section className="welcome-section">
                    <h1>Dashboard Overview</h1>
                    <p>
                        Monitor students, faculty and appointments.
                    </p>
                </section>

                {/* Dashboard Statistics */}
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

                {/* Add Faculty Section */}
                <section className="dashboard-card faculty-form-card">

                    <div className="faculty-form-header">
                        <h2>Add Faculty Member</h2>
                        <p>Register a new faculty account.</p>
                    </div>

                    {facultyMessage && (
                        <div className="faculty-success">
                            {facultyMessage}
                        </div>
                    )}

                    {facultyError && (
                        <div className="faculty-error">
                            {facultyError}
                        </div>
                    )}

                    <form
                        onSubmit={handleFacultySubmit}
                        className="faculty-form"
                    >
                        <div className="faculty-form-grid">

                            <div className="faculty-form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={facultyForm.name}
                                    onChange={handleFacultyChange}
                                    placeholder="Enter faculty name"
                                    required
                                />
                            </div>

                            <div className="faculty-form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={facultyForm.email}
                                    onChange={handleFacultyChange}
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>

                            <div className="faculty-form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={facultyForm.password}
                                    onChange={handleFacultyChange}
                                    placeholder="Minimum 6 characters"
                                    minLength="6"
                                    required
                                />
                            </div>

                            <div className="faculty-form-group">
                                <label>Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={facultyForm.department}
                                    onChange={handleFacultyChange}
                                    placeholder="Enter department"
                                    required
                                />
                            </div>

                            <div className="faculty-form-group">
                                <label>Designation</label>
                                <input
                                    type="text"
                                    name="designation"
                                    value={facultyForm.designation}
                                    onChange={handleFacultyChange}
                                    placeholder="Enter designation"
                                    required
                                />
                            </div>

                        </div>

                        <div className="faculty-form-actions">
                            <button
                                type="submit"
                                disabled={facultyLoading}
                            >
                                {facultyLoading
                                    ? "Registering..."
                                    : "Register Faculty"}
                            </button>
                        </div>
                    </form>
                </section>

                {/* All Faculty Members */}
                <section className="dashboard-card">

                    <div className="section-heading">
                        <div>
                            <h2>All Faculty Members</h2>
                            <p>View all registered faculty members.</p>
                        </div>

                        <span className="section-count">
                            {faculties.length} Faculty
                        </span>
                    </div>

                    {facultyListError ? (
                        <p className="empty-message">
                            {facultyListError}
                        </p>
                    ) : faculties.length === 0 ? (
                        <p className="empty-message">
                            No faculty members found.
                        </p>
                    ) : (
                        <div className="admin-card-grid">

                            {faculties.map((faculty) => (
                                <div
                                    className="admin-info-card"
                                    key={faculty._id}
                                >
                                    <div className="admin-card-top">
                                        <div className="faculty-avatar">
                                            {faculty.name?.charAt(0).toUpperCase()}
                                        </div>

                                        <span className="faculty-role">
                                            Faculty
                                        </span>
                                    </div>

                                    <h3>{faculty.name}</h3>

                                    <p className="admin-card-email">
                                        {faculty.email}
                                    </p>

                                    <div className="admin-card-details">
                                        <p>
                                            <strong>Department:</strong>{" "}
                                            {faculty.department || "N/A"}
                                        </p>

                                        <p>
                                            <strong>Designation:</strong>{" "}
                                            {faculty.designation || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}
                </section>

                {/* All Appointments */}
                <section className="dashboard-card">

                    <div className="section-heading">
                        <div>
                            <h2>All Appointments</h2>
                            <p>
                                View and monitor all booked appointments.
                            </p>
                        </div>

                        <span className="section-count">
                            {appointments.length} Appointments
                        </span>
                    </div>

                    {appointments.length === 0 ? (
                        <p className="empty-message">
                            No appointments found.
                        </p>
                    ) : (
                        <div className="admin-card-grid">

                            {appointments.map((appointment) => (
                                <div
                                    className="admin-info-card appointment-admin-card"
                                    key={appointment._id}
                                >
                                    <div className="admin-card-top">
                                        <span className="appointment-label">
                                            Appointment
                                        </span>

                                        <span className={`status ${appointment.status}`}>
                                            {appointment.status}
                                        </span>
                                    </div>

                                    <h3>
                                        {appointment.student?.name ||
                                            "Unknown Student"}
                                    </h3>

                                    <p className="admin-card-email">
                                        {appointment.student?.email || "N/A"}
                                    </p>

                                    <div className="admin-card-details">
                                        <p>
                                            <strong>Faculty:</strong>{" "}
                                            {appointment.faculty?.name || "N/A"}
                                        </p>

                                        <p>
                                            <strong>Date:</strong>{" "}
                                            {new Date(
                                                appointment.date
                                            ).toLocaleDateString("en-IN")}
                                        </p>

                                        <p>
                                            <strong>Time:</strong>{" "}
                                            {appointment.time}
                                        </p>

                                        <p>
                                            <strong>Reason:</strong>{" "}
                                            {appointment.reason}
                                        </p>
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
