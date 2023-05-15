import React from 'react';
import { AppRoute } from '@constants/app-routes';
import Link from 'next/link';
import { SignedIn, UserButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { cn } from '@utils/classNames';
import { Logo } from '@components/ui/logo';
import { Settings } from 'lucide-react';

const links: { name: string; href: AppRoute }[] = [
  { name: 'Overview', href: AppRoute.HOME },
  { name: 'Projects', href: AppRoute.PROJECTS },
  { name: 'Knowledge base', href: AppRoute.KNOWLEDGE_BASE },
  { name: 'Calendar', href: AppRoute.CALENDAR },
];

export const Navigation = () => {
  const router = useRouter();

  const user = useUser();

  const isActive = (href: AppRoute) => router.pathname === href;

  return (
    <div className=" flex h-16 min-h-screen flex-col items-center border-r px-6">
      <div className={'my-4'}>
        <Logo />
      </div>
      <nav className=" mt-4 flex grow flex-col gap-4">
        <ul className={'flex grow flex-col gap-4'}>
          {links.map(({ name, href }) => (
            <li
              key={name}
              className={cn(
                'rounded p-2 text-gray-500',
                isActive(href) && 'bg-blue-100 text-blue-600',
                !isActive(href) &&
                  'text-gray-500 hover:bg-gray-100 hover:text-black',
              )}
            >
              <Link href={href}>
                <a
                  className={
                    'rounded-md p-2 text-sm font-medium transition-colors'
                  }
                >
                  {name}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className={'mb-6 flex w-full flex-row'}>
        <SignedIn>
          <div className={'flex w-full flex-row items-center justify-between'}>
            <div className={'flex items-center gap-4'}>
              <UserButton />
              <span className={'font-semibold text-gray-500'}>
                {user.user?.username}
              </span>
            </div>
            <Link href={AppRoute.SETTINGS}>
              <a className={'text-gray-500 hover:text-black'}>
                <Settings size={20} />
              </a>
            </Link>
          </div>
        </SignedIn>
      </div>
    </div>
  );
};
