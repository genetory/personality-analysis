'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Bot, User, Loader2, ArrowLeft } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  category: string;
  axis: string;
  order_index: number;
  question_options: QuestionOption[];
}

interface QuestionOption {
  id: string;
  text: string;
  value: number;
  axis_score: number;
  order_index: number;
}

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  hint?: string;
  isTyping?: boolean;
  options?: {
    option1: string;
    option2: string;
  };
}

interface PersonalityResult {
  type: string; // 예: "에겐남", "테토녀" 등
  summary: {
    catchphrase: string;
    keywords: string[];
  };
  strengths: string[];
  weaknesses: string[];
  relationships: string;
  workStyle: string;
  stressResponse: string;
  growthTips: string[];
  compatibility: {
    best: {
      type: string;
      reason: string;
    };
    worst: {
      type: string;
      reason: string;
    };
  };
}

interface QuestionChatProps {
  analysisId: string;
  onComplete: (result: any) => void;
}

export default function QuestionChat({ analysisId, onComplete }: QuestionChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; optionId: string; value: number; axisScore: number }[]>([]);
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [analysisInfo, setAnalysisInfo] = useState<{name: string, description: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 질문 목록 로드
  useEffect(() => {
    loadQuestions();
  }, [analysisId]);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      
      // 분석 정보와 질문을 병렬로 가져오기
      const [analysisResponse, questionsResponse] = await Promise.all([
        fetch(`http://127.0.0.1:8000/api/v1/analysis/${analysisId}`),
        fetch(`http://127.0.0.1:8000/api/v1/analysis/${analysisId}/questions`)
      ]);
      
      if (!analysisResponse.ok || !questionsResponse.ok) {
        throw new Error(`HTTP error! status: ${analysisResponse.status} or ${questionsResponse.status}`);
      }

      const [analysisData, questionsData] = await Promise.all([
        analysisResponse.json(),
        questionsResponse.json()
      ]);
      
      const analysisInfo = {
        name: analysisData.name,
        description: analysisData.description
      };
      
      setAnalysisInfo(analysisInfo);
      setQuestions(questionsData);
      
      // 첫 번째 질문으로 시작 (analysisInfo를 직접 전달)
      if (questionsData.length > 0) {
        showFirstQuestion(questionsData[0], analysisInfo, questionsData.length);
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showFirstQuestion = (question: Question, analysisInfo: {name: string, description: string}, questionsCount: number) => {
    // 타이핑 인디케이터 표시
    const typingMessage: Message = {
      id: `typing-${Date.now()}`,
      type: 'ai',
      content: '...',
      timestamp: new Date(),
      isTyping: true
    };

    setMessages([typingMessage]);

    // 0.4초 후 인사말 메시지로 교체
    setTimeout(() => {
      const introMessage: Message = {
        id: `intro-${Date.now()}`,
        type: 'ai',
        content: `안녕하세요! 👋\n\n${analysisInfo.name}에 오신 것을 환영합니다!\n\n${analysisInfo.description}\n\n총 ${questionsCount}개의 질문으로 당신의 독특한 성향을 정확하게 분석해드릴게요! 🎯`,
        timestamp: new Date()
      };

      setMessages([introMessage]);

      // 0.8초 후 성별 선택 메시지 추가
      setTimeout(() => {
        // 타이핑 인디케이터 표시
        const typingMessage2: Message = {
          id: `typing-2-${Date.now()}`,
          type: 'ai',
          content: '...',
          timestamp: new Date(),
          isTyping: true
        };

        setMessages(prev => [...prev, typingMessage2]);

        // 0.3초 후 성별 선택 메시지로 교체
        setTimeout(() => {
          const genderMessage: Message = {
            id: `gender-${Date.now()}`,
            type: 'ai',
            content: `먼저 성별을 선택해주세요.`,
            timestamp: new Date(),
            options: {
              option1: '👨 남성',
              option2: '👩 여성'
            }
          };

          setMessages(prev => [...prev.slice(0, -1), genderMessage]);
        }, 300);
      }, 800);
    }, 400);
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
    
    setMessages(prev => [...prev, userMessage]);
    
    // 타이핑 인디케이터 표시
    const typingMessage: Message = {
      id: `typing-ai-${Date.now()}`,
      type: 'ai',
      content: '...',
      timestamp: new Date(),
      isTyping: true
    };
    
    setMessages(prev => [...prev, typingMessage]);
    
    // 0.3초 후 AI 응답 메시지로 교체
    setTimeout(() => {
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: `좋아요! ${selectedGender === 'male' ? '남성' : '여성'} 성향분석을 시작해볼게요! 🎯\n\n${questions.length}개의 질문으로 당신의 독특한 성향을 분석해드릴게요. 각 질문에 솔직하게 답해주세요!`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev.slice(0, -1), aiMessage]);
      
      // 0.8초 후 첫 번째 질문 표시
      setTimeout(() => {
        if (questions.length > 0) {
          // 타이핑 인디케이터 표시
          const typingMessage2: Message = {
            id: `typing-question-${Date.now()}`,
            type: 'ai',
            content: '...',
            timestamp: new Date(),
            isTyping: true
          };
          
          setMessages(prev => [...prev, typingMessage2]);
          
          // 0.3초 후 질문 메시지로 교체
          setTimeout(() => {
            const firstQuestion = questions[0];
            const questionMessage: Message = {
              id: `question-${firstQuestion.id}`,
              type: 'ai',
              content: firstQuestion.text,
              timestamp: new Date(),
              options: {
                option1: firstQuestion.question_options[0]?.text || '',
                option2: firstQuestion.question_options[1]?.text || ''
              }
            };
            
            setMessages(prev => [...prev.slice(0, -1), questionMessage]);
          }, 300);
        }
      }, 800);
    }, 300);
  };

  const handleAnswer = async (optionIndex: number) => {
    console.log('handleAnswer called:', { currentQuestionIndex, questionsLength: questions.length, optionIndex });
    
    // 성별 선택 처리
    if (gender === null) {
      const selectedGender = optionIndex === 0 ? 'male' : 'female';
      handleGenderSelection(selectedGender);
      return;
    }

    // 분석 완료 후 결과 메시지의 버튼 처리 (테스트를 위해 1개 질문 후 완료)
    if (currentQuestionIndex >= 1) {
      console.log('Analysis complete, handling result action buttons');
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.options) {
        // 사용자 선택 메시지 추가
        const userMessage: Message = {
          id: `result-action-${Date.now()}`,
          type: 'user',
          content: optionIndex === 0 ? '🔍 더 자세히 보러가기' : '🏠 홈으로 돌아가기',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMessage]);

        if (optionIndex === 0) {
          // 더 자세히 보러가기 - 채팅창에서 광고 표시
          showAdInChat();
        } else {
          // 홈으로 돌아가기
          window.location.href = '/';
        }
      }
      return;
    }

    // 일반 질문 처리
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOption = currentQuestion.question_options[optionIndex];
    
    if (!selectedOption) return;

    // 답변 저장
    const newAnswer = {
      questionId: currentQuestion.id,
      optionId: selectedOption.id,
      value: selectedOption.value,
      axisScore: selectedOption.axis_score
    };
    
    setAnswers(prev => [...prev, newAnswer]);

    // 사용자 답변 메시지 추가
    const userMessage: Message = {
      id: `answer-${Date.now()}`,
      type: 'user',
      content: selectedOption.text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // 다음 질문 또는 완료
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    
    console.log('Processing next question:', { nextIndex, questionsLength: questions.length });

    // 테스트를 위해 1개 질문만 표시 후 바로 분석 완료
    if (nextIndex < 1 && nextIndex < questions.length) {
      console.log('Showing next question');
      // 타이핑 인디케이터 표시
      const typingMessage: Message = {
        id: `typing-next-${Date.now()}`,
        type: 'ai',
        content: '...',
        timestamp: new Date(),
        isTyping: true
      };
      
      setMessages(prev => [...prev, typingMessage]);
      
      // 0.3초 후 다음 질문 표시
      setTimeout(() => {
        const nextQuestion = questions[nextIndex];
        const questionMessage: Message = {
          id: `question-${nextQuestion.id}`,
          type: 'ai',
          content: nextQuestion.text,
          timestamp: new Date(),
          options: {
            option1: nextQuestion.question_options[0]?.text || '',
            option2: nextQuestion.question_options[1]?.text || ''
          }
        };
        
        setMessages(prev => [...prev.slice(0, -1), questionMessage]);
      }, 300);
    } else {
      console.log('Analysis complete, starting completion process');
      // 타이핑 인디케이터 표시
      const typingMessage: Message = {
        id: `typing-complete-${Date.now()}`,
        type: 'ai',
        content: '...',
        timestamp: new Date(),
        isTyping: true
      };
      
      setMessages(prev => [...prev, typingMessage]);
      
      // 분석 완료
      setTimeout(async () => {
        await completeAnalysis();
      }, 300);
    }
  };

  const showAdInChat = async () => {
    // 광고 시작 메시지
    const adStartMessage: Message = {
      id: `ad-start-${Date.now()}`,
      type: 'ai',
      content: '📺 광고를 시청해주세요!\n\n상세한 분석 결과를 확인하기 위해 짧은 광고를 시청해주세요.',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, adStartMessage]);
    
    // 1초 후 광고 시청 중 메시지
    setTimeout(() => {
      const adWatchingMessage: Message = {
        id: `ad-watching-${Date.now()}`,
        type: 'ai',
        content: '⏳ 광고 시청 중... (3초)',
        timestamp: new Date(),
        isTyping: true
      };
      
      setMessages(prev => [...prev, adWatchingMessage]);
    }, 1000);
    
    // 3초 광고 시청 시뮬레이션
    setTimeout(async () => {
      const adCompleteMessage: Message = {
        id: `ad-complete-${Date.now()}`,
        type: 'ai',
        content: '✅ 광고 시청 완료!\n\n상세 분석 결과 페이지로 이동합니다...',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev.slice(0, -1), adCompleteMessage]);
      
      // 1초 후 상세 결과 페이지로 이동
      setTimeout(async () => {
        const result = {
          analysisId,
          gender,
          answers,
          scores: calculateScores(),
          personalityResult: await determinePersonalityType(calculateScores()),
          completedAt: new Date().toISOString()
        };
        
        // 결과를 세션에 저장
        sessionStorage.setItem('analysisResult', JSON.stringify(result));
        
        // 상세 결과 페이지로 이동
        const resultData = encodeURIComponent(JSON.stringify(result.personalityResult));
        router.push(`/analysis/${analysisId}/premium-result?result=${resultData}`);
      }, 1000);
    }, 3000);
  };

  const completeAnalysis = async () => {
    setIsLoading(true);
    
    // 분석 완료 메시지
    const completionMessage: Message = {
      id: `completion-${Date.now()}`,
      type: 'ai',
      content: '🎉 모든 질문에 답변해주셔서 감사합니다!\n\n분석 결과를 계산하고 있습니다...',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, completionMessage]);

    try {
      // 점수 계산
      const scores = calculateScores();
      
      // 성격 유형 및 상세 결과 생성
      const personalityResult = await determinePersonalityType(scores);
      
      // 결과 생성
      const result = {
        analysisId,
        gender,
        answers,
        scores,
        personalityResult,
        completedAt: new Date().toISOString()
      };

      // 분석 완료 메시지들 (여러 버블로 나누어 표시)
      const completionMessages: Message[] = [
        {
          id: `completion-${Date.now()}`,
          type: 'ai',
          content: '✨ 분석이 완료되었습니다!',
          timestamp: new Date()
        },
        {
          id: `type-${Date.now() + 1}`,
          type: 'ai',
          content: `🎯 당신의 성향은 "${personalityResult.summary.catchphrase}"입니다!\n\n${personalityResult.type}`,
          timestamp: new Date()
        },
        {
          id: `strengths-${Date.now() + 2}`,
          type: 'ai',
          content: `💪 주요 강점\n\n${personalityResult.strengths.slice(0, 2).map(strength => `• ${strength}`).join('\n')}`,
          timestamp: new Date()
        },
        {
          id: `weaknesses-${Date.now() + 3}`,
          type: 'ai',
          content: `⚠️ 주의할 점\n\n${personalityResult.weaknesses.slice(0, 2).map(weakness => `• ${weakness}`).join('\n')}`,
          timestamp: new Date()
        },
        {
          id: `compatibility-${Date.now() + 4}`,
          type: 'ai',
          content: `💕 궁합\n\n• 잘 어울리는 성향: "${personalityResult.compatibility.best.catchphrase}"\n• 피해야 하는 성향: "${personalityResult.compatibility.worst.catchphrase}"`,
          timestamp: new Date()
        },
        {
          id: `action-${Date.now() + 5}`,
          type: 'ai',
          content: '더 자세한 분석 결과를 확인해보세요! 👇',
          timestamp: new Date(),
          options: {
            option1: '🔍 더 자세히 보러가기',
            option2: '🏠 홈으로 돌아가기'
          }
        }
      ];

      // 메시지들을 순차적으로 추가 (타이핑 효과) - 테스트를 위해 더 빠르게
      completionMessages.forEach((message, index) => {
        setTimeout(() => {
          // 타이핑 인디케이터 먼저 표시
          const typingMessage: Message = {
            id: `typing-${message.id}`,
            type: 'ai',
            content: '...',
            timestamp: new Date(),
            isTyping: true
          };
          
          setMessages(prev => [...prev, typingMessage]);
          
          // 0.3초 후 실제 메시지로 교체
          setTimeout(() => {
            setMessages(prev => [...prev.slice(0, -1), message]);
          }, 300);
        }, index * 500); // 0.5초 간격으로 메시지 추가 (더 빠르게)
      });
    } catch (error) {
      console.error('분석 완료 중 오류:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'ai',
        content: '죄송합니다. 분석 중 오류가 발생했습니다. 다시 시도해주세요.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateScores = () => {
    const axisScores = {
      axis1: 0, // 에겐/테토
      axis2: 0, // 액티브/리플렉트
      axis3: 0, // 플랜/플로우
      axis4: 0  // 표현/절제
    };

    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question) {
        const axis = question.axis;
        if (axis === '1') axisScores.axis1 += answer.axisScore;
        else if (axis === '2') axisScores.axis2 += answer.axisScore;
        else if (axis === '3') axisScores.axis3 += answer.axisScore;
        else if (axis === '4') axisScores.axis4 += answer.axisScore;
      }
    });

    return axisScores;
  };

  const determinePersonalityType = async (scores: any): Promise<PersonalityResult> => {
    console.log('점수 계산 결과:', scores);
    console.log('성별:', gender);
    
    const type1 = scores.axis1 > 0 ? '에겐' : '테토';
    const type2 = scores.axis2 > 0 ? '액티브' : '리플렉트';
    const type3 = scores.axis3 > 0 ? '플랜' : '플로우';
    const type4 = scores.axis4 > 0 ? '표현' : '절제';
    
    const genderSuffix = gender === 'male' ? '남' : '녀';
    const typeName = `${type1}${type2}${type3}${type4}${genderSuffix}`;
    
    console.log('생성된 성격 유형:', { type1, type2, type3, type4, genderSuffix, typeName });
    
    // 16개 유형별 상세 결과 생성
    return await generatePersonalityResult(typeName, type1, type2, type3, type4);
  };

  const generatePersonalityResult = async (typeName: string, type1: string, type2: string, type3: string, type4: string): Promise<PersonalityResult> => {
    try {
      console.log('성격 유형 생성:', { typeName, type1, type2, type3, type4, gender });
      
      // 데이터베이스에서 결과 가져오기
      const response = await fetch(`http://127.0.0.1:8000/api/v1/personality-results/${typeName}`);
      
      console.log('API 응답 상태:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 에러 응답:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('API 응답 데이터:', result);
      return result.data;
    } catch (error) {
      console.error('성격 결과 로드 실패:', error);
      console.error('요청한 typeName:', typeName);
      
      // 기본값 반환 (더 상세한 내용으로)
      return {
        type: typeName,
        summary: {
          catchphrase: `🎯 ${typeName}의 독특한 매력`,
          keywords: ['개성', '특별함', '독창성']
        },
        strengths: [
          '뛰어난 개성과 매력',
          '독창적인 사고방식',
          '특별한 감성과 직감',
          '유니크한 관점',
          '창의적인 아이디어'
        ],
        weaknesses: [
          '때로는 너무 독특해서 이해받기 어려움',
          '완벽주의 경향이 있을 수 있음',
          '감정적 기복이 있을 수 있음',
          '새로운 환경 적응에 시간이 필요',
          '타인의 시선을 의식하는 경향'
        ],
        relationships: '친구들에게는 특별하고 독특한 매력을 가진 친구로 기억되며, 연인에게는 깊이 있는 감정적 연결을 제공하는 파트너입니다. 동료들에게는 창의적이고 독창적인 아이디어로 팀에 새로운 시각을 제공합니다.',
        workStyle: '독창적이고 창의적인 접근 방식을 선호하며, 기존의 틀에 얽매이지 않고 새로운 방법을 찾아내는 능력이 뛰어납니다. 자유로운 환경에서 최고의 성과를 내는 스타일입니다.',
        stressResponse: '스트레스 상황에서는 혼자만의 시간을 통해 문제를 해결하려 하며, 창의적인 해결책을 찾아내려 합니다. 하지만 압박감이 극심할 때는 감정적 기복이 있을 수 있습니다.',
        growthTips: [
          '자신만의 독특함을 인정하고 받아들이기',
          '타인과의 소통 방법 개선하기',
          '감정 조절을 위한 명상이나 취미 활동',
          '새로운 경험에 대한 개방성 기르기',
          '자신의 가치를 믿고 자신감 갖기'
        ],
        compatibility: {
          best: { type: '상호 보완적인 성향', reason: '서로의 다른 점을 인정하고 보완해주는 관계에서 가장 좋은 시너지를 낼 수 있습니다.' },
          worst: { type: '비슷한 성향', reason: '너무 비슷한 성향끼리는 오히려 갈등이 생기거나 발전이 더뎌질 수 있습니다.' }
        }
      };
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setAnswers(prev => prev.slice(0, -1));
      setMessages(prev => prev.slice(0, -2)); // 사용자 답변과 AI 질문 제거
    }
  };

  if (isLoading && questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">질문을 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100">
      <div className="max-w-[700px] mx-auto h-full flex flex-col">
        {/* 네비게이션바 */}
        <div className="flex-shrink-0 bg-white p-4 flex items-center">
          <button onClick={() => window.history.back()} className="text-gray-600 hover:text-gray-800 mr-4">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">에겐남, 테토남, 에겐녀, 테토녀 성향분석</h2>
        </div>

        {/* 채팅 영역 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.type === 'user'
                    ? 'bg-white text-gray-800'
                    : 'bg-blue-500 text-white'
                }`}
              >
                {msg.isTyping ? (
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-md whitespace-pre-line">{msg.content}</div>
                )}
                {msg.options && msg.type === 'ai' && (msg.id.includes(`question-${questions[currentQuestionIndex]?.id}`) || msg.id.includes('gender') || msg.id.includes('action-')) && (
                  <div className="mt-3 space-y-2">
                    <button
                      onClick={() => handleAnswer(0)}
                      className="w-full text-left p-2 bg-blue-400 text-white rounded-md hover:bg-blue-600 focus:bg-blue-600 focus:outline-none transition-colors text-md"
                      disabled={isLoading || currentQuestionIndex >= questions.length}
                    >
                      {msg.options.option1}
                    </button>
                    <button
                      onClick={() => handleAnswer(1)}
                      className="w-full text-left p-2 bg-blue-400 text-white rounded-md hover:bg-blue-600 focus:bg-blue-600 focus:outline-none transition-colors text-md"
                      disabled={isLoading || currentQuestionIndex >= questions.length}
                    >
                      {msg.options.option2}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[70%] p-3 rounded-lg bg-blue-500 text-white flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span className="text-md">입력 중...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

      </div>
    </div>
  );
}
