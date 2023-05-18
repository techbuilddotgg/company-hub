import { AppRoute } from '@constants/app-routes';
import { getAuth, withClerkMiddleware } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const publicPaths = [AppRoute.SIGN_IN, AppRoute.SIGN_UP];

const isPublic = (path: string) => {
  return publicPaths.find((x) =>
    path.match(new RegExp(`^${x}$`.replace('*$', '($|/|\\.)'))),
  );
};

export default withClerkMiddleware((request: NextRequest) => {
  if (isPublic(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const { userId } = getAuth(request);

  if (!userId) {
    const redirect = new URL(AppRoute.SIGN_IN, request.url);
    return NextResponse.redirect(redirect);
  }
  return NextResponse.next();
});

// Stop Middleware running on static files
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
