import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value;
    const roleName = request.cookies.get('role_name')?.value;
    const path = request.nextUrl.pathname;

    console.log('Middleware check - path:', path);
    console.log('Middleware check - token exists:', !!token);
    console.log('Middleware check - role name:', roleName);

    // Check if path is public
    const isPublicPath = ['/auth/login', '/auth/register', '/', '/auth/forbidden', '/job', '/company'].some(
        publicPath => path === publicPath || path.startsWith(`${publicPath}/`)
    );

    // Check if path is admin route
    const isAdminPath = path === '/admin' || path.startsWith('/admin/');

    // If user is not authenticated and trying to access protected routes
    if (!token && !isPublicPath) {
        console.log('Redirecting: No token for protected route');
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // If user is authenticated but trying to access admin routes without SUPER_ADMIN role
    if (token && isAdminPath && !roleName) {
        console.log('Redirecting: Not SUPER_ADMIN trying to access admin route');
        return NextResponse.redirect(new URL('/auth/forbidden', request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};