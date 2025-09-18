'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';

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
      catchphrase: string;
      reason: string;
    };
    worst: {
      type: string;
      catchphrase: string;
      reason: string;
    };
  };
}

interface PersonalityResultProps {
  result: PersonalityResult;
  onRestart: () => void;
  onGoHome: () => void;
}

export default function PersonalityResult({ result, onRestart, onGoHome }: PersonalityResultProps) {
  const getSectionIcon = (section: string) => {
    switch (section) {
      case '강점':
        return '💪';
      case '약점':
        return '⚠️';
      case '인간관계':
        return '👥';
      case '업무 스타일':
        return '💼';
      case '스트레스 대응':
        return '😰';
      case '성장 팁':
        return '🌱';
      case '궁합':
        return '💕';
      default:
        return '📝';
    }
  };

  return (
    <div className="max-w-[700px] mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎉 분석 완료!
        </h1>
        <p className="text-gray-600 text-lg mb-4">
          당신의 성향 분석이 완료되었습니다
        </p>
      </div>

      {/* 결과 유형 */}
      <div className="text-center mb-8">
        <div className="inline-block bg-gray-100 text-gray-800 px-6 py-3 rounded-full text-xl font-bold mb-4">
          {result.summary.catchphrase}
        </div>
        <p className="text-gray-600 text-base mb-3 italic">
          {result.type}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {result.summary.keywords.map((keyword, index) => (
            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              #{keyword}
            </span>
          ))}
        </div>
      </div>

      {/* 강점 */}
      {result.strengths && result.strengths.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            당신의 강점은 무엇인가요?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.strengths.map((strength, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-800">{strength}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 약점 */}
      {result.weaknesses && result.weaknesses.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            조금 더 신경 써야 할 부분이 있어요
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.weaknesses.map((weakness, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-800">{weakness}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 인간관계 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          사람들과의 관계에서는 어떤 모습일까요?
        </h2>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <p className="text-gray-800 leading-relaxed">{result.relationships}</p>
        </div>
      </div>

      {/* 업무 스타일 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          일할 때는 어떤 스타일인가요?
        </h2>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <p className="text-gray-800 leading-relaxed">{result.workStyle}</p>
        </div>
      </div>

      {/* 스트레스 대응 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          스트레스를 받을 때는 어떻게 하시나요?
        </h2>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <p className="text-gray-800 leading-relaxed">{result.stressResponse}</p>
        </div>
      </div>

      {/* 성장 팁 */}
      {result.growthTips && result.growthTips.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            더 나은 모습이 되기 위한 조언
          </h2>
          <div className="space-y-3">
            {result.growthTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <TrendingUp className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-800">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 궁합 정보 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          어떤 사람과 잘 어울릴까요?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">이런 분과 잘 어울려요</h3>
            <p className="text-gray-700 font-medium mb-2">"{result.compatibility.best.catchphrase}"</p>
            <p className="text-gray-600 text-sm">{result.compatibility.best.reason}</p>
          </div>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">이런 분과는 조심스러워요</h3>
            <p className="text-gray-700 font-medium mb-2">"{result.compatibility.worst.catchphrase}"</p>
            <p className="text-gray-600 text-sm">{result.compatibility.worst.reason}</p>
          </div>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          다시 분석하기
        </button>
        <button
          onClick={onGoHome}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
        >
          홈으로 돌아가기
        </button>
        <button
          onClick={() => {
            const shareText = `나의 성향은 ${result.type}입니다!\n${result.summary.catchphrase}`;
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
          className="px-6 py-3 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors duration-200"
        >
          공유하기
        </button>
      </div>

      {/* 분석 안내 */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700 text-center">
          📊 이 결과는 당신의 답변 패턴을 분석하여 생성된 개인화된 성향 분석입니다.
          <br />
          더 정확한 분석을 위해 솔직한 답변을 해주셔서 감사합니다! 🎯
        </p>
      </div>
    </div>
  );
}
