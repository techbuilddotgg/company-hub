import React from 'react';
import { AppRoute } from '@constants/app-routes';
import Link from 'next/link';
import { SignedIn, UserButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { cn } from '@utils/classNames';

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
      <h1 className={'my-4'}>
        Tech<span className={'text-blue-600'}>Build</span>
      </h1>
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
          <div className={'flex w-full flex-row items-center gap-4'}>
            <UserButton />
            <span className={'font-semibold text-gray-600'}>
              {user.user?.username}
            </span>
          </div>
        </SignedIn>
      </div>
    </div>
  );
};
