import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const typeBadgeColor = {
  video:    'bg-blue-50 text-blue-700',
  course:   'bg-purple-50 text-purple-700',
  article:  'bg-green-50 text-green-700',
  tutorial: 'bg-amber-50 text-amber-700',
  book:     'bg-pink-50 text-pink-700',
  tool:     'bg-cyan-50 text-cyan-700',
  other:    'bg-gray-50 text-gray-700',
};

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [related, setRelated]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/resources/${id}`);
        setResource(data);
        if (data.category) {
          const { data: rel } = await axiosInstance.get('/api/resources', {
            params: { category: data.category },
          });
          setRelated(rel.filter((r) => r._id !== id).slice(0, 3));
        }
      } catch {
        setError('Resource not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  if (loading) return <p className="text-center mt-20 text-gray-400">Loading...</p>;
  if (error)   return <p className="text-center mt-20 text-red-500">{error}</p>;

  const badgeColor = typeBadgeColor[resource.type] || 'bg-gray-50 text-gray-700';
  const added = new Date(resource.createdAt).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-2 flex items-center gap-1">
          <Link to="/resources" className="hover:text-gray-600">Home</Link>
          <span>/</span>
          <Link to="/resources" className="hover:text-gray-600">Browse</Link>
          <span>/</span>
          <span className="text-gray-600 truncate">{resource.title}</span>
        </nav>
        <button
          onClick={() => navigate('/resources')}
          className="text-sm text-indigo-600 hover:underline mb-6 inline-block"
        >
          ← Back to Browse
        </button>

        <div className="flex gap-6 items-start">
          {/* Left main column */}
          <div className="flex-1 min-w-0">
            {/* Banner */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-6">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md capitalize inline-block mb-3 ${badgeColor}`}>
                {resource.type}
              </span>
              <h1 className="text-2xl font-bold text-gray-900">{resource.title}</h1>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
              {resource.category && (
                <span className="text-gray-700 font-medium">{resource.category}</span>
              )}
              {resource.difficulty && (
                <span>· <span className="capitalize">{resource.difficulty}</span></span>
              )}
              {resource.createdAt && (
                <span>· Added: {added}</span>
              )}
            </div>

            {/* Tags */}
            {resource.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {resource.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <hr className="border-gray-200 mb-6" />

            {/* Description */}
            {resource.description && (
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{resource.description}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
              >
                Open Resource ↗
              </a>
              <button className="border border-gray-200 text-gray-600 text-sm px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Bookmark
              </button>
              <button className="text-gray-500 text-sm px-4 py-2.5 hover:text-gray-700 flex items-center gap-1 transition-colors">
                Share ↗
              </button>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="w-72 flex-shrink-0 flex flex-col gap-4">
            {/* Resource Details */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800">Resource Details</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  ['Type',       resource.type       ? resource.type.charAt(0).toUpperCase()       + resource.type.slice(1)       : null],
                  ['Category',   resource.category   || null],
                  ['Difficulty', resource.difficulty ? resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1) : null],
                  ['Added',      added],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs text-gray-400">{label}</span>
                    <span className="text-xs font-medium text-gray-800 bg-gray-50 px-2.5 py-1 rounded">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Resources */}
            {related.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-800">Related Resources</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {related.map((r) => (
                    <Link
                      key={r._id}
                      to={`/resources/${r._id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span className={`text-xs font-medium px-2 py-0.5 rounded flex-shrink-0 ${typeBadgeColor[r.type] || 'bg-gray-50 text-gray-700'}`}>
                        {r.type}
                      </span>
                      <span className="text-xs text-gray-700 font-medium line-clamp-1">{r.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;
