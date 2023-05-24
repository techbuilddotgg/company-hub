import {AppRoute} from '@constants/app-routes';
import {getAuth, withClerkMiddleware} from '@clerk/nextjs/server';
import {NextRequest, NextResponse} from 'next/server';
import {Ratelimit} from '@upstash/ratelimit';
import {Redis} from '@upstash/redis';

// Create a new ratelimiter, that allows 10 requests per 1 minute
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
});

const publicPaths = [AppRoute.SIGN_IN, AppRoute.SIGN_UP];
const rateLimitedPaths = ['/api/openai/upload-data', '/api/openai/ask-model'];

const isPublic = (path: string) => {
    return publicPaths.find((x) =>
        path.match(new RegExp(`^${x}$`.replace('*$', '($|/|\\.)'))),
    );
};

const isRateLimited = (path: string) => {
    return rateLimitedPaths.find((x) =>
        path.match(new RegExp(`^${x}$`.replace('*$', '($|/|\\.)'))),
    );
};

export default withClerkMiddleware(async (request: NextRequest) => {
    if (isPublic(request.nextUrl.pathname)) {
        return NextResponse.next();
    }

    const {userId} = getAuth(request);

    if (!userId) {
        const redirect = new URL(AppRoute.SIGN_IN, request.url);
        return NextResponse.redirect(redirect);
    }

    if (isRateLimited(request.nextUrl.pathname)) {
        const {success} = await ratelimit.limit(userId);
        if (!success) {
            return NextResponse.json(
                {error: 'Rate limit exceeded'},
                {status: 429},
            );
        }
    }

    if (request.nextUrl.pathname === AppRoute.HOME) {
        const projects = new URL(AppRoute.PROJECTS, request.url);
        return NextResponse.redirect(projects);
    }

    return NextResponse.next();
});

// Stop Middleware running on static files
export const config = {
    matcher: [
        '/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico|api/github/.*).*)',
        '/',
    ],
};
