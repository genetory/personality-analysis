'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import QuestionChat from '@/components/QuestionChat';
import { useRouter } from 'next/navigation';

type AnalysisState = 'chat' | 'result';

export default function AnalysisChatPage() {
  const params = useParams();
  const router = useRouter();
  const [state, setState] = useState<AnalysisState>('chat');

  const handleAnalysisComplete = (result: any) => {
    // 결과 페이지로 리다이렉트 (임시로 메인 페이지로)
    router.push('/');
  };

  return (
    <div className="h-screen">
      <QuestionChat
        analysisId={params.id as string}
        onComplete={handleAnalysisComplete}
      />
    </div>
  );
}
