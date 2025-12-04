import React, { useState, useEffect } from 'react';
import { User, Mail, Edit3, Save, Camera, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ReviewCard from '../components/ReviewCard';
import { ReviewResponse, MemberResponse } from '../types';
import * as api from '../api';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<MemberResponse | null>(null);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const memberData = await api.getMe();
        setProfile(memberData);

        const reviewsData = await api.getReviews();
        setReviews(reviewsData.content || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
            {/* Profile Picture */}
            <div className="relative mb-6 md:mb-0">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center mx-auto md:mx-0 shadow-lg">
                <User size={48} className="text-white" />
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg">
                <Camera size={20} />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
                <>
                  <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{profile?.name}</h1>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600">
                      <Mail size={16} />
                      <span>{profile?.email}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 md:gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{reviews.length}</div>
                      <div className="text-sm text-gray-600">작성한 후기</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">0</div>
                      <div className="text-sm text-gray-600">받은 좋아요</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">0</div>
                      <div className="text-sm text-gray-600">북마크</div>
                    </div>
                  </div>
                </>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
                <button
                  className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors border-blue-500 text-blue-600'
                  }`}
                >
                  <FileText size={16} />
                  <span>내가 쓴 후기</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {reviews.length}
                  </span>
                </button>
            </nav>
          </div>

          <div className="p-8">
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
                    <FileText className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    작성한 후기가 없습니다
                  </h3>
                  <p className="text-gray-600">
                    첫 번째 취업 후기를 작성해보세요!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;