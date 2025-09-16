'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

interface Question {
  id: string;
  question_text: string;
  question_order: string;
  options: Option[];
}

interface Option {
  id: string;
  option_text: string;
  option_order: string;
}

interface UserResponse {
  question_id: string;
  option_id: string;
}

interface Analysis {
  id: string;
  title: string;
  description: string;
  total_questions: string;
  result_type: string;
}

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const genderParam = searchParams.get('gender');
    if (!genderParam) {
      router.push(`/analysis/${params.id}/gender`);
      return;
    }
    
    setGender(genderParam);
    
    const fetchData = async () => {
      try {
        // 분석 정보와 질문을 병렬로 가져오기
        const [analysisResponse, questionsResponse] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/v1/analysis/${params.id}`),
          fetch(`http://127.0.0.1:8000/api/v1/analysis/${params.id}/questions`)
        ]);

        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          setAnalysis(analysisData);
        }

        if (questionsResponse.ok) {
          const questionsData = await questionsResponse.json();
          setQuestions(questionsData);
          // 세션 ID 생성
          setSessionId(crypto.randomUUID());
        }
      } catch (error) {
        console.error('데이터 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, searchParams, router]);

  const handleOptionSelect = (questionId: string, optionId: string) => {
    const newResponses = responses.filter(r => r.question_id !== questionId);
    newResponses.push({ question_id: questionId, option_id: optionId });
    setResponses(newResponses);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (responses.length !== questions.length) {
      alert('모든 질문에 답변해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      // 응답 제출
      const response = await fetch('http://127.0.0.1:8000/api/v1/responses/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          gender: gender,
          responses: responses
        }),
      });

      if (response.ok) {
        // 결과 계산
        const resultResponse = await fetch(
          `http://127.0.0.1:8000/api/v1/results/session/${sessionId}/analysis/${params.id}`,
          { method: 'POST' }
        );

        if (resultResponse.ok) {
          router.push(`/analysis/${params.id}/result?session=${sessionId}&gender=${gender}`);
        } else {
          alert('결과 계산에 실패했습니다.');
        }
      } else {
        alert('응답 제출에 실패했습니다.');
      }
    } catch (error) {
      console.error('제출 실패:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">질문을 불러오는 중...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">질문을 찾을 수 없습니다.</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentResponse = responses.find(r => r.question_id === currentQuestion.id);
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-[700px] mx-auto px-6 lg:px-8">
        {/* 뒤로가기 네비게이션 */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            뒤로가기
          </button>
        </div>
        {/* 테스트 제목 */}
        {analysis && (
          <div className="text-left mb-8">
            <h1 className="text-xl lg:text-xl font-bold text-gray-900 mb-2">
              {analysis.title}
            </h1>
          </div>
        )}

        {/* 진행률 표시 */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>질문 {currentQuestionIndex + 1} / {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* 질문 섹션 */}
        <div className="p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQuestion.question_text}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  currentResponse?.option_id === option.id
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}
              >
                {option.option_text}
              </button>
            ))}
          </div>

          {/* 네비게이션 버튼 */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>

            <button
              onClick={handleNext}
              disabled={!currentResponse || submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '처리 중...' : 
               currentQuestionIndex === questions.length - 1 ? '결과 보기' : '다음'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
