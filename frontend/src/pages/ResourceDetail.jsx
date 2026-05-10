import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const difficultyStyles = {
    beginner:     'text-green-600 bg-green-50',
    intermediate: 'text-yellow-600 bg-yellow-50',
    advanced:     'text-red-600 bg-red-50',
};

const ResourceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resource, setResource] = useState(null);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState('');

    useEffect(() => {
        const fetchResource = async () => {
            try {
                const { data } = await axiosInstance.get(`/api/resources/${id}`);
                setResource(data);
            } catch {
                setError('Resource not found.');
            } finally {
                setLoading(false);
            }
        };
        fetchResource();
    }, [id]);

    if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
    if (error)   return <p className="text-center mt-10 text-red-500">{error}</p>;

    const diffStyle = difficultyStyles[resource.difficulty] || 'text-gray-600 bg-gray-50';

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <button
                onClick={() => navigate('/resources')}
                className="text-sm text-blue-500 hover:underline mb-6 inline-block"
            >
                ← Back to resources
            </button>

            <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {resource.type}
                    </span>
                    <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded ${diffStyle}`}>
                        {resource.difficulty}
                    </span>
                    {resource.category && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {resource.category}
                        </span>
                    )}
                </div>

                <h1 className="text-2xl font-bold text-gray-800">{resource.title}</h1>

                {resource.description && (
                    <p className="text-gray-600">{resource.description}</p>
                )}

                {resource.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {resource.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-blue-700 w-fit"
                >
                    Open resource →
                </a>
            </div>
        </div>
    );
};

export default ResourceDetail;
