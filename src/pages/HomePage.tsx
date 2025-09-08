import React, { useState } from 'react';
import { Search, TrendingUp, Clock, Bookmark, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';
import { mockJobReviews } from '../data/mockData';
import { JobReview } from '../types';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<JobReview[]>(mockJobReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'latest' | 'popular' | 'bookmarked'>('latest');

  const handleLike = (reviewId: string) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId
          ? {
              ...review,
              isLiked: !review.isLiked,
              likes: review.isLiked ? review.likes - 1 : review.likes + 1,
            }
          : review
      )
    );
  };

  const handleBookmark = (reviewId: string) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId
          ? {
              ...review,
              isBookmarked: !review.isBookmarked,
              bookmarks: review.isBookmarked ? review.bookmarks - 1 : review.bookmarks + 1,
            }
          : review
      )
    );
  };

  const filteredReviews = reviews
    .filter(review =>
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.position.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(review => {
      if (activeTab === 'bookmarked') {
        return review.isBookmarked;
      }
      return true;
    })
    .sort((a, b) => {
      if (activeTab === 'popular') {
        return b.likes - a.likes;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const popularCompanies = ['네이버', '카카오', '삼성전자', '토스', 'LG전자', '쿠팡'];

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
                <p className="text-2xl font-bold text-gray-900">1,234</p>
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
                <p className="text-2xl font-bold text-gray-900">42</p>
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
                  {reviews.filter(r => r.isBookmarked).length}
                </p>
                <p className="text-gray-600">북마크한 후기</p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Companies */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">인기 기업</h2>
          <div className="flex flex-wrap gap-3">
            {popularCompanies.map(company => (
              <button
                key={company}
                onClick={() => setSearchTerm(company)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-200 text-sm font-medium"
              >
                {company}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="relative flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="기업명, 직무, 제목으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { key: 'latest', label: '최신순', icon: Clock },
                { key: 'popular', label: '인기순', icon: TrendingUp },
                { key: 'bookmarked', label: '북마크', icon: Bookmark },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReviews.length > 0 ? (
            filteredReviews.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
                onLike={handleLike}
                onBookmark={handleBookmark}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600">다른 키워드로 검색해보세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;