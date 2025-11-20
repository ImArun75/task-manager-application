import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TaskCard = ({ task, onDelete }) => {
    const { user, isAdmin } = useAuth();

    // Authorization logic: Owner or Admin can edit/delete
    const canEdit = user?.id === task.createdBy || isAdmin;
    const canDelete = user?.id === task.createdBy || isAdmin;

    // Utility objects for dynamic styling
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        'in-progress': 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800'
    };

    const priorityColors = {
        low: 'bg-gray-100 text-gray-800',
        medium: 'bg-orange-100 text-orange-800',
        high: 'bg-red-100 text-red-800'
    };

    return (
        <div className="task-card bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-bold mb-2 text-gray-800">{task.title}</h3>

            <div className="flex space-x-2 mb-3">
                <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[task.status]}`}
                >
                    {task.status.toUpperCase()}
                </span>
                <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}
                >
                    {task.priority.toUpperCase()} Priority
                </span>
            </div>

            <p className="text-gray-600 mb-4">{task.description}</p>

            <div className="text-sm text-gray-500 mb-4">
                <p>Created by: {task.creatorName || 'Unknown'}</p>
                <p>Created: {new Date(task.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="flex space-x-3">
                {canEdit && (
                    <Link
                        to={`/edit-task/${task.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded transition duration-150"
                    >
                        Edit
                    </Link>
                )}
                {canDelete && (
                    <button
                        onClick={() => onDelete(task.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded transition duration-150"
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskCard;