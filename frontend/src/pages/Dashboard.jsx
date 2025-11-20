import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import TaskCard from '../components/TaskCard';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    
    const { user, isAdmin } = useAuth();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await API.get('/tasks');
            setTasks(response.data.tasks);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }
        try {
            await API.delete(`/tasks/${taskId}`);
            // Optimistically update the UI
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting task');
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        return task.status === filter;
    });

    if (loading) {
        return (
            <div className="text-center mt-10 text-lg">
                Loading tasks...
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold mb-2 text-gray-800">
                {isAdmin ? 'All Tasks (Admin View)' : 'My Tasks'}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
                Welcome back, {user?.username}!
            </p>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            <div className="flex space-x-4 mb-8">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded font-medium transition duration-150 ${
                        filter === 'all'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    All ({tasks.length})
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded font-medium transition duration-150 ${
                        filter === 'pending'
                            ? 'bg-yellow-500 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Pending ({tasks.filter(t => t.status === 'pending').length})
                </button>
                <button
                    onClick={() => setFilter('in-progress')}
                    className={`px-4 py-2 rounded font-medium transition duration-150 ${
                        filter === 'in-progress'
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    In Progress ({tasks.filter(t => t.status === 'in-progress').length})
                </button>
                <button
                    onClick={() => setFilter('completed')}
                    className={`px-4 py-2 rounded font-medium transition duration-150 ${
                        filter === 'completed'
                            ? 'bg-green-500 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Completed ({tasks.filter(t => t.status === 'completed').length})
                </button>
            </div>

            {filteredTasks.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-xl text-gray-500">
                        No tasks found
                    </p>
                    <p className="text-gray-400 mt-2">
                        Create a task to get started!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;