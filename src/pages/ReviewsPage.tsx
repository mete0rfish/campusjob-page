import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import ReviewCard from '../components/ReviewCard';
import { ReviewResponse } from '../types';
import * as api from '../api';

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await api.getReviews();
        setReviews(data.content || []);
        setTotalElements(data.totalElements || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : '리뷰를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">취업 후기</h1>
            <p className="text-gray-600">선배들의 생생한 취업 경험을 확인해보세요</p>
          </div>
          <Link
            to="/write"
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-green-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
          >
            <Plus size={20} />
            <span>후기 작성</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                총 <span className="font-semibold text-gray-900">{totalElements}</span>개의 후기
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {reviews.length > 0 ? (
                reviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">아직 작성된 후기가 없습니다</h3>
                  <p className="text-gray-600">가장 먼저 후기를 작성해보세요!</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
