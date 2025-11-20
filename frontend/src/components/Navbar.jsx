import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 text-white shadow-lg p-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">
                TaskManager
            </Link>

            <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                    <>
                        <Link to="/dashboard" className="hover:text-blue-200">
                            Dashboard
                        </Link>
                        
                        <Link to="/create-task" className="hover:text-blue-200">
                            Create Task
                        </Link>
                        
                        <span className="text-sm font-semibold">
                            {user?.username}
                        </span>
                        
                        {user?.role === 'admin' && (
                            <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full">
                                Admin
                            </span>
                        )}
                        
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition duration-150"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="hover:text-blue-200">
                            Login
                        </Link>
                        <Link to="/register" className="hover:text-blue-200">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;