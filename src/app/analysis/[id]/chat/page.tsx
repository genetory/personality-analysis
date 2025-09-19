'use client';

import { useParams } from 'next/navigation';
import AnalysisChat from '@/components/AnalysisChat';
import { useRouter } from 'next/navigation';

interface AnalysisResult {
  analysisId: string;
  gender: 'male' | 'female';
  answers: unknown[];
  scores: { axis1: number; axis2: number; axis3: number; axis4: number };
  personalityResult: unknown;
  completedAt: string;
}

export default function AnalysisChatPage() {
  const params = useParams();
  const router = useRouter();

  const handleAnalysisComplete = (analysisResult: unknown) => {
    const result = analysisResult as AnalysisResult;
    // 결과를 세션에 저장
    sessionStorage.setItem('analysisResult', JSON.stringify(result));
    
    // 상세 결과 페이지로 이동
    const resultData = encodeURIComponent(JSON.stringify(result.personalityResult));
    router.push(`/analysis/${params.id}/premium-result?result=${resultData}`);
  };

  return (
    <div className="h-screen">
      <AnalysisChat
        analysisId={params.id as string}
        onComplete={handleAnalysisComplete}
      />
    </div>
  );
}
