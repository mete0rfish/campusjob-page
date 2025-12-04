import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as api from '../api';
import { ReviewResponse } from '../types';
import { ArrowLeft, User, Calendar, Building, Trash2 } from 'lucide-react';

const ReviewDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReview = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const reviewId = parseInt(id, 10);
        if (isNaN(reviewId)) {
          setError('유효하지 않은 리뷰 ID입니다.');
          setLoading(false);
          return;
        }
        const data = await api.getReview(reviewId);
        setReview(data);
      } catch (err) {
        setError('리뷰를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      try {
        const reviewId = parseInt(id, 10);
        await api.deleteReview(reviewId);
        navigate('/reviews');
      } catch (err) {
        if (err instanceof Error) {
            try {
                const errorResponse = JSON.parse(err.message);
                if (errorResponse.code === 'COMMON_002') {
                    setError('삭제할 권한이 없습니다.');
                } else {
                    setError('리뷰 삭제 중 오류가 발생했습니다.');
                }
            } catch (e) {
                setError('리뷰 삭제 중 오류가 발생했습니다.');
            }
        } else {
            setError('리뷰 삭제 중 오류가 발생했습니다.');
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
          <Link to="/reviews" className="text-blue-600 hover:underline">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

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
        <div className="flex justify-between items-center mb-8">
          <Link to="/reviews" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200">
            <ArrowLeft size={20} className="mr-2" />
            <span>모든 후기로 돌아가기</span>
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center text-red-600 hover:text-red-800 transition-colors duration-200"
          >
            <Trash2 size={20} className="mr-2" />
            <span>삭제</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{review.company} 리뷰</h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600 mb-6">
              <div className="flex items-center"><Building size={16} className="mr-1.5" /> {review.company}</div>
              <div className="flex items-center"><User size={16} className="mr-1.5" /> 나이: {review.age}</div>
              <div className="flex items-center"><Calendar size={16} className="mr-1.5" /> 구직 기간: {review.seekPeriod}</div>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>{review.tip}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">자격증</h3>
              <div className="flex flex-wrap gap-2">
                {review.certificates.map(cert => (
                  <span key={cert} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default ReviewDetailPage;