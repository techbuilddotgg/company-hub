import React from 'react';
import { AppRoute } from '@constants/app-routes';
import Link from 'next/link';
import { SignInButton, SignedOut, SignedIn } from '@clerk/nextjs';
import { SignOutButton } from '@clerk/clerk-react';

const links: { name: string; href: AppRoute }[] = [
  { name: 'Overview', href: AppRoute.HOME },
  { name: 'Projects', href: AppRoute.PROJECTS },
  { name: 'Knowledge base', href: AppRoute.KNOWLEDGE_BASE },
  { name: 'Calendar', href: AppRoute.CALENDAR },
];

export const Navigation = () => {
  return (
    <div className=" flex h-16 min-h-screen flex-col items-center border-r px-6">
      <nav className=" mt-10 flex grow flex-col items-center gap-4">
        {links.map(({ name, href }) => (
          <Link href={href} key={name}>
            <a
              className={
                'text-sm font-medium transition-colors hover:text-primary'
              }
            >
              {name}
            </a>
          </Link>
        ))}
      </nav>
      <div className={'mb-6'}>
        <SignedIn>
          <SignOutButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </div>
  );
};
