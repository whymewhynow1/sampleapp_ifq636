import { Link } from 'react-router-dom';

const typeBorderColor = {
  video:    'border-blue-500',
  course:   'border-purple-500',
  article:  'border-green-500',
  tutorial: 'border-amber-500',
  book:     'border-pink-500',
  tool:     'border-cyan-500',
  other:    'border-gray-400',
};

const typeBadgeColor = {
  video:    'bg-blue-50 text-blue-700',
  course:   'bg-purple-50 text-purple-700',
  article:  'bg-green-50 text-green-700',
  tutorial: 'bg-amber-50 text-amber-700',
  book:     'bg-pink-50 text-pink-700',
  tool:     'bg-cyan-50 text-cyan-700',
  other:    'bg-gray-50 text-gray-700',
};

const difficultyDot = {
  beginner:     'bg-green-500',
  intermediate: 'bg-amber-500',
  advanced:     'bg-red-500',
};

const ResourceCard = ({ resource }) => {
  const borderColor = typeBorderColor[resource.type] || 'border-gray-400';
  const badgeColor  = typeBadgeColor[resource.type]  || 'bg-gray-50 text-gray-700';
  const dot         = difficultyDot[resource.difficulty] || 'bg-gray-400';

  return (
    <Link to={`/resources/${resource._id}`} className="block h-full">
      <div className={`bg-white rounded-xl shadow-sm border-t-4 ${borderColor} p-5 flex flex-col gap-3 h-full hover:shadow-md transition-shadow cursor-pointer`}>
        <div className="flex items-start justify-between">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-md capitalize ${badgeColor}`}>
            {resource.type}
          </span>
          <button
            className="text-gray-300 hover:text-gray-500 transition-colors"
            onClick={(e) => e.preventDefault()}
            aria-label="Bookmark"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        <div className="flex-1">
          <h2 className="text-sm font-bold text-gray-800 leading-snug">{resource.title}</h2>
          {resource.description && (
            <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{resource.description}</p>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
          <span className="text-xs text-gray-500 capitalize">{resource.difficulty}</span>
        </div>
      </div>
    </Link>
  );
};

export default ResourceCard;
