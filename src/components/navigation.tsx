import React, { RefObject, useEffect } from 'react';
import { AppRoute } from '@constants/app-routes';
import Link from 'next/link';
import { SignInButton, SignedOut, SignedIn, UserButton } from '@clerk/nextjs';
import { Button } from '@components/button';
import { useRouter } from 'next/router';

const links: { name: string; href: AppRoute }[] = [
  { name: 'Overview', href: AppRoute.HOME },
  { name: 'Projects', href: AppRoute.PROJECTS },
  { name: 'Knowledge base', href: AppRoute.KNOWLEDGE_BASE },
  { name: 'Calendar', href: AppRoute.CALENDAR },
];

const Navigation = () => {
  const router = useRouter();
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (router.query?.['open_modal'] && ref.current) {
      ref.current.click();
    }
  }, [ref, router.query]);

  return (
    <div>
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          {/* Logo or Choose Organization */}
          {/*<button*/}
          {/*  className="inline-flex h-9 w-[200px] items-center justify-between rounded-md px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"*/}
          {/*  role="combobox"*/}
          {/*  aria-expanded="false"*/}
          {/*  aria-label="Select a team"*/}
          {/*  type="button"*/}
          {/*  aria-haspopup="dialog"*/}
          {/*  aria-controls="radix-:Rqpmmmr9hja:"*/}
          {/*  data-state="closed"*/}
          {/*>*/}
          {/*  <span className="relative mr-2 flex h-5 w-5 shrink-0 overflow-hidden rounded-full">*/}
          {/*    <img*/}
          {/*      className="aspect-square h-full w-full"*/}
          {/*      alt="Alicia Koch"*/}
          {/*      src="https://avatar.vercel.sh/personal.png"*/}
          {/*    />*/}
          {/*  </span>*/}
          {/*  Alicia Koch*/}
          {/*  <svg*/}
          {/*    xmlns="http://www.w3.org/2000/svg"*/}
          {/*    width="24"*/}
          {/*    height="24"*/}
          {/*    viewBox="0 0 24 24"*/}
          {/*    fill="none"*/}
          {/*    stroke="currentColor"*/}
          {/*    strokeWidth="2"*/}
          {/*    strokeLinecap="round"*/}
          {/*    strokeLinejoin="round"*/}
          {/*    className="ml-auto h-4 w-4 shrink-0 opacity-50"*/}
          {/*  >*/}
          {/*    <path d="m7 15 5 5 5-5"></path>*/}
          {/*    <path d="m7 9 5-5 5 5"></path>*/}
          {/*  </svg>*/}
          {/*</button>*/}
          <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
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

          <div className="ml-auto flex items-center space-x-4">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode={'redirect'}>
                <Button
                  variant={'default'}
                  ref={ref as unknown as RefObject<HTMLButtonElement>}
                >
                  Sign in
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
