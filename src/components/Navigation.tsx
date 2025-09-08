'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  return (
    <nav className="bg-white">
      <div className="max-w-[700px] mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              플랫폼
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
