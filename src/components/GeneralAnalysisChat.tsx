'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  hint?: string;
  options?: {
    option1: string;
    option2: string;
  };
}

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

interface GeneralAnalysisChatProps {
  analysisId: string;
  onComplete: (result: any) => void;
}

export default function GeneralAnalysisChat({ analysisId, onComplete }: GeneralAnalysisChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGenderSelection = (selectedGender: 'male' | 'female') => {
    setGender(selectedGender);
    
    // 사용자 선택 메시지 추가
    const userMessage: Message = {
      id: `gender-${Date.now()}`,
      type: 'user',
      content: selectedGender === 'male' ? '👨 남성' : '👩 여성',
      timestamp: new Date()
    };
    
    // AI 응답 메시지 추가 (바로 분석 시작)
    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      type: 'ai',
      content: `좋아요! ${selectedGender === 'male' ? '남성' : '여성'} 성향분석을 시작해볼게요! 🎯\n\n${questions.length}개의 질문으로 당신의 독특한 성향을 분석해드릴게요. 각 질문에 솔직하게 답해주세요!`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage, aiMessage]);
    
    // 성별 선택 후 첫 번째 질문 표시
    setTimeout(() => {
      showNextQuestion();
    }, 1000);
  };

  const showNextQuestion = () => {
    if (currentQuestionIndex < questions.length) {
      const question = questions[currentQuestionIndex];
      const questionMessage: Message = {
        id: `question-${question.id}`,
        type: 'ai',
        content: question.question_text,
        timestamp: new Date(),
        hint: `${currentQuestionIndex + 1}/${questions.length}번째 질문`,
        options: {
          option1: question.options[0]?.option_text || '',
          option2: question.options[1]?.option_text || ''
        }
      };
      
      setMessages(prev => [...prev, questionMessage]);
    }
  };

  const handleOptionClick = async (option: number, optionText: string) => {
    if (currentQuestionIndex >= questions.length) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    
    // 사용자 답변 메시지 추가
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: optionText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // 답변 저장
    const response = {
      question_id: currentQuestion.id,
      option_id: currentQuestion.options[option - 1].id
    };
    setResponses(prev => [...prev, response]);
    
    // 다음 질문으로 이동
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    
    if (nextIndex < questions.length) {
      // 다음 질문 표시
      setTimeout(() => {
        showNextQuestion();
      }, 1000);
    } else {
      // 모든 질문 완료 - 결과 제출
      setTimeout(() => {
        submitResults();
      }, 1000);
    }
  };

  const submitResults = async () => {
    setIsLoading(true);
    
    try {
      // 1. 응답 제출
      const responseResponse = await fetch('http://127.0.0.1:8000/api/v1/responses/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          gender: gender,
          responses: responses
        })
      });

      if (!responseResponse.ok) {
        throw new Error(`응답 제출 실패: ${responseResponse.status}`);
      }

      // 2. 결과 계산
      const resultResponse = await fetch(
        `http://127.0.0.1:8000/api/v1/results/session/${sessionId}/analysis/${analysisId}`,
        { method: 'POST' }
      );

      if (!resultResponse.ok) {
        throw new Error(`결과 계산 실패: ${resultResponse.status}`);
      }

      const result = await resultResponse.json();
      console.log('분석 결과:', result);
      
      // 완료 메시지 추가
      const completeMessage: Message = {
        id: `complete-${Date.now()}`,
        type: 'ai',
        content: `🎉 분석이 완료되었습니다!\n\n결과를 확인해보세요!`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, completeMessage]);
      
      // 결과 전달 (기존 시스템과 호환되도록)
      onComplete({
        ...result,
        session_id: sessionId,
        gender: gender
      });
      
    } catch (error) {
      console.error('결과 제출 오류:', error);
      alert('분석 결과 제출에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 초기 데이터 로드
  useEffect(() => {
    const loadAnalysisData = async () => {
      try {
        // 분석 정보 조회
        const analysisResponse = await fetch(`http://127.0.0.1:8000/api/v1/analysis/${analysisId}`);
        const analysisData = await analysisResponse.json();
        
        // 질문 목록 조회
        const questionsResponse = await fetch(`http://127.0.0.1:8000/api/v1/analysis/${analysisId}/questions`);
        const questionsData = await questionsResponse.json();
        
        // 질문 순서대로 정렬
        const sortedQuestions = questionsData.sort((a: any, b: any) => 
          parseInt(a.question_order) - parseInt(b.question_order)
        );
        
        setQuestions(sortedQuestions);
        
        // 세션 ID 생성
        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(newSessionId);
        
        // 환영 메시지
        const welcomeMessage: Message = {
          id: `welcome-${Date.now()}`,
          type: 'ai',
          content: `안녕! 👋\n\n${analysisData.title}에 오신 걸 환영해!\n\n🎯 이 분석은 당신의 독특한 성향을 알아보는 거야.\n\n${questionsData.length}개의 질문으로 당신의 성향을 분석해줄게. 솔직하게 답해주세요!`,
          timestamp: new Date(),
          options: {
            option1: "분석 시작하기 🎯",
            option2: null
          }
        };
        
        setMessages([welcomeMessage]);
        
      } catch (error) {
        console.error('분석 데이터 로드 오류:', error);
        alert('분석 데이터를 불러오는데 실패했습니다.');
      }
    };

    loadAnalysisData();
  }, [analysisId]);

  return (
    <div className="h-screen bg-white flex justify-center">
      <div className="w-full max-w-[700px] flex flex-col bg-gray-50">
        {/* 헤더 */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            뒤로가기
          </button>
          <h1 className="text-lg font-semibold text-gray-900">성향 분석</h1>
          <div className="w-20"></div> {/* 중앙 정렬을 위한 빈 공간 */}
        </div>

        {/* 채팅 영역 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-blue-500 text-white'
                }`}
              >
                <div className="whitespace-pre-line">{message.content}</div>
                
                {/* 힌트 표시 */}
                {message.hint && (
                  <div className="mt-2 text-sm opacity-75">
                    {message.hint}
                  </div>
                )}
                
                {/* 옵션 버튼들 */}
                {message.options && (
                  <div className="mt-3 space-y-2">
                    {message.options.option1 && (
                      <button
                        onClick={() => {
                          if (message.id.includes('welcome')) {
                            // 성별 선택을 채팅으로 처리
                            const genderMessage: Message = {
                              id: `gender-select-${Date.now()}`,
                              type: 'ai',
                              content: '성별을 선택해주세요! 👤',
                              timestamp: new Date(),
                              options: {
                                option1: '👨 남성',
                                option2: '👩 여성'
                              }
                            };
                            setMessages(prev => [...prev, genderMessage]);
                          } else if (message.id.includes('gender-select')) {
                            // 성별 선택 처리
                            handleGenderSelection('male');
                          } else {
                            handleOptionClick(1, message.options!.option1);
                          }
                        }}
                        className="block w-full text-left p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors text-sm"
                      >
                        {message.options.option1}
                      </button>
                    )}
                    {message.options.option2 && (
                      <button
                        onClick={() => {
                          if (message.id.includes('gender-select')) {
                            // 성별 선택 처리
                            handleGenderSelection('female');
                          } else {
                            handleOptionClick(2, message.options!.option2);
                          }
                        }}
                        className="block w-full text-left p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors text-sm"
                      >
                        {message.options.option2}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* 로딩 표시 */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-blue-500 text-white rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>분석 중...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
