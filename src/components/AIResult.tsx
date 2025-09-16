'use client';

import React from 'react';
import { CheckCircle, Star, Heart, Lightbulb, TrendingUp } from 'lucide-react';

interface AIResultProps {
  result: {
    result_type: string;
    title: string;
    description: string;
    characteristics?: string[];
    compatibility?: {
      베스트?: string;
      워스트?: string;
    };
    recommendations?: string[];
    confidence_score?: number;
    interpretations?: {
      [section: string]: string;
    };
    generated_by?: string;
  };
  onRestart: () => void;
}

export default function AIResult({ result, onRestart }: AIResultProps) {
  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceText = (score: number) => {
    if (score >= 90) return '매우 높음';
    if (score >= 80) return '높음';
    if (score >= 70) return '보통';
    return '낮음';
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case '성격 특징':
        return '🎭';
      case '인간관계':
        return '👥';
      case '연애 스타일':
        return '💕';
      case '성격 분석':
        return '🔍';
      case '특징':
        return '⭐';
      case '관계':
        return '🤝';
      case '연애':
        return '💘';
      case '궁합':
        return '💖';
      case '추천':
        return '💡';
      case '팁':
        return '🎯';
      default:
        return '📝';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {result.title}
        </h1>
        <p className="text-gray-600 text-lg mb-4">
          {result.description}
        </p>
        <div className="flex items-center justify-center space-x-4">
          <span className="text-sm text-gray-500">결과 유형: {result.result_type}</span>
          {result.confidence_score && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(result.confidence_score)}`}>
              신뢰도: {getConfidenceText(result.confidence_score)} ({result.confidence_score}%)
            </span>
          )}
        </div>
      </div>

      {/* 섹션별 해석 */}
      {result.interpretations && Object.keys(result.interpretations).length > 0 ? (
        <div className="mb-8">
          <h2 className="flex items-center text-xl font-semibold text-gray-900 mb-6">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            상세 해석
          </h2>
          <div className="space-y-6">
            {Object.entries(result.interpretations).map(([section, content], index) => (
              <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  {getSectionIcon(section)} {section}
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {content}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 기존 주요 특징 (fallback) */
        result.characteristics && result.characteristics.length > 0 && (
          <div className="mb-8">
            <h2 className="flex items-center text-xl font-semibold text-gray-900 mb-4">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              주요 특징
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.characteristics.map((characteristic, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-700">{characteristic}</p>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {/* 궁합 정보 */}
      {result.compatibility && (
        <div className="mb-8">
          <h2 className="flex items-center text-xl font-semibold text-gray-900 mb-4">
            <Heart className="w-5 h-5 mr-2 text-red-500" />
            궁합 정보
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.compatibility.베스트 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">💚 잘 어울리는 성향</h3>
                <p className="text-green-700">{result.compatibility.베스트}</p>
              </div>
            )}
            {result.compatibility.워스트 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">💔 피해야 하는 성향</h3>
                <p className="text-red-700">{result.compatibility.워스트}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 추천사항 */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="mb-8">
          <h2 className="flex items-center text-xl font-semibold text-gray-900 mb-4">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
            추천사항
          </h2>
          <div className="space-y-3">
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-blue-800">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 액션 버튼들 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          다시 분석하기
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
        >
          결과 저장하기
        </button>
        <button
          onClick={() => {
            const shareText = `AI 성향 분석 결과: ${result.title}\n${result.description}`;
            if (navigator.share) {
              navigator.share({
                title: 'AI 성향 분석 결과',
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

      {/* AI 분석 안내 */}
      <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <p className="text-sm text-purple-700 text-center">
          {result.generated_by === 'ai' ? (
            <>
              🤖 이 결과는 AI가 당신의 답변 패턴을 분석하여 생성한 개인화된 성향 분석입니다.
              <br />
              더 정확한 분석을 위해 다양한 상황에서의 답변을 고려했습니다.
            </>
          ) : (
            <>
              📊 이 결과는 검증된 성향 분석 모델을 기반으로 생성되었습니다.
              <br />
              당신의 답변 패턴을 분석하여 맞춤형 해석을 제공합니다.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
