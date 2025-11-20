import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <main className="p-4 sm:p-6">
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />

                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/create-task"
                                element={
                                    <ProtectedRoute>
                                        <CreateTask />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/edit-task/:id"
                                element={
                                    <ProtectedRoute>
                                        <EditTask />
                                    </ProtectedRoute>
                                }
                            />

                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;