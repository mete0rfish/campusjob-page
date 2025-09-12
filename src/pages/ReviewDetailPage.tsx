import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockJobReviews } from '../data/mockData';
import { ArrowLeft, ThumbsUp, Bookmark, User, Building, Briefcase, DollarSign, Calendar, Tag } from 'lucide-react';

const ReviewDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const review = mockJobReviews.find(r => r.id === id);

  if (!review) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">리뷰를 찾을 수 없습니다.</h2>
          <Link to="/reviews" className="text-blue-600 hover:underline">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/reviews" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200">
            <ArrowLeft size={20} className="mr-2" />
            <span>모든 후기로 돌아가기</span>
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{review.title}</h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600 mb-6">
              <div className="flex items-center"><Building size={16} className="mr-1.5" /> {review.company}</div>
              <div className="flex items-center"><Briefcase size={16} className="mr-1.5" /> {review.position}</div>
              <div className="flex items-center"><DollarSign size={16} className="mr-1.5" /> {review.salary}</div>
              <div className="flex items-center"><Calendar size={16} className="mr-1.5" /> {new Date(review.createdAt).toLocaleDateString()}</div>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {review.content}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {review.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6 mt-8 lg:mt-0">
            {/* Author Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">작성자 정보</h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={32} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{review.author.name}</p>
                  <p className="text-sm text-gray-600">{review.author.university}</p>
                  <p className="text-sm text-gray-500">{review.author.major}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-around">
                <button className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  <ThumbsUp size={24} />
                  <span className="mt-1 text-sm font-medium">{review.likes}</span>
                </button>
                <button className="flex flex-col items-center text-gray-600 hover:text-yellow-600 transition-colors duration-200">
                  <Bookmark size={24} />
                  <span className="mt-1 text-sm font-medium">{review.bookmarks}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailPage;
