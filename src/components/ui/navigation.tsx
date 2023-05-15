import React from 'react';
import { AppRoute } from '@constants/app-routes';
import Link from 'next/link';
import { SignedIn, UserButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { cn } from '@utils/classNames';
import { Logo } from '@components/ui/logo';
import { Settings } from 'lucide-react';
import { trpc } from '@utils/trpc';

const links: { name: string; href: AppRoute }[] = [
  { name: 'Overview', href: AppRoute.HOME },
  { name: 'Projects', href: AppRoute.PROJECTS },
  { name: 'Knowledge base', href: AppRoute.KNOWLEDGE_BASE },
  { name: 'Calendar', href: AppRoute.CALENDAR },
];

export const Navigation = () => {
  const router = useRouter();

  const user = useUser();

  const isActive = (href: string) => {
    return router.asPath === href;
  };
  const { data: projects } = trpc.project.get.useQuery();

  return (
    <div className=" flex h-16 min-h-screen flex-col items-center border-r px-6">
      <div className={'my-4'}>
        <Logo />
      </div>
      <nav className=" mt-4 flex grow flex-col gap-4">
        <ul className={'flex grow flex-col gap-4'}>
          <li
            key={'Overview'}
            className={cn(
              'rounded p-2 text-gray-500',
              isActive(AppRoute.HOME) && 'bg-blue-100 text-blue-600',
              !isActive(AppRoute.HOME) &&
                'text-gray-500 hover:bg-gray-100 hover:text-black',
            )}
          >
            <Link href={AppRoute.HOME}>
              <a
                className={
                  'rounded-md p-2 text-sm font-medium transition-colors'
                }
              >
                {'Overview'}
              </a>
            </Link>
          </li>
          <li
            key={'Projects'}
            className={cn(
              'rounded p-2 text-gray-500',
              isActive(AppRoute.PROJECTS) && 'bg-blue-100 text-blue-600',
              !isActive(AppRoute.PROJECTS) &&
                'text-gray-500 hover:bg-gray-100 hover:text-black',
            )}
          >
            <Link href={AppRoute.PROJECTS}>
              <a
                className={
                  'rounded-md p-2 text-sm font-medium transition-colors'
                }
              >
                {'Projects'}
              </a>
            </Link>
          </li>
          {projects?.map((project) => (
            <li
              key={project.id}
              className={cn(
                'ml-5 rounded p-2 text-gray-500',
                isActive(`${AppRoute.PROJECTS}/${project.id}`) &&
                  'bg-blue-100 text-blue-600',
                !isActive(`${AppRoute.PROJECTS}/${project.id}`) &&
                  'text-gray-500 hover:bg-gray-100 hover:text-black',
              )}
            >
              <Link
                href={`${AppRoute.PROJECTS}/${project.id}`}
                key={project.name}
              >
                <a className="rounded-md p-2 text-sm font-medium transition-colors">
                  {project.name}
                </a>
              </Link>
            </li>
          ))}
          <li
            key={'Knowledge base'}
            className={cn(
              'rounded p-2 text-gray-500',
              isActive(AppRoute.KNOWLEDGE_BASE) && 'bg-blue-100 text-blue-600',
              !isActive(AppRoute.KNOWLEDGE_BASE) &&
                'text-gray-500 hover:bg-gray-100 hover:text-black',
            )}
          >
            <Link href={AppRoute.KNOWLEDGE_BASE}>
              <a
                className={
                  'rounded-md p-2 text-sm font-medium transition-colors'
                }
              >
                {'Knowledge base'}
              </a>
            </Link>
          </li>
          <li
            key={'Calendar'}
            className={cn(
              'rounded p-2 text-gray-500',
              isActive(AppRoute.CALENDAR) && 'bg-blue-100 text-blue-600',
              !isActive(AppRoute.CALENDAR) &&
                'text-gray-500 hover:bg-gray-100 hover:text-black',
            )}
          >
            <Link href={AppRoute.CALENDAR}>
              <a
                className={
                  'rounded-md p-2 text-sm font-medium transition-colors'
                }
              >
                {'Calendar'}
              </a>
            </Link>
          </li>
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
