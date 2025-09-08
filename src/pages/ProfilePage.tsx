import React, { useState } from 'react';
import { User, Mail, GraduationCap, Building, Edit3, Save, Camera, Heart, Bookmark, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockJobReviews } from '../data/mockData';
import ReviewCard from '../components/ReviewCard';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    university: user?.university || '',
    major: user?.major || '',
  });
  const [activeTab, setActiveTab] = useState<'my-reviews' | 'liked' | 'bookmarked'>('my-reviews');

  // 사용자의 작성 후기 (실제로는 API에서 가져올 데이터)
  const userReviews = mockJobReviews.filter(review => review.author.id === user?.id);
  const likedReviews = mockJobReviews.filter(review => review.isLiked);
  const bookmarkedReviews = mockJobReviews.filter(review => review.isBookmarked);

  const stats = {
    reviews: userReviews.length,
    likes: userReviews.reduce((total, review) => total + review.likes, 0),
    bookmarks: bookmarkedReviews.length,
  };

  const handleSave = () => {
    // 실제 구현에서는 API 호출
    setIsEditing(false);
  };

  const getCurrentReviews = () => {
    switch (activeTab) {
      case 'liked':
        return likedReviews;
      case 'bookmarked':
        return bookmarkedReviews;
      default:
        return userReviews;
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
            {/* Profile Picture */}
            <div className="relative mb-6 md:mb-0">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center mx-auto md:mx-0 shadow-lg">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-white" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg">
                <Camera size={20} />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="이름"
                  />
                  <input
                    type="text"
                    value={editForm.university}
                    onChange={(e) => setEditForm(prev => ({ ...prev, university: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="대학교"
                  />
                  <input
                    type="text"
                    value={editForm.major}
                    onChange={(e) => setEditForm(prev => ({ ...prev, major: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="전공"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save size={16} />
                      <span>저장</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit3 size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600">
                      <Mail size={16} />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600">
                      <GraduationCap size={16} />
                      <span>{user?.university}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600">
                      <Building size={16} />
                      <span>{user?.major}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 md:gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.reviews}</div>
                      <div className="text-sm text-gray-600">작성한 후기</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{stats.likes}</div>
                      <div className="text-sm text-gray-600">받은 좋아요</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{stats.bookmarks}</div>
                      <div className="text-sm text-gray-600">북마크</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {[
                { key: 'my-reviews', label: '내가 쓴 후기', icon: FileText, count: userReviews.length },
                { key: 'liked', label: '좋아요한 후기', icon: Heart, count: likedReviews.length },
                { key: 'bookmarked', label: '북마크한 후기', icon: Bookmark, count: bookmarkedReviews.length },
              ].map(({ key, label, icon: Icon, count }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {getCurrentReviews().length > 0 ? (
                getCurrentReviews().map(review => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onLike={(id) => console.log('Like:', id)}
                    onBookmark={(id) => console.log('Bookmark:', id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {activeTab === 'my-reviews' && <FileText className="text-gray-400" size={32} />}
                    {activeTab === 'liked' && <Heart className="text-gray-400" size={32} />}
                    {activeTab === 'bookmarked' && <Bookmark className="text-gray-400" size={32} />}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeTab === 'my-reviews' && '작성한 후기가 없습니다'}
                    {activeTab === 'liked' && '좋아요한 후기가 없습니다'}
                    {activeTab === 'bookmarked' && '북마크한 후기가 없습니다'}
                  </h3>
                  <p className="text-gray-600">
                    {activeTab === 'my-reviews' && '첫 번째 취업 후기를 작성해보세요!'}
                    {activeTab === 'liked' && '마음에 드는 후기에 좋아요를 눌러보세요'}
                    {activeTab === 'bookmarked' && '나중에 읽을 후기를 북마크해보세요'}
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