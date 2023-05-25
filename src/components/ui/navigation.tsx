import React, { useMemo } from 'react';
import { AppRoute } from '@constants/app-routes';
import Link from 'next/link';
import { SignedIn, UserButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { cn } from '@utils/classNames';
import { Logo } from '@components/ui/logo';
import {
  CalendarDays,
  Database,
  FolderInput,
  Folders,
  Menu,
  Users2,
} from 'lucide-react';
import { trpc } from '@utils/trpc';
import { useWindow } from '../../hooks/useWindow';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet';
import { useNavigationStore } from '../../store/navigation-store';

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
        </div>
      </SignedIn>
    </div>
  );
};

interface NavigationSubItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}
interface NavigationItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  subItems?: NavigationSubItem[];
}

const MainNavigation = () => {
  const router = useRouter();

  const isActive = (href: string) => {
    return router.asPath === href;
  };
  const { data: projects } = trpc.project.get.useQuery();

  const navigationItems = useMemo(() => {
    return [
      {
        title: 'Projects',
        href: AppRoute.PROJECTS,
        icon: <Folders size={26} />,
        subItems: projects?.map((project) => ({
          title: project.name,
          href: `${AppRoute.PROJECTS}/${project.id}`,
          icon: <FolderInput />,
        })),
      },
      {
        title: 'Knowledge base',
        href: AppRoute.KNOWLEDGE_BASE,
        icon: <Database />,
      },
      {
        title: 'Calendar',
        href: AppRoute.CALENDAR,
        icon: <CalendarDays />,
      },
      {
        title: 'Employees',
        href: AppRoute.EMPLOYEES,
        icon: <Users2 />,
      },
    ] as NavigationItem[];
  }, [projects]);

  return (
    <nav className=" mt-4 flex w-full grow  flex-col gap-4">
      <ul className={'flex grow flex-col gap-4'}>
        {navigationItems.map((item) => (
          <div key={item.title} className="cursor-pointer">
            <li
              className={cn(
                'rounded p-2 text-gray-500',
                isActive(item.href) && 'bg-blue-100 text-blue-600',
                !isActive(item.href) &&
                  'text-gray-500 hover:bg-gray-100 hover:text-black',
              )}
            >
              <Link href={item.href}>
                <div className="flex items-center">
                  {item.icon}
                  <a
                    className={
                      'ml-2 rounded-md p-2 text-sm font-medium transition-colors'
                    }
                  >
                    {item.title}
                  </a>
                </div>
              </Link>
            </li>
            {item.subItems?.map((subItems) => (
              <li
                key={subItems.title}
                className={cn(
                  'ml-5 rounded p-2 text-gray-500',
                  isActive(`${subItems.href}`) && 'bg-blue-100 text-blue-600',
                  !isActive(`${subItems.href}`) &&
                    'text-gray-500 hover:bg-gray-100 hover:text-black',
                )}
              >
                <Link href={subItems.href} key={subItems.title}>
                  <div className="flex items-center">
                    {subItems.icon}
                    <a className="rounded-md p-2 pl-3 text-sm font-medium transition-colors">
                      {subItems.title}
                    </a>
                  </div>
                </Link>
              </li>
            ))}
          </div>
        ))}
      </ul>
    </nav>
  );
};

const MobileNavigation = () => {
  const isOpened = useNavigationStore((state) => state.isOpened);
  return (
    <Sheet open={isOpened}>
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
  const { isOpened, setIsOpened } = useNavigationStore();

  return (
    <div>
      {isOpened && (
        <div className=" flex h-full flex-col items-center border-r px-5">
          <div className={'my-4 flex flex-row items-center gap-1 pr-6 pt-4'}>
            <Menu
              className={'mr-3 cursor-pointer'}
              onClick={() => setIsOpened(false)}
            />
            <Logo />
          </div>
          <MainNavigation />
          <UserSection />
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
