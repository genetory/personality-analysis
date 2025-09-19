'use client';

import React from 'react';

interface PersonalityResult {
  type_name: string;
  type_title: string;
  type_description: string;
  keywords: string[];
  strengths: string[];
  weaknesses: string[];
  relationships: string;
  work_style: string;
  stress_response: string;
  growth_tips: string[];
  compatibility_best_type: string;
  compatibility_best_type_title: string;
  compatibility_best_reason: string;
  compatibility_worst_type: string;
  compatibility_worst_type_title: string;
  compatibility_worst_reason: string;
  point: string;
}

interface ResultDisplayProps {
  result: PersonalityResult;
  onRestart: () => void;
  onGoHome: () => void;
}

export default function ResultDisplay({ result, onRestart, onGoHome }: ResultDisplayProps) {

  return (
    <div className="max-w-[700px] mx-auto p-6">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          분석 완료
        </h1>
        <p className="text-gray-600 text-base">
          당신의 성향 분석이 완료되었습니다
        </p>
      </div>

      {/* 결과 유형 */}
      <div className="text-center mb-12">
        <h2 className="text-xl font-medium text-gray-900 mb-4">
          {result.type_title}
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {result.keywords.map((keyword, index) => (
            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
              #{keyword}
            </span>
          ))}
        </div>
      </div>

      {/* 특징 포인트 */}
      {result.point && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            이 유형의 특징
          </h3>
          <p className="text-gray-700 text-base leading-relaxed">
            {result.point}
          </p>
        </div>
      )}

      {/* 강점 */}
      {result.strengths && result.strengths.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            강점
          </h3>
          <ul className="space-y-2">
            {result.strengths.map((strength, index) => (
              <li key={index} className="text-gray-700 text-base leading-relaxed">
                • {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 약점 */}
      {result.weaknesses && result.weaknesses.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            개선할 점
          </h3>
          <ul className="space-y-2">
            {result.weaknesses.map((weakness, index) => (
              <li key={index} className="text-gray-700 text-base leading-relaxed">
                • {weakness}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 인간관계 */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          인간관계
        </h3>
        <p className="text-gray-700 text-base leading-relaxed">{result.relationships}</p>
      </div>

      {/* 업무 스타일 */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          업무 스타일
        </h3>
        <p className="text-gray-700 text-base leading-relaxed">{result.work_style}</p>
      </div>

      {/* 스트레스 대응 */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          스트레스 대응
        </h3>
        <p className="text-gray-700 text-base leading-relaxed">{result.stress_response}</p>
      </div>

      {/* 성장 팁 */}
      {result.growth_tips && result.growth_tips.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            성장 팁
          </h3>
          <ul className="space-y-2">
            {result.growth_tips.map((tip, index) => (
              <li key={index} className="text-gray-700 text-base leading-relaxed">
                • {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 궁합 정보 */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          궁합 정보
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">잘 어울리는 타입</h4>
            <p className="text-gray-700 font-medium mb-1">{result.compatibility_best_type_title || result.compatibility_best_type}</p>
            <p className="text-gray-700 text-base leading-relaxed">{result.compatibility_best_reason}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">조심스러운 타입</h4>
            <p className="text-gray-700 font-medium mb-1">{result.compatibility_worst_type_title || result.compatibility_worst_type}</p>
            <p className="text-gray-700 text-base leading-relaxed">{result.compatibility_worst_reason}</p>
          </div>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6 border-t border-gray-200">
        <button
          onClick={onRestart}
          className="px-4 py-2 bg-gray-800 text-white rounded text-sm font-medium hover:bg-gray-900 transition-colors"
        >
          다시 분석하기
        </button>
        <button
          onClick={onGoHome}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          홈으로 돌아가기
        </button>
        <button
          onClick={() => {
            const shareText = `나의 성향은 ${result.type_name}입니다!\n${result.type_title}`;
            if (navigator.share) {
              navigator.share({
                title: '성향분석 결과',
                text: shareText,
                url: window.location.href
              });
            } else {
              navigator.clipboard.writeText(shareText);
              alert('결과가 클립보드에 복사되었습니다!');
            }
          }}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
        >
          공유하기
        </button>
      </div>


    </div>
  );
}
