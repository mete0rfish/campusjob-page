import React from 'react';
import { Heart, Bookmark, Calendar, Building, MapPin } from 'lucide-react';
import { JobReview } from '../types';
import { Link } from 'react-router-dom';

interface ReviewCardProps {
  review: JobReview;
  onLike?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onTagClick?: (tag: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onLike, onBookmark, onTagClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link 
              to={`/reviews/${review.id}`}
              className="block hover:text-blue-600 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {review.title}
              </h3>
            </Link>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-1">
                <Building size={14} />
                <span className="font-medium">{review.company}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin size={14} />
                <span>{review.position}</span>
              </div>
              {review.salary && (
                <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {review.salary}
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {review.content}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {review.tags.slice(0, 3).map((tag, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTagClick?.(tag);
              }}
              className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors"
            >
              #{tag}
            </button>
          ))}
          {review.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
              +{review.tags.length - 3}개
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {review.author.avatar && (
                <img
                  src={review.author.avatar}
                  alt={review.author.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              <div className="text-xs">
                <p className="text-gray-900 font-medium">{review.author.name}</p>
                <p className="text-gray-500">{review.author.university}</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Calendar size={12} />
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onLike?.(review.id)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                review.isLiked
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <Heart size={14} className={review.isLiked ? 'fill-current' : ''} />
              <span>{review.likes}</span>
            </button>

            <button
              onClick={() => onBookmark?.(review.id)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                review.isBookmarked
                  ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                  : 'bg-gray-50 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600'
              }`}
            >
              <Bookmark size={14} className={review.isBookmarked ? 'fill-current' : ''} />
              <span>{review.bookmarks}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;