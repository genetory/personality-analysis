'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Brain, Zap } from 'lucide-react';
import QuestionChat from '@/components/QuestionChat';
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

  const handleStartAnalysis = (analysisType: string = '550e8400-e29b-41d4-a716-446655440001') => {
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
        <QuestionChat
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
                4축 성향 분석
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                과학적 근거에 기반한 4축 성향분석으로 
                <br />
                당신의 진짜 성향을 정확하게 파악해보세요
              </p>
            </div>

            {/* 특징들 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 bg-white rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  과학적 근거
                </h3>
                <p className="text-gray-600">
                  4개 축으로 구성된 검증된 성향분석 모델을 사용합니다
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
                  16개 질문으로 4개 축의 성향을 정확하게 분석합니다
                </p>
              </div>
            </div>

            {/* 분석 시작 버튼 */}
            <div className="mb-8">
              <button
                onClick={() => handleStartAnalysis()}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                4축 성향분석 시작하기
              </button>
            </div>


            {/* 안내 텍스트 */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                💡 <strong>안내:</strong> 4축 성향분석은 16개의 질문으로 구성되며, 
                에겐/테토, 액티브/리플렉트, 플랜/플로우, 표현/절제 4개 축으로 분석합니다.
                <br />
                예상 소요 시간: 5-7분
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
