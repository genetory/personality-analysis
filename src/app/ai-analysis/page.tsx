'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Brain, Zap } from 'lucide-react';
import AIChat from '@/components/AIChat';
import AIResult from '@/components/AIResult';

type AnalysisState = 'intro' | 'chat' | 'result';

export default function AIAnalysisPage() {
  const [state, setState] = useState<AnalysisState>('intro');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<string>('');
  const router = useRouter();

  // 채팅 상태일 때 body 스크롤 차단
  useEffect(() => {
    if (state === 'chat') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [state]);

  const handleStartAnalysis = (analysisType: string = 'ai-egen-analysis') => {
    setSelectedAnalysisType(analysisType);
    setState('chat');
  };

  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result);
    setState('result');
  };

  const handleRestart = () => {
    setState('intro');
    setAnalysisResult(null);
  };

  const handleBack = () => {
    if (state === 'chat') {
      setState('intro');
    } else {
      router.push('/');
    }
  };

  // 채팅 상태일 때는 전체 화면을 채팅 컴포넌트로 사용
  if (state === 'chat') {
    return (
      <div className="h-screen bg-white overflow-hidden">
        <AIChat
          analysisId={selectedAnalysisType}
          onComplete={handleAnalysisComplete}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>뒤로 가기</span>
          </button>
        </div>

        {/* 인트로 화면 */}
        {state === 'intro' && (
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                AI 성향 분석
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                AI가 당신만을 위한 맞춤 질문을 생성하고, 
                <br />
                답변 패턴을 분석하여 정확한 성향을 진단합니다
              </p>
            </div>

            {/* 특징들 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 bg-white rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  개인화된 질문
                </h3>
                <p className="text-gray-600">
                  이전 답변을 분석하여 다음 질문이 동적으로 생성됩니다
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  간단한 선택
                </h3>
                <p className="text-gray-600">
                  1번, 2번 선택만으로 쉽고 빠르게 분석할 수 있습니다
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  정확한 진단
                </h3>
                <p className="text-gray-600">
                  AI가 답변 패턴을 분석하여 높은 정확도로 성향을 진단합니다
                </p>
              </div>
            </div>

            {/* 분석 유형 선택 */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                분석 유형을 선택해주세요
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <Link
                  href="/analysis/egen-teto"
                  className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-purple-200 block"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    에겐/테토 성향 분석
                  </h3>
                  <p className="text-gray-600 text-sm">
                    MZ 세대를 위한 16가지 성향 분석
                  </p>
                </Link>
                
                <Link
                  href="/analysis/bdsm"
                  className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-pink-200 block"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    BDSM 성향 분석
                  </h3>
                  <p className="text-gray-600 text-sm">
                    파트너와의 관계에서의 성향 분석
                  </p>
                </Link>
              </div>
            </div>


            {/* 안내 텍스트 */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                💡 <strong>안내:</strong> 분석은 정확히 12개의 질문으로 구성되며, 
                각 질문은 이전 답변을 바탕으로 개인화됩니다.
                <br />
                예상 소요 시간: 3-5분
              </p>
            </div>
          </div>
        )}

        {/* 결과 화면 */}
        {state === 'result' && analysisResult && (
          <AIResult
            result={analysisResult}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}
