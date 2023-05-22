import React, { useState } from 'react';
import { AppRoute } from '@constants/app-routes';
import Link from 'next/link';
import { SignedIn, UserButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { cn } from '@utils/classNames';
import { Logo } from '@components/ui/logo';
import { Menu, Settings } from 'lucide-react';
import { trpc } from '@utils/trpc';
import { useWindow } from '../../hooks/useWindow';
import { Button } from '@components/ui/button';
import {
  SheetContent,
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@components/ui/sheet';

const UserSection = () => {
  const user = useUser();
  return (
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
  );
};

const MainNavigation = () => {
  const router = useRouter();

  const isActive = (href: string) => {
    return router.asPath === href;
  };
  const { data: projects } = trpc.project.get.useQuery();

  return (
    <nav className=" mt-4 flex w-full grow  flex-col gap-4">
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
              className={'rounded-md p-2 text-sm font-medium transition-colors'}
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
              className={'rounded-md p-2 text-sm font-medium transition-colors'}
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
              className={'rounded-md p-2 text-sm font-medium transition-colors'}
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
              className={'rounded-md p-2 text-sm font-medium transition-colors'}
            >
              {'Calendar'}
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const MobileNavigation = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className={'m-4'} variant={'outline'}>
          <Menu className={'h-4 w-4'} />
        </Button>
      </SheetTrigger>
      <SheetContent position={'left'} size="content" className={'p-8'}>
        <SheetHeader>
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>

        <div className="flex h-[85vh] grow flex-col py-4">
          <MainNavigation />
        </div>

        <SheetFooter className={'mt-auto'}>
          <UserSection />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export const WebNavigation = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div>
      {showMenu ? (
        <div className=" flex h-full flex-col items-center border-r px-6">
          <div className={'my-4 flex flex-row items-center gap-2'}>
            <Menu
              className={'cursor-pointer'}
              onClick={() => setShowMenu(false)}
            />
            <Logo />
          </div>
          <MainNavigation />
          <UserSection />
        </div>
      ) : (
        <div className={'m-4'}>
          <Button variant={'outline'} onClick={() => setShowMenu(true)}>
            <Menu className={'h-4 w-4'} />
          </Button>
        </div>
      )}
    </div>
  );
};

export const Navigation = () => {
  const { width } = useWindow();

  const isMobile = width < 1000; // tablet and mobile

  return isMobile ? <MobileNavigation /> : <WebNavigation />;
};
