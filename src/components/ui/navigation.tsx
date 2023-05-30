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
import { useNavigationStore } from '../../store/navigation-store';
import { useWindow } from '../../hooks/useWindow';
import SettingsDialog from '@components/ui/settings-dialog';

const UserSection = () => {
  const user = useUser();
  return (
    <div className={'flex w-full flex-row'}>
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
                  'ml-5 mt-4 rounded p-2 text-gray-500',
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

export const Navigation = () => {
  const { isOpened, setIsOpened } = useNavigationStore();
  const { data: company } = trpc.company.get.useQuery();
  const size = useWindow();
  const user = useUser();

  if (!size) return null;

  return (
    <>
      <div
        className={`absolute ${
          isOpened ? 'left-0' : '-left-[300px]'
        } z-20 flex h-full w-[300px] flex-col items-center  border-r bg-white px-5 transition-[left]`}
      >
        <div
          className={`grid w-full grid-cols-[50px_1fr] items-center justify-center ${
            company?.logo ? 'pt-5' : 'pt-7'
          }`}
        >
          <Menu
            className={'mr-3 cursor-pointer justify-self-center'}
            onClick={() => setIsOpened(false)}
          />
          <Logo />
        </div>
        <MainNavigation />
        <div className="mb-6 flex w-full flex-row items-center justify-between">
          <>
            <UserSection />
            {user.user?.publicMetadata?.isAdmin && <SettingsDialog />}
          </>
        </div>
      </div>
      <div
        className={`${
          isOpened ? 'block' : 'hidden'
        } absolute  z-10 h-full w-full bg-background/80 backdrop-blur-sm transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in lg:hidden`}
      />
    </>
  );
};
