'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import PersonalityResult from '@/components/PersonalityResult';
import { ArrowLeft, Play } from 'lucide-react';

interface PersonalityResult {
  type: string;
  summary: {
    catchphrase: string;
    keywords: string[];
  };
  strengths: string[];
  weaknesses: string[];
  relationships: string;
  workStyle: string;
  stressResponse: string;
  growthTips: string[];
  compatibility: {
    best: {
      type: string;
      reason: string;
    };
    worst: {
      type: string;
      reason: string;
    };
  };
}

export default function DetailedResultPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<PersonalityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    // URL에서 결과 데이터를 가져오거나 세션에서 로드
    const resultData = searchParams.get('result');
    if (resultData) {
      try {
        const parsedResult = JSON.parse(decodeURIComponent(resultData));
        setResult(parsedResult);
      } catch (error) {
        console.error('결과 데이터 파싱 오류:', error);
        router.push(`/analysis/${params.id}/chat`);
      }
    } else {
      // 세션에서 결과 데이터 로드 시도
      const sessionResult = sessionStorage.getItem('analysisResult');
      if (sessionResult) {
        try {
          const parsedResult = JSON.parse(sessionResult);
          setResult(parsedResult.personalityResult);
        } catch (error) {
          console.error('세션 데이터 파싱 오류:', error);
          router.push(`/analysis/${params.id}/chat`);
        }
      } else {
        router.push(`/analysis/${params.id}/chat`);
      }
    }
    setLoading(false);
  }, [params.id, router, searchParams]);

  const handleWatchAd = () => {
    // 광고 시청 처리 로직
    setShowAd(true);
    
    // 실제 광고 시스템 연동 시 여기에 광고 로직 추가
    setTimeout(() => {
      // 상세 결과 페이지로 이동
      const resultData = encodeURIComponent(JSON.stringify(result));
      router.push(`/analysis/${params.id}/premium-result?result=${resultData}`);
    }, 3000); // 광고 시청 시간 (3초)
  };

  const handleRestart = () => {
    router.push(`/analysis/${params.id}/chat`);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-lg mb-2">결과를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-lg text-red-500 mb-4">결과를 찾을 수 없습니다.</div>
          <button
            onClick={() => router.push(`/analysis/${params.id}/chat`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            다시 분석하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 네비게이션바 */}
      <div className="flex-shrink-0 bg-white p-4 flex items-center">
        <div className="max-w-[700px] mx-auto w-full flex items-center">
          <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800 mr-4">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">상세 분석 결과</h2>
        </div>
      </div>

      {/* 광고 안내 배너 */}
      <div className="bg-gray-600 text-white py-4">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Play className="w-5 h-5 mr-2" />
            <span className="font-semibold">광고 시청으로 상세 분석 보기</span>
          </div>
          <p className="text-sm opacity-90">
            짧은 광고를 시청하시면 더 깊이 있는 성향 분석을 무료로 확인하실 수 있습니다
          </p>
        </div>
      </div>

      {/* 결과 미리보기 */}
      <div className="max-w-[700px] mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-gray-100 text-gray-800 px-6 py-3 rounded-full text-xl font-bold mb-4">
              {result.type}
            </div>
            <p className="text-gray-600 text-base mb-3 italic">
              "{result.summary.catchphrase}"
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {result.summary.keywords.map((keyword, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  #{keyword}
                </span>
              ))}
            </div>
          </div>

          {/* 간단한 미리보기 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">💪 주요 강점</h3>
              <ul className="space-y-2">
                {result.strengths.slice(0, 3).map((strength, index) => (
                  <li key={index} className="text-gray-700 text-sm">• {strength}</li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">⚠️ 주의할 점</h3>
              <ul className="space-y-2">
                {result.weaknesses.slice(0, 3).map((weakness, index) => (
                  <li key={index} className="text-gray-700 text-sm">• {weakness}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* 광고 시청 버튼 */}
          <div className="text-center">
            <button
              onClick={handleWatchAd}
              disabled={showAd}
              className="px-8 py-4 bg-gray-600 text-white rounded-lg font-semibold text-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showAd ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  광고 시청 중... (3초)
                </div>
              ) : (
                <div className="flex items-center">
                  <Play className="w-5 h-5 mr-2" />
                  광고 시청하고 상세 분석 보기 (무료)
                </div>
              )}
            </button>
            <p className="text-sm text-gray-500 mt-3">
              📺 짧은 광고 시청 후 무료로 상세 분석을 확인하세요
            </p>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            다시 분석하기
          </button>
          <button
            onClick={handleGoHome}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
