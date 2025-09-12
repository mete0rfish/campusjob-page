import React, { useState } from 'react';
import { Search, Filter, SortDesc } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';
import { mockJobReviews } from '../data/mockData';
import { JobReview } from '../types';

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<JobReview[]>(mockJobReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'salary'>('latest');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterPosition, setFilterPosition] = useState('');

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

  const filteredAndSortedReviews = reviews
    .filter(review => {
      const matchesSearch = 
        review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCompany = !filterCompany || review.company === filterCompany;
      const matchesPosition = !filterPosition || review.position.includes(filterPosition);
      
      return matchesSearch && matchesCompany && matchesPosition;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.likes - a.likes;
        case 'salary':
          // 간단한 급여 정렬 (실제로는 더 복잡한 로직 필요)
          const salaryA = a.salary?.includes('만원') ? parseInt(a.salary) : 0;
          const salaryB = b.salary?.includes('만원') ? parseInt(b.salary) : 0;
          return salaryB - salaryA;
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const companies = Array.from(new Set(mockJobReviews.map(review => review.company)));
  const positions = ['개발자', '디자이너', '마케터', '기획자', '영업', '인사'];

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">취업 후기</h1>
          <p className="text-gray-600">선배들의 생생한 취업 경험을 확인해보세요</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="제목, 기업명, 직무로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Company Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
              >
                <option value="">모든 기업</option>
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <SortDesc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
              >
                <option value="latest">최신순</option>
                <option value="popular">인기순</option>
                <option value="salary">연봉순</option>
              </select>
            </div>
          </div>

          {/* Position Filters */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setFilterPosition('')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                !filterPosition
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            {positions.map(position => (
              <button
                key={position}
                onClick={() => setFilterPosition(position)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                  filterPosition === position
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {position}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            총 <span className="font-semibold text-gray-900">{filteredAndSortedReviews.length}</span>개의 후기
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedReviews.length > 0 ? (
            filteredAndSortedReviews.map(review => (
              <Link key={review.id} to={`/reviews/${review.id}`}>
                <ReviewCard
                  review={review}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                />
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600">검색 조건을 변경해보세요</p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {filteredAndSortedReviews.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-white text-gray-700 px-8 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium">
              더 많은 후기 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;