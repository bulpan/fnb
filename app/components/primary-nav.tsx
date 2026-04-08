'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', label: '종목 분석' },
  { href: '/growth', label: '성장형 전략' },
];

export default function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {items.map((item) => {
        const active = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              active
                ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-200'
                : 'border-gray-700 bg-gray-900/60 text-gray-400 hover:border-gray-500 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
