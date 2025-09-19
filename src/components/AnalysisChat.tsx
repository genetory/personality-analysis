'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  category: string;
  axis: string;
  order_index: number;
  options: QuestionOption[];
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
  type_name: string; // 예: "에겐남-라이트", "테토녀-하드코어" 등
  type_title: string;
  type_description: string;
  keywords: string[];
  strengths: string[];
  weaknesses: string[];
  relationships: string;
  work_style: string;
  stress_response: string;
  growth_tips: string[];
  compatibility_best_type: string;
  compatibility_best_type_title: string;
  compatibility_best_reason: string;
  compatibility_worst_type: string;
  compatibility_worst_type_title: string;
  compatibility_worst_reason: string;
  point: string;
}

interface AnalysisChatProps {
  analysisId: string;
  onComplete: (result: unknown) => void;
}

export default function AnalysisChat({ analysisId, onComplete }: AnalysisChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; optionId: string; value: number; axisScore: number }[]>([]);
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
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
                option1: firstQuestion.options[0]?.text || '',
                option2: firstQuestion.options[1]?.text || ''
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

    // 분석 완료 후 결과 메시지의 버튼 처리
    if (currentQuestionIndex >= questions.length) {
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
    const selectedOption = currentQuestion.options[optionIndex];
    
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

    // 다음 질문이 있으면 계속 진행, 없으면 분석 완료
    if (nextIndex < questions.length) {
      console.log('Showing next question');
      // 기존 타이핑 메시지 제거
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      
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
            option1: nextQuestion.options[0]?.text || '',
            option2: nextQuestion.options[1]?.text || ''
          }
        };
        
        setMessages(prev => [...prev.slice(0, -1), questionMessage]);
      }, 300);
    } else {
      console.log('Analysis complete, starting completion process');
      // 기존 타이핑 메시지 제거
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      
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
    // 기존 타이핑 메시지 제거
    setMessages(prev => prev.filter(msg => !msg.isTyping));
    
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
      // 기존 타이핑 메시지 제거
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      
      const adCompleteMessage: Message = {
        id: `ad-complete-${Date.now()}`,
        type: 'ai',
        content: '✅ 광고 시청 완료!\n\n상세 분석 결과 페이지로 이동합니다...',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, adCompleteMessage]);
      
      // 1초 후 상세 결과 페이지로 이동
      setTimeout(async () => {
        try {
          // 답변 데이터 준비
          const answerData = answers.map((answer, index) => ({
            question_id: questions[index]?.id,
            option_id: answer.optionId
          }));

          // 새로운 분석 API 호출
          const response = await fetch('http://127.0.0.1:8000/api/v1/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              analysis_id: analysisId,
              gender: gender,
              answers: answerData
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('분석 API 에러:', errorText);
            throw new Error(`분석 중 오류가 발생했습니다: ${response.status}`);
          }

          const analysisResponse = await response.json();
          const analysisData = analysisResponse.data;
          
          if (!analysisData) {
            throw new Error('분석 결과를 가져올 수 없습니다.');
          }
          
          // 결과 생성
          const result = {
            analysisId: analysisData.analysis_id,
            gender: analysisData.gender,
            answers: analysisData.answers,
            scores: analysisData.scores,
            personalityResult: analysisData.personality_result,
            completedAt: analysisData.completed_at
          };
          
          // onComplete 콜백 호출
          onComplete(result);
        } catch (error) {
          console.error('광고 시청 후 분석 오류:', error);
          
          // 기존 타이핑 메시지 제거
          setMessages(prev => prev.filter(msg => !msg.isTyping));
          
          // 에러 메시지 표시
          const errorMessage: Message = {
            id: `error-${Date.now()}`,
            type: 'ai',
            content: `죄송합니다. 분석 중 오류가 발생했습니다.\n\n오류: ${error instanceof Error ? error.message : String(error)}\n\n다시 시도해주세요.`,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, errorMessage]);
        }
      }, 1000);
    }, 3000);
  };

  const completeAnalysis = async () => {
    // 기존 타이핑 메시지 제거
    setMessages(prev => prev.filter(msg => !msg.isTyping));
    
    // 분석 완료 메시지
    const completionMessage: Message = {
      id: `completion-${Date.now()}`,
      type: 'ai',
      content: '🎉 모든 질문에 답변해주셔서 감사합니다!\n\n분석 결과를 계산하고 있습니다...',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, completionMessage]);

    try {
      // 답변 데이터 준비
      const answerData = answers.map((answer, index) => ({
        question_id: questions[index]?.id,
        option_id: answer.optionId
      }));

      // 새로운 분석 API 호출
      const response = await fetch('http://127.0.0.1:8000/api/v1/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          analysis_id: analysisId,
          gender: gender,
          answers: answerData
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('분석 API 에러:', errorText);
        throw new Error(`분석 중 오류가 발생했습니다: ${response.status}`);
      }

      const analysisResponse = await response.json();
      const analysisData = analysisResponse.data;
      
      if (!analysisData) {
        throw new Error('분석 결과를 가져올 수 없습니다.');
      }
      
      // 결과 생성
      const result = {
        analysisId: analysisData.analysis_id,
        gender: analysisData.gender,
        answers: analysisData.answers,
        scores: analysisData.scores,
        personalityResult: analysisData.personality_result,
        completedAt: analysisData.completed_at
      };

      // onComplete 콜백 호출
      onComplete(result);

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
          content: `🎯 당신의 성향은 "${analysisData.personality_result.type_title}"입니다!\n\n${analysisData.personality_result.type_description}`,
          timestamp: new Date()
        },
        {
          id: `strengths-${Date.now() + 2}`,
          type: 'ai',
          content: `💪 주요 강점\n\n${analysisData.personality_result.strengths.slice(0, 2).map((strength: string) => `• ${strength}`).join('\n')}`,
          timestamp: new Date()
        },
        {
          id: `weaknesses-${Date.now() + 3}`,
          type: 'ai',
          content: `⚠️ 주의할 점\n\n${analysisData.personality_result.weaknesses.slice(0, 2).map((weakness: string) => `• ${weakness}`).join('\n')}`,
          timestamp: new Date()
        },
        {
          id: `compatibility-${Date.now() + 4}`,
          type: 'ai',
          content: `💕 궁합\n\n• 잘 어울리는 성향: "${analysisData.personality_result.compatibility_best_type}"\n• 피해야 하는 성향: "${analysisData.personality_result.compatibility_worst_type}"`,
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
          // 기존 타이핑 메시지 제거
          setMessages(prev => prev.filter(msg => !msg.isTyping));
          
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
      
      // 기존 타이핑 메시지 제거
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'ai',
        content: `죄송합니다. 분석 중 오류가 발생했습니다.\n\n오류: ${error instanceof Error ? error.message : String(error)}\n\n다시 시도해주세요.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
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

  const determinePersonalityType = async (scores: { axis1: number; axis2: number; axis3: number; axis4: number }): Promise<PersonalityResult> => {
    console.log('점수 계산 결과:', scores);
    console.log('성별:', gender);
    
    // 에겐/테토 판별 (axis1)
    const baseType = scores.axis1 > 0 ? '에겐' : '테토';
    const genderSuffix = gender === 'male' ? '남' : '녀';
    
    // 강도 판별 (axis2, axis3, axis4의 절댓값 합계로 판단)
    const totalIntensity = Math.abs(scores.axis2) + Math.abs(scores.axis3) + Math.abs(scores.axis4);
    let intensity: string;
    
    if (totalIntensity <= 2) {
      intensity = '라이트';
    } else if (totalIntensity <= 4) {
      intensity = '스탠다드';
    } else {
      intensity = '하드코어';
    }
    
    const typeName = `${baseType}${genderSuffix}-${intensity}`;
    
    console.log('생성된 성격 유형:', { baseType, genderSuffix, intensity, typeName, totalIntensity });
    
    // 12개 유형별 상세 결과 생성
    return await generatePersonalityResult(typeName, baseType, genderSuffix, intensity);
  };

  const generatePersonalityResult = async (typeName: string, baseType: string, genderSuffix: string, intensity: string): Promise<PersonalityResult> => {
    try {
      console.log('성격 유형 생성:', { typeName, baseType, genderSuffix, intensity, gender });
      
      // 데이터베이스에서 결과 가져오기
      const url = `http://127.0.0.1:8000/api/v1/personality-results/${encodeURIComponent(typeName)}`;
      console.log('API 요청 URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('API 응답 상태:', response.status);
      console.log('API 응답 헤더:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 에러 응답:', errorText);
        console.error('응답 상태:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('API 응답 데이터:', result);
      console.log('반환할 데이터:', result.data);
      
      if (!result.data) {
        throw new Error('API 응답에 data 필드가 없습니다.');
      }
      
      return result.data;
    } catch (error) {
      console.error('성격 결과 로드 실패:', error);
      console.error('요청한 typeName:', typeName);
      console.error('오류 상세:', {
        name: error instanceof Error ? error.name : 'Unknown Error',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // 오류 발생 시 null 반환
      throw error;
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
      <div className="h-full flex flex-col">
        {/* 네비게이션바 */}
        <div className="flex-shrink-0 bg-white">
          <div className="max-w-[700px] mx-auto px-4 h-16 flex items-center">
            <button onClick={() => window.history.back()} className="text-gray-600 hover:text-gray-800 mr-4">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">에겐남, 테토남, 에겐녀, 테토녀 성향분석</h2>
          </div>
        </div>

        {/* 채팅 영역 */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[700px] mx-auto px-4 py-4 space-y-4">
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
                      disabled={isLoading}
                    >
                      {msg.options.option1}
                    </button>
                    <button
                      onClick={() => handleAnswer(1)}
                      className="w-full text-left p-2 bg-blue-400 text-white rounded-md hover:bg-blue-600 focus:bg-blue-600 focus:outline-none transition-colors text-md"
                      disabled={isLoading}
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
    </div>
  ); 
}
