'use client';

import { useState } from 'react';
import AIChat from '@/components/AIChat';
import AIResult from '@/components/AIResult';

type AnalysisState = 'intro' | 'chat' | 'result';

export default function EgenTetoAnalysisPage() {
  const [state, setState] = useState<AnalysisState>('chat'); // 바로 채팅으로 시작
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result);
    setState('result');
  };

  const handleRestart = () => {
    setState('chat');
    setAnalysisResult(null);
  };

  return (
    <div className="h-screen">
      {/* 채팅 화면 */}
      {state === 'chat' && (
        <AIChat
          analysisId="ai-egen-analysis" // 에겐/테토 분석 ID
          onComplete={handleAnalysisComplete}
        />
      )}

      {/* 결과 화면 */}
      {state === 'result' && analysisResult && (
        <div className="h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <AIResult
            result={analysisResult}
            onRestart={handleRestart}
          />
        </div>
      )}
    </div>
  );
}
