import React from 'react';
import { AppRoute } from '@constants/app-routes';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { SignOutButton } from '@clerk/clerk-react';
import { trpc } from '@utils/trpc';

const links: { name: string; href: AppRoute }[] = [
  { name: 'Overview', href: AppRoute.HOME },
  { name: 'Projects', href: AppRoute.PROJECTS },
  { name: 'Knowledge base', href: AppRoute.KNOWLEDGE_BASE },
  { name: 'Calendar', href: AppRoute.CALENDAR },
];

export const Navigation = () => {
  const { data: projects } = trpc.project.get.useQuery();
  return (
    <div className=" flex h-16 min-h-screen flex-col items-center border-r px-6">
      <nav className=" mt-10 flex grow flex-col items-center gap-4">
        {links.map(({ name, href }, index) =>
          href === AppRoute.PROJECTS ? (
            <div key={index}>
              <p className="text-sm font-medium transition-colors hover:text-primary">
                {name}
              </p>
              <div className="flex flex-col gap-2">
                {projects?.map((project, index) => (
                  <Link key={index} href={`project/${project.id}`}>
                    <a
                      className={
                        'text-xs font-medium transition-colors hover:text-primary'
                      }
                    >
                      {project.name}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link href={href} key={name}>
              <a
                className={
                  'text-sm font-medium transition-colors hover:text-primary'
                }
              >
                {name}
              </a>
            </Link>
          ),
        )}
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
