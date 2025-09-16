'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import AIChat from '@/components/AIChat';
import GeneralAnalysisChat from '@/components/GeneralAnalysisChat';
import { useRouter } from 'next/navigation';

type AnalysisState = 'chat' | 'result';

export default function AnalysisChatPage() {
  const params = useParams();
  const router = useRouter();
  const [state, setState] = useState<AnalysisState>('chat');

  const handleAnalysisComplete = (result: any) => {
    // 기존 결과 페이지로 리다이렉트
    router.push(`/analysis/${params.id}/result?session=${result.session_id}&gender=${result.gender}`);
  };

  return (
    <div className="h-screen">
      <GeneralAnalysisChat
        analysisId={params.id as string} // 분석 ID 그대로 사용
        onComplete={handleAnalysisComplete}
      />
    </div>
  );
}
