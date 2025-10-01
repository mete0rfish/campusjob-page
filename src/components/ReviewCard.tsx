import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Award, Building } from 'lucide-react';
import { ReviewResponse } from '../types';

interface ReviewCardProps {
  review: ReviewResponse;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <Link to={`/reviews/${review.id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col">
        <div className="p-6 flex-grow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                <Building size={16} className="text-gray-400" />
                <span className="font-semibold text-blue-600">{review.company}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                <Star size={16} className="text-yellow-500" />
                <span className="font-medium">취업 꿀팁</span>
              </div>
              <p className="text-gray-800 text-base mb-4 line-clamp-4 flex-grow">
                {review.tip}
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <Award size={16} className="text-blue-500" />
            <span className="font-medium">보유 스펙</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(review.certificates || []).length > 0 ? (
              review.certificates.map((cert, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                >
                  {cert}
                </span>
              ))
            ) : (
              <p className="text-xs text-gray-500">자격증 정보가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ReviewCard;
