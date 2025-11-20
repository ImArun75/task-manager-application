import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import TaskForm from '../components/TaskForm';

const EditTask = () => {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchTask();
    }, [id]);

    const fetchTask = async () => {
        try {
            const response = await API.get(`/tasks/${id}`);
            setTask(response.data.task);
        } catch (err) {
            alert(err.response?.data?.message || 'Error fetching task');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            await API.put(`/tasks/${id}`, formData);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Error updating task');
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-10 text-lg">
                Loading task...
            </div>
        );
    }

    // Ensure task data exists before rendering the form
    if (!task) {
        return <div className="text-center mt-10 text-xl text-red-600">Task not found or unauthorized.</div>;
    }

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                Edit Task
            </h1>
            <TaskForm
                initialData={task}
                onSubmit={handleSubmit}
                submitLabel="Update Task"
            />
        </div>
    );
};

export default EditTask;