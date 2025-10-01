import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Clock, Bookmark, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';
import { ReviewResponse } from '../types';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../api';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const data = await api.getReviews();
        setReviews(data.content || []);
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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              안녕하세요, {user?.name}님! 👋
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              동료들의 생생한 취업 후기를 확인하고 나만의 경험을 공유해보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/reviews"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg"
              >
                취업후기 둘러보기
              </Link>
              <Link
                to="/write"
                className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2"
              >
                <Plus size={20} />
                <span>내 후기 작성하기</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
                <p className="text-gray-600">총 취업후기</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
                <p className="text-gray-600">이번 주 새 후기</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Bookmark className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  0
                </p>
                <p className="text-gray-600">북마크한 후기</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12">Loading...</div>
          ) : error ? (
            <div className="col-span-full text-center py-12 text-red-500">{error}</div>
          ) : reviews.length > 0 ? (
            reviews.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">작성된 후기가 없습니다</h3>
              <p className="text-gray-600">가장 먼저 후기를 작성해보세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
