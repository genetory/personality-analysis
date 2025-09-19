'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import CommentSection from '@/components/common/CommentSection';

interface Analysis {
  id: string;
  name: string;
  description: string;
  total_questions: number;
  estimated_time: number;
  category: string;
  participants: number;
  thumb_image_url?: string;
  is_active: number;
  created_at: string;
  updated_at?: string;
}

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/analysis/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setAnalysis(data);
        }
      } catch (error) {
        console.error('분석 정보 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [params.id]);

  const handleStartTest = () => {
    // 모든 분석을 바로 채팅창으로 이동 (성별 선택은 채팅에서)
    if (params.id === 'egen-teto') {
      router.push('/analysis/egen-teto');
    } else if (params.id === 'bdsm') {
      router.push('/analysis/bdsm');
    } else {
      // 일반 분석의 경우도 바로 채팅창으로 이동
      router.push(`/analysis/${params.id}/chat`);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personality':
        return { color: 'text-blue-600', bgColor: 'bg-blue-50', categoryName: '성격' };
      case 'psychology':
        return { color: 'text-green-600', bgColor: 'bg-green-50', categoryName: '심리' };
      case 'relationship':
        return { color: 'text-purple-600', bgColor: 'bg-purple-50', categoryName: '관계' };
      case 'career':
        return { color: 'text-orange-600', bgColor: 'bg-orange-50', categoryName: '진로' };
      default:
        return { color: 'text-gray-600', bgColor: 'bg-gray-50', categoryName: '기타' };
    }
  };

  const getHashtags = (category: string) => {
    switch (category) {
      case 'personality':
        return ['#성격분석', '#MBTI', '#성향테스트', '#16유형'];
      case 'psychology':
        return ['#심리분석', '#성향테스트', '#자기이해'];
      case 'relationship':
        return ['#관계분석', '#성향테스트', '#궁합'];
      case 'career':
        return ['#진로분석', '#성향테스트', '#직업적성'];
      default:
        return ['#성향분석', '#테스트'];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">분석을 찾을 수 없습니다.</div>
      </div>
    );
  }

  const { color, bgColor, categoryName } = getCategoryColor(analysis.category);
  const hashtags = getHashtags(analysis.category);

  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션바 */}
      <div className="flex-shrink-0 bg-white">
        <div className="max-w-[700px] mx-auto px-4 py-4 flex items-center">
          <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800 mr-4 flex-shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 leading-tight break-words">{analysis.name}</h2>
        </div>
      </div>
      
      <div className="max-w-[700px] mx-auto px-4 py-8">
        
        {/* 메인 헤더 섹션 */}
        <div className="text-center mb-12">
          <div className={`inline-block ${bgColor} px-4 py-2 rounded-full mb-4`}>
            <span className={`text-sm font-medium ${color}`}>{analysis.category} 분석</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight break-words">
            {analysis.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed break-words whitespace-pre-line">
            {analysis.description}
          </p>
        </div>

        {/* 분석 정보 */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-8 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">질문 수</p>
              <p className="text-lg font-semibold text-gray-900">{analysis.total_questions}개</p>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">소요 시간</p>
              <p className="text-lg font-semibold text-gray-900">약 {analysis.estimated_time}분</p>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">정확도</p>
              <p className="text-lg font-semibold text-gray-900">95%</p>
            </div>
          </div>

          {/* 해시태그 */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {hashtags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 테스트 시작 버튼 */}
          <div className="text-center">
            <button
              onClick={handleStartTest}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-12 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              🚀 분석 시작하기
            </button>
            <p className="text-sm text-gray-500 mt-3">무료로 시작하고 결과를 확인해보세요</p>
          </div>
        </div>


      </div>
      
      {/* 댓글 섹션 */}
      <div className="bg-white w-full">
        <div className="max-w-[700px] mx-auto">
          <CommentSection analysisId={params.id as string} />
        </div>
      </div>
    </div>
  );
}
