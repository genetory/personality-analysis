'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // 분석 페이지들에서는 네비게이션 없이 전체 화면 사용
  if (pathname.startsWith('/analysis/')) {
    return <>{children}</>;
  }
  
  // 일반 페이지에서는 네비게이션과 함께 표시
  return (
    <>
      <Navigation />
      <main className="min-h-screen max-w-[700px] mx-auto">
        {children}
      </main>
    </>
  );
}
