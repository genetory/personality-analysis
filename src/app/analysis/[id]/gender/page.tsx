'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Analysis {
  id: string;
  title: string;
  description: string;
  total_questions: string;
}

export default function GenderSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGender, setSelectedGender] = useState<string>('');

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

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
  };

  const handleNext = () => {
    if (selectedGender) {
      // 성별 정보를 URL 파라미터로 전달
      router.push(`/analysis/${params.id}/test?gender=${selectedGender}`);
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

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-[700px] mx-auto px-6 lg:px-8">
        {/* 뒤로가기 네비게이션 */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            뒤로가기
          </button>
        </div>
        
        <div>
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
              {analysis.title}
            </h1>
            <p className="text-gray-600">
              정확한 분석을 위해 성별을 선택해주세요
            </p>
          </div>

          {/* 성별 선택 */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
              성별을 선택해주세요
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 남성 선택 */}
              <button
                onClick={() => handleGenderSelect('male')}
                className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                  selectedGender === 'male'
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div className="mb-3 flex justify-center">
                    <img src="/images/img_man.webp" alt="남성" className="w-16 h-16 object-cover rounded-full" />
                  </div>
                  <div className="text-lg font-medium">남성</div>
                </div>
              </button>

              {/* 여성 선택 */}
              <button
                onClick={() => handleGenderSelect('female')}
                className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                  selectedGender === 'female'
                    ? 'border-pink-500 bg-pink-50 text-pink-900'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div className="mb-3 flex justify-center">
                    <img src="/images/img_woman.webp" alt="여성" className="w-16 h-16 object-cover rounded-full" />
                  </div>
                  <div className="text-lg font-medium">여성</div>
                </div>
              </button>
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="bg-blue-50 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">성별별 맞춤 분석</p>
                <p>남성과 여성은 서로 다른 성향 특성을 가지고 있어, 성별에 따라 다른 해석과 결과를 제공합니다.</p>
              </div>
            </div>
          </div>

          {/* 테스트 시작 버튼 */}
          <div className="flex justify-center">
            <button
              onClick={handleNext}
              disabled={!selectedGender}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              테스트 시작하기 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
