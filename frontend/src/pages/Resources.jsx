import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import ResourceCard from '../components/ResourceCard';

const SearchIcon = () => (
  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const Resources = () => {
  const [resources, setResources]         = useState([]);
  const [categories, setCategories]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');
  const [searchInput, setSearchInput]     = useState('');
  const [search, setSearch]               = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    axiosInstance.get('/api/categories')
      .then(({ data }) => setCategories(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get('/api/resources', {
          params: {
            ...(search ? { search } : {}),
            ...(activeCategory ? { category: activeCategory } : {}),
          },
        });
        setResources(data);
      } catch {
        setError('Failed to load resources.');
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [search, activeCategory]);

  const handleSearch = () => setSearch(searchInput);
  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch(); };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-indigo-50 py-12 px-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Discover Your Next Learning Resource
        </h1>
        <div className="max-w-xl mx-auto flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <SearchIcon />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by title, tag, or type..."
              className="flex-1 text-sm focus:outline-none bg-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 rounded-xl transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Category pills */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveCategory('')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === ''
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(activeCategory === cat.name ? '' : cat.name)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.name
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Count row */}
        {!loading && !error && (
          <p className="text-sm text-gray-600 font-medium mb-6">{resources.length} Resources</p>
        )}

        {/* States */}
        {loading && <p className="text-center text-gray-400 py-20">Loading...</p>}
        {error   && <p className="text-center text-red-500 py-20">{error}</p>}
        {!loading && !error && resources.length === 0 && (
          <p className="text-center text-gray-400 py-20">No resources found.</p>
        )}

        {/* Grid */}
        {!loading && !error && resources.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
