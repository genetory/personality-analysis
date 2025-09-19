'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <nav className="bg-white">
      <div className="max-w-[700px] mx-auto px-4 h-16">
        <div className="flex items-center h-full">
          <Link href="/" className="text-xl font-bold text-gray-900">
            성향분석
          </Link>
        </div>
      </div>
    </nav>
  );
}
