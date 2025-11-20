import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import TaskForm from '../components/TaskForm';

const CreateTask = () => {
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        try {
            await API.post('/tasks', formData);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating task');
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                Create New Task
            </h1>
            <TaskForm onSubmit={handleSubmit} submitLabel="Create Task" />
        </div>
    );
};

export default CreateTask;