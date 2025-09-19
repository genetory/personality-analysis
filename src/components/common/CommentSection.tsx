'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  nickname: string;
  content: string;
  rating?: number;
  likes: number;
  created_at: string;
}

interface CommentListResponse {
  comments: Comment[];
  total_count: number;
  page: number;
  per_page: number;
  total_pages: number;
}

interface CommentSectionProps {
  analysisId: string;
}

export default function CommentSection({ analysisId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // 댓글 작성 폼
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number | null>(null);

  // 댓글 목록 조회
  const fetchComments = async (page: number = 1, sort: 'latest' | 'popular' = 'latest') => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/comments/analysis/${analysisId}?sort_by=${sort}&page=${page}&per_page=10`
      );
      const data: CommentListResponse = await response.json();
      
      setComments(data.comments || []);
      setTotalCount(data.total_count || 0);
      setCurrentPage(data.page || 1);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error('댓글 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 댓글 작성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/comments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysis_id: analysisId,
          nickname: nickname.trim(),
          content: content.trim(),
          rating: rating || undefined,
        }),
      });

      if (response.ok) {
        setNickname('');
        setContent('');
        setRating(null);
        fetchComments(1, sortBy); // 첫 페이지로 이동하여 새 댓글 확인
      } else {
        console.error('댓글 작성 실패');
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // 좋아요
  const handleLike = async (commentId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/comments/${commentId}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchComments(currentPage, sortBy); // 현재 페이지 새로고침
      }
    } catch (error) {
      console.error('좋아요 실패:', error);
    }
  };

  // 정렬 변경
  const handleSortChange = (newSort: 'latest' | 'popular') => {
    setSortBy(newSort);
    fetchComments(1, newSort);
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchComments(page, sortBy);
  };

  // 초기 로드
  useEffect(() => {
    fetchComments();
  }, [analysisId]);

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}일 전`;
    
    return date.toLocaleDateString('ko-KR');
  };

  // 별점 렌더링
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="w-full px-4 py-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">💬 평가 및 댓글</h2>
      
      {/* 댓글 작성 폼 */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">댓글 작성하기</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={50}
              required
            />
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600">별점:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(rating === star ? null : star)}
                  className={`text-2xl ${rating && star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <textarea
            placeholder="댓글을 작성해주세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            maxLength={1000}
            required
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{content.length}/1000</span>
            <button
              type="submit"
              disabled={submitting || !nickname.trim() || !content.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? '작성 중...' : '댓글 작성'}
            </button>
          </div>
        </form>
      </div>

      {/* 정렬 및 통계 */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <span className="text-gray-600">총 {totalCount}개의 댓글</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleSortChange('latest')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                sortBy === 'latest'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => handleSortChange('popular')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                sortBy === 'popular'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              인기순
            </button>
          </div>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">댓글을 불러오는 중...</p>
          </div>
        ) : !comments || comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
          </div>
        ) : (
          (comments || []).map((comment) => (
            <div key={comment.id} className="py-6 border-b border-gray-100 last:border-b-0">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {comment.nickname.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{comment.nickname}</h4>
                    <p className="text-sm text-gray-500">{formatDate(comment.created_at)}</p>
                  </div>
                </div>
                {comment.rating && (
                  <div className="flex items-center gap-1">
                    {renderStars(comment.rating)}
                  </div>
                )}
              </div>
              
              <p className="text-gray-700 mb-4 leading-relaxed">{comment.content}</p>
              
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleLike(comment.id)}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <span className="text-lg">❤️</span>
                  <span className="text-sm">{comment.likes}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            이전
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
