import Link from 'next/link';
import { CommonSectionTitle } from '@/components/common';

interface PopularAnalysis {
  id: number;
  name: string;
  description: string;
  image: string;
  participants: number;
  category: string;
  color: string;
  bgColor: string;
}

const popularAnalyses: PopularAnalysis[] = [
  {
    id: 1,
    name: "MBTI 성격유형",
    description: "16가지 성격 유형으로 나를 알아보는 가장 인기 있는 성향분석",
    image: "/api/placeholder/300/200",
    participants: 1250000,
    category: "성격",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    id: 2,
    name: "에니어그램",
    description: "9가지 유형으로 나의 내면을 탐구하는 깊이 있는 성향분석",
    image: "/api/placeholder/300/200",
    participants: 890000,
    category: "성격",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    id: 3,
    name: "사랑의 언어",
    description: "나와 상대방의 사랑 표현 방식을 알아보는 관계 분석",
    image: "/api/placeholder/300/200",
    participants: 650000,
    category: "관계",
    color: "text-pink-600",
    bgColor: "bg-pink-50"
  },
  {
    id: 4,
    name: "스트레스 대응",
    description: "나만의 스트레스 관리법과 회복력을 알아보는 분석",
    image: "/api/placeholder/300/200",
    participants: 420000,
    category: "심리",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    id: 5,
    name: "리더십 스타일",
    description: "나만의 리더십 유형과 팀워크 방식을 발견하는 분석",
    image: "/api/placeholder/300/200",
    participants: 380000,
    category: "직업",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    id: 6,
    name: "학습 스타일",
    description: "나에게 맞는 학습 방법과 기억력을 높이는 전략 분석",
    image: "/api/placeholder/300/200",
    participants: 290000,
    category: "교육",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  }
];

export default function PopularAnalysisSection() {
  const formatParticipants = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  return (
    <div className="w-full px-4 py-16">
      <div className="max-w-[700px] mx-auto">
        {/* Section Header */}
        <CommonSectionTitle
          title="인기 성향분석"
          subtitle="많은 사람들이 선택한 인기 있는 성향분석을 만나보세요"
        />

        {/* Analysis Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {popularAnalyses.map((analysis) => (
            <Link
              key={analysis.id}
              href={`/analysis/${analysis.id}`}
              className="group block"
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className={`absolute inset-0 ${analysis.bgColor} opacity-20`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-16 h-16 ${analysis.color} rounded-full flex items-center justify-center`}>
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${analysis.bgColor} ${analysis.color}`}>
                      {analysis.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {analysis.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {analysis.description}
                  </p>
                  
                  {/* Participants Count */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{formatParticipants(analysis.participants)}명 참여</span>
                    </div>
                    <div className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
                      분석하기 →
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/analyses"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            모든 성향분석 보기
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
