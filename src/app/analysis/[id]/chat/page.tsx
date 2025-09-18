'use client';

import { useParams } from 'next/navigation';
import QuestionChat from '@/components/QuestionChat';
import { useRouter } from 'next/navigation';

interface AnalysisResult {
  analysisId: string;
  gender: 'male' | 'female';
  answers: any[];
  scores: any;
  personalityResult: any;
  completedAt: string;
}

export default function AnalysisChatPage() {
  const params = useParams();
  const router = useRouter();

  const handleAnalysisComplete = (analysisResult: AnalysisResult) => {
    // 결과를 세션에 저장
    sessionStorage.setItem('analysisResult', JSON.stringify(analysisResult));
    
    // 상세 결과 페이지로 이동
    const resultData = encodeURIComponent(JSON.stringify(analysisResult.personalityResult));
    router.push(`/analysis/${params.id}/detailed-result?result=${resultData}`);
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
