'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, ArrowLeft } from 'lucide-react';

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

interface AIChatProps {
  analysisId: string;
  onComplete: (result: any) => void;
}

export default function AIChat({ analysisId, onComplete }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(12);
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [showGenderSelection, setShowGenderSelection] = useState(false);
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
      content: `좋아요! ${selectedGender === 'male' ? '남성' : '여성'} 성향분석을 시작해볼게요! 🎯\n\n12개의 질문으로 당신의 독특한 성향을 분석해드릴게요. 각 질문에 솔직하게 답해주세요!`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage, aiMessage]);
    setShowGenderSelection(false);
    
    // 성별 선택 후 바로 분석 시작
    setTimeout(() => {
      startAnalysis(selectedGender);
    }, 1000); // 1초 후 분석 시작
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 초기 환영 메시지 추가 (컴포넌트 마운트 시에만)
  useEffect(() => {
    let welcomeContent = '';
    
    if (analysisId === 'ai-bdsm-analysis') {
      welcomeContent = `안녕! 👋\n\nBDSM 성향 분석에 오신 걸 환영해!\n\n🔗 이 분석은 파트너와의 관계에서 당신의 성향을 알아보는 거야.\n\n• 도미넌트 (Dom): 리더십 있고 주도적인 성향\n• 서브 (Sub): 따뜻하고 배려심 깊은 성향  \n• 스위치 (Switch): 상황에 따라 유연하게 적응하는 성향\n\n12개의 질문으로 당신의 관계 성향을 분석해줄게. 솔직하게 답해주세요! 😊`;
    } else if (analysisId === 'ai-egen-analysis') {
      welcomeContent = `안녕! 👋\n\n에겐/테토 성향 분석에 오신 걸 환영해!\n\n🎭 이 분석은 당신의 독특한 성향을 알아보는 거야.\n\n• 에겐 (Egen): 독창적이고 개성적인 성향\n• 테토 (Teto): 균형잡히고 안정적인 성향\n\n12개의 재미있는 질문으로 당신의 성향을 분석해줄게. 준비됐으면 시작해보자!`;
    } else {
      // 일반 분석의 경우
      const analysisName = analysisId.replace('ai-', '').replace('-analysis', '');
      welcomeContent = `안녕! 👋\n\n성향 분석에 오신 걸 환영해!\n\n🎯 이 분석은 당신의 독특한 성향을 알아보는 거야.\n\n12개의 재미있는 질문으로 당신의 성향을 분석해줄게. 솔직하게 답해주세요!`;
    }

    const welcomeMessage: Message = {
      id: `welcome-${Date.now()}`,
      type: 'ai',
      content: welcomeContent,
      timestamp: new Date(),
      options: {
        option1: "분석 시작하기 🎯",
        option2: null
      }
    };
    
    setMessages([welcomeMessage]);
  }, [analysisId]); // analysisId 의존성 추가

  // 성별 선택 후 분석 시작은 handleGenderSelection에서 처리

  const startAnalysis = async (selectedGender?: 'male' | 'female') => {
    const currentGender = selectedGender || gender;
    if (isLoading || !currentGender) {
      console.log('이미 분석이 진행 중이거나 성별이 선택되지 않았습니다.');
      return;
    }
    
    console.log('AI 분석 시작');
    setIsLoading(true);
    
    try {
      // analysisId가 유효한지 확인하고 기본값 설정
      const validAnalysisId = (typeof analysisId === 'string' && analysisId.trim() !== '') ? analysisId : 'ai-egen-analysis';
      const newSessionId = `session_${Date.now()}`;
      setSessionId(newSessionId);
      
      console.log('AI 분석 시작 요청 - analysis_id:', validAnalysisId);
      console.log('AI 분석 시작 요청 - session_id:', newSessionId);
      console.log('AI 분석 시작 요청 - gender:', currentGender);
      
      // 실제 AI 분석 API 호출
      const response = await fetch('http://127.0.0.1:8000/api/v1/ai-analysis/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysis_id: validAnalysisId,
          session_id: newSessionId,
          gender: currentGender
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('AI 분석 시작 응답:', data);

      // 첫 번째 질문을 메시지로 추가
      const firstMessage: Message = {
        id: `msg_${Date.now()}`,
        type: 'ai',
        content: data.question_text,
        timestamp: new Date(),
        hint: data.hint,
        options: {
          option1: data.option_1,
          option2: data.option_2
        }
      };
      
      setMessages(prev => [...prev, firstMessage]);
      setCurrentQuestionId(data.question_id);
      setQuestionIndex(1);
      setIsLoading(false);
      
    } catch (error) {
      console.error('분석 시작 오류:', error);
      console.error('오류 상세:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error: error
      });
      
      setIsLoading(false);
      hasStartedRef.current = false;
    }
  };

  const handleOptionClick = async (option: number) => {
    if (isLoading) return;

    // "분석 시작하기" 버튼 클릭 시 성별 선택 메시지 표시
    if (!currentQuestionId && !showGenderSelection && !gender) {
      if (option === 1) { // "분석 시작하기" 선택
        const genderMessage: Message = {
          id: `gender-select-${Date.now()}`,
          type: 'ai',
          content: `성별을 선택해주세요! 😊\n\n성향 분석 결과가 달라질 수 있어요.`,
          timestamp: new Date(),
          options: {
            option1: "👨 남성",
            option2: "👩 여성"
          }
        };
        setMessages(prev => [...prev, genderMessage]);
        setShowGenderSelection(true);
        return;
      } else { // "더 알고 싶어" 선택
        const infoMessage: Message = {
          id: `info-${Date.now()}`,
          type: 'ai',
          content: `이 분석은 12개의 질문을 통해 당신의 성향을 분석해줘요!\n\n• 각 질문마다 2개의 선택지가 있어요\n• 성별에 따라 결과가 달라질 수 있어요\n• 개인정보는 저장되지 않아요\n\n준비되면 "분석 시작하기"를 눌러주세요! 🚀`,
          timestamp: new Date(),
          options: {
            option1: "분석 시작하기 🎯",
            option2: "더 알고 싶어 🤔"
          }
        };
        setMessages(prev => [...prev, infoMessage]);
        return;
      }
    }

    // 성별 선택 처리
    if (showGenderSelection) {
      const selectedGender = option === 1 ? 'male' : 'female';
      handleGenderSelection(selectedGender);
      return;
    }

    if (!currentQuestionId || isLoading) return;

    setIsLoading(true);

    // 사용자 답변 메시지 추가 - 실제 선택한 답변 내용 표시
    const currentMessage = messages[messages.length - 1];
    const selectedOptionText = option === 1 ? currentMessage?.options?.option1 : currentMessage?.options?.option2;
    
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: selectedOptionText || `옵션 ${option}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // 실제 AI 분석 API 호출 (질문 답변 처리)
      const response = await fetch('http://127.0.0.1:8000/api/v1/ai-analysis/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          question_id: currentQuestionId,
          answer: option,
          gender: gender
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('AI 분석 답변 응답:', data);

      if (data.is_complete) {
        // 분석 완료
        onComplete({
          result_type: data.result_type,
          title: data.title,
          description: data.description,
          interpretations: data.interpretations,
          generated_by: "ai"
        });
        return;
      }

      // 다음 질문 표시
      setCurrentQuestionId(data.question_id);
      setQuestionIndex(questionIndex + 1);

      const aiMessage: Message = {
        id: `msg_${Date.now()}`,
        type: 'ai',
        content: data.question_text,
        timestamp: new Date(),
        hint: data.hint,
        options: {
          option1: data.option_1,
          option2: data.option_2
        }
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('답변 제출 오류:', error);
      console.error('오류 상세:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error: error
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white flex justify-center">
      <div className="w-full max-w-[700px] flex flex-col bg-gray-50">
        {/* 헤더 */}
        <div className="bg-white flex-shrink-0">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">AI 성향 분석</h1>
                  <p className="text-xs text-gray-500">
                    {questionIndex > 0 ? `${questionIndex}/${totalQuestions}` : '준비 중'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-500">
                  {gender ? (gender === 'male' ? '👨 남성' : '👩 여성') : '성별 선택 필요'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 채팅 영역 - 화면에 꽉참 */}
        <div className="flex-1 overflow-hidden">
          {/* 메시지 영역 */}
          <div className="h-full overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gray-500 text-white'
                    : 'bg-blue-500 text-white'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                {message.hint && (
                  <p className="text-xs mt-2 opacity-75 italic">{message.hint}</p>
                )}
                {message.options && (
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => handleOptionClick(1)}
                      className="w-full text-left p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200"
                    >
                      <span className="text-sm text-white">
                        {message.options.option1}
                      </span>
                    </button>
                    {message.options.option2 && (
                      <button
                        onClick={() => handleOptionClick(2)}
                        className="w-full text-left p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200"
                      >
                        <span className="text-sm text-white">
                          {message.options.option2}
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-blue-500 text-white px-4 py-3 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">생성 중...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}