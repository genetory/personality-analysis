'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Star, Heart, Briefcase, AlertTriangle, Target, Users, ChevronLeft, ChevronRight } from 'lucide-react';

interface PersonalityResult {
  type: string;
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
      catchphrase: string;
      reason: string;
    };
    worst: {
      type: string;
      catchphrase: string;
      reason: string;
    };
  };
}

interface SectionChatProps {
  result: PersonalityResult;
  onRestart: () => void;
  onGoHome: () => void;
}

interface ChatMessage {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

const sections = [
  { id: 'summary', title: '요약', icon: '🎯', color: 'gray' },
  { id: 'strengths', title: '강점', icon: '💪', color: 'gray' },
  { id: 'weaknesses', title: '주의할 점', icon: '⚠️', color: 'gray' },
  { id: 'relationships', title: '인간관계', icon: '👥', color: 'gray' },
  { id: 'workStyle', title: '업무 스타일', icon: '💼', color: 'gray' },
  { id: 'stressResponse', title: '스트레스 대응', icon: '😰', color: 'gray' },
  { id: 'growthTips', title: '성장 팁', icon: '🌱', color: 'gray' },
  { id: 'compatibility', title: '궁합', icon: '💕', color: 'gray' }
];

export default function SectionChat({ result, onRestart, onGoHome }: SectionChatProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // 섹션이 변경될 때마다 새로운 채팅 시작
    startSectionChat(currentSection);
  }, [currentSection]);

  const startSectionChat = async (sectionIndex: number) => {
    const section = sections[sectionIndex];
    setMessages([]);
    setIsTyping(true);

    // 인사말
    const greetingMessage: ChatMessage = {
      id: `greeting-${Date.now()}`,
      type: 'ai',
      content: `안녕하세요! 👋\n\n${section.icon} **${section.title}**에 대해 이야기해볼까요?\n\n당신의 성향 분석 결과를 바탕으로 자세히 설명해드릴게요!`,
      timestamp: new Date()
    };

    setMessages([greetingMessage]);

    // 1초 후 타이핑 시작
    setTimeout(() => {
      setIsTyping(false);
      generateSectionContent(sectionIndex);
    }, 1000);
  };

  const generateSectionContent = async (sectionIndex: number) => {
    const section = sections[sectionIndex];
    let content = '';

    switch (section.id) {
      case 'summary':
        content = `🎯 ${result.type}의 핵심 특징을 알려드릴게요!\n\n"${result.summary.catchphrase}"\n\n주요 키워드:\n${result.summary.keywords.map(keyword => `• ${keyword}`).join('\n')}\n\n이 성향의 가장 큰 특징은 ${result.summary.keywords[0]}과 ${result.summary.keywords[1]}입니다. 이런 특성들이 당신의 독특한 매력을 만들어내고 있어요! ✨`;
        break;
      
      case 'strengths':
        content = `💪 당신의 강점을 자세히 살펴보겠습니다!\n\n${result.strengths.map((strength, index) => `${index + 1}. ${strength}\n   이 강점은 당신이 ${result.type} 성향을 가진 사람답게 발휘하는 특별한 능력이에요. 특히 ${strength.includes('리더십') ? '팀을 이끌고 목표를 달성하는 데' : strength.includes('창의') ? '새로운 아이디어를 만들어내는 데' : '문제를 해결하고 성과를 내는 데'} 큰 도움이 됩니다.`).join('\n\n')}\n\n이런 강점들을 잘 활용하시면 더욱 성공적인 삶을 살 수 있을 거예요! 🌟`;
        break;
      
      case 'weaknesses':
        content = `⚠️ 주의할 점에 대해 솔직하게 말씀드릴게요.\n\n${result.weaknesses.map((weakness, index) => `${index + 1}. ${weakness}\n   이 부분은 ${result.type} 성향의 사람들이 때때로 겪는 어려움이에요. 하지만 걱정하지 마세요! 이런 특성을 인식하고 관리하는 방법을 알면 오히려 성장의 기회가 될 수 있어요.`).join('\n\n')}\n\n약점을 인정하는 것도 용기예요. 함께 극복해봐요! 💪`;
        break;
      
      case 'relationships':
        content = `👥 인간관계에서의 당신을 분석해드릴게요!\n\n${result.relationships}\n\n친구 관계에서는:\n• ${result.type.includes('에겐') ? '적극적이고 리더십 있는 모습' : '신중하고 든든한 조언자 모습'}을 보여요\n• ${result.type.includes('표현') ? '활발한 소통과 에너지' : '차분하고 깊이 있는 대화'}로 관계를 이끌어가요\n\n연인 관계에서는:\n• ${result.type.includes('에겐') ? '로맨틱하고 적극적인 사랑' : '안정적이고 깊이 있는 사랑'}을 표현해요\n• ${result.type.includes('플랜') ? '계획적이고 신뢰할 수 있는' : '자유롭고 유연한'} 파트너가 되어요\n\n동료 관계에서는:\n• ${result.type.includes('액티브') ? '추진력 있고 활발한' : '신중하고 정확한'} 업무 스타일을 보여요`;
        break;
      
      case 'workStyle':
        content = `💼 업무 스타일을 분석해드릴게요!\n\n${result.workStyle}\n\n당신의 업무 특징:\n• ${result.type.includes('플랜') ? '체계적이고 계획적인' : '유연하고 적응력 있는'} 접근 방식\n• ${result.type.includes('에겐') ? '적극적이고 추진력 있는' : '신중하고 분석적인'} 의사결정\n• ${result.type.includes('표현') ? '소통과 협업을 중시하는' : '정확성과 완성도를 중시하는'} 업무 태도\n\n추천하는 업무 환경:\n• ${result.type.includes('에겐') ? '활발하고 도전적인' : '안정적이고 집중할 수 있는'} 환경\n• ${result.type.includes('표현') ? '팀워크와 소통이 중요한' : '개인의 전문성을 발휘할 수 있는'} 프로젝트\n\n이런 환경에서 당신의 능력을 최대한 발휘할 수 있을 거예요! 🚀`;
        break;
      
      case 'stressResponse':
        content = `😰 스트레스 대응 방식을 알아보겠습니다!\n\n${result.stressResponse}\n\n스트레스 상황에서의 당신:\n• ${result.type.includes('에겐') ? '더욱 적극적으로 문제에 뛰어들어' : '더욱 신중하게 상황을 분석하여'} 해결하려 해요\n• ${result.type.includes('액티브') ? '활발하게 움직이며' : '조용히 혼자만의 시간을 통해'} 스트레스를 해소해요\n\n스트레스 관리 팁:\n• ${result.type.includes('플랜') ? '미리 계획을 세워 예방하기' : '유연하게 상황에 대응하기'}\n• ${result.type.includes('표현') ? '감정을 적극적으로 표현하기' : '감정을 조절하고 안정감 찾기'}\n• 정기적인 휴식과 재충전 시간 확보\n\n스트레스는 성장의 기회예요. 건강하게 관리해봐요! 🌱`;
        break;
      
      case 'growthTips':
        content = `🌱 성장 팁을 제안해드릴게요!\n\n${result.growthTips.map((tip, index) => `${index + 1}. ${tip}\n   이는 ${result.type} 성향의 사람들이 특히 주의해야 할 부분이에요. 꾸준히 연습하시면 큰 변화를 느끼실 수 있을 거예요.`).join('\n\n')}\n\n성장을 위한 구체적인 방법:\n• 매일 조금씩이라도 새로운 시도해보기\n• 주변 사람들의 피드백 적극적으로 받아들이기\n• 자신만의 성장 기록 남기기\n• 실패를 두려워하지 않고 도전하기\n\n성장은 하루아침에 이루어지지 않아요. 꾸준히 노력하시면 분명 좋은 결과가 있을 거예요! 💪`;
        break;
      
      case 'compatibility':
        content = `💕 궁합 정보를 알려드릴게요!\n\n💚 잘 어울리는 성향: "${result.compatibility.best.catchphrase}"\n${result.compatibility.best.reason}\n\n💔 피해야 하는 성향: "${result.compatibility.worst.catchphrase}"\n${result.compatibility.worst.reason}\n\n궁합의 핵심:\n• ${result.type.includes('에겐') ? '에너지 넘치는' : '차분하고 안정적인'} 성향과 잘 어울려요\n• ${result.type.includes('표현') ? '소통이 많은' : '깊이 있는'} 관계를 선호해요\n• ${result.type.includes('플랜') ? '계획적이고 체계적인' : '유연하고 자유로운'} 파트너와 시너지가 좋아요\n\n관계에서 주의할 점:\n• 서로의 차이점을 인정하고 존중하기\n• 소통의 중요성 잊지 않기\n• 개인의 공간과 시간 존중하기\n\n좋은 관계는 서로를 이해하고 보완해주는 거예요! 💖`;
        break;
    }

    // 타이핑 효과로 메시지 표시
    const typingMessage: ChatMessage = {
      id: `typing-${Date.now()}`,
      type: 'ai',
      content: '...',
      timestamp: new Date(),
      isTyping: true
    };

    setMessages(prev => [...prev, typingMessage]);

    // 타이핑 효과 시뮬레이션
    setTimeout(() => {
      const contentMessage: ChatMessage = {
        id: `content-${Date.now()}`,
        type: 'ai',
        content: content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev.slice(0, -1), contentMessage]);
    }, 1500);
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };


  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* 네비게이션바 */}
      <div className="flex-shrink-0 bg-white p-4 flex items-center">
        <div className="max-w-[700px] mx-auto w-full flex items-center">
          <button onClick={onGoHome} className="text-gray-600 hover:text-gray-800 mr-4">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">섹션별 상세 분석</h2>
        </div>
      </div>

      {/* 섹션 네비게이션 */}
      <div className="bg-white border-b">
        <div className="max-w-[700px] mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={prevSection}
              disabled={currentSection === 0}
              className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              이전
            </button>
            
            <div className="flex items-center space-x-2">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(index)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    index === currentSection
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {section.icon} {section.title}
                </button>
              ))}
            </div>

            <button
              onClick={nextSection}
              disabled={currentSection === sections.length - 1}
              className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-[700px] mx-auto">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-white text-gray-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.isTyping ? (
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm leading-relaxed whitespace-pre-line">
                      {msg.content}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-4 rounded-lg bg-gray-100 text-gray-800">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* 하단 액션 버튼 */}
      <div className="bg-white border-t p-4">
        <div className="max-w-4xl mx-auto flex justify-center space-x-4">
          <button
            onClick={prevSection}
            disabled={currentSection === 0}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            이전 섹션
          </button>
          <button
            onClick={nextSection}
            disabled={currentSection === sections.length - 1}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            다음 섹션
          </button>
        </div>
      </div>
    </div>
  );
}
