import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Định nghĩa các route và quyền cần thiết
const ROUTE_PERMISSIONS: Record<string, { module?: string; action?: string; role?: string }> = {
    '/admin/ui/user': { module: 'users', action: 'read' },
    '/admin/ui/company': { module: 'companies', action: 'read' },
    '/admin/ui/job': { module: 'jobs', action: 'read' },
    '/admin/ui/skill': { module: 'skills', action: 'read' },
    '/admin/ui/resume': { module: 'resumes', action: 'read' },
    '/admin/ui/permission': { module: 'permissions', action: 'read' },
    '/admin/ui/role': { module: 'roles', action: 'read' },
    '/admin/ui/form': { role: 'SUPER_ADMIN' }
};

// Định nghĩa các role có quyền admin
const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'Manage User'];

export function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value;
    const roleName = request.cookies.get('role_name')?.value;
    const userData = request.cookies.get('user_data')?.value;
    const path = request.nextUrl.pathname;

    // Debug logs (có thể comment out trong production)
    // console.log('Middleware check - path:', path);
    // console.log('Middleware check - token exists:', !!token);
    // console.log('Middleware check - role name:', roleName);

    // Check if path is public
    const isPublicPath = ['/auth/login', '/auth/register', '/', '/auth/forbidden', '/job', '/company'].some(
        publicPath => path === publicPath || path.startsWith(`${publicPath}/`)
    );

    // Check if path is admin route
    const isAdminPath = path === '/admin' || path.startsWith('/admin/');

    // If user is not authenticated and trying to access protected routes
    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // If user is authenticated but trying to access admin routes
    if (token && isAdminPath) {
        // Kiểm tra role có quyền admin không
        if (!roleName || !ADMIN_ROLES.includes(roleName)) {
            return NextResponse.redirect(new URL('/auth/forbidden', request.url));
        }

        // SUPER_ADMIN có quyền truy cập tất cả
        if (roleName === 'SUPER_ADMIN') {
            return NextResponse.next();
        }

        // Kiểm tra quyền cụ thể cho từng route (chỉ cho các role khác)
        const routePermission = ROUTE_PERMISSIONS[path as keyof typeof ROUTE_PERMISSIONS];
        if (routePermission) {
            let hasPermission = false;

            if (routePermission.role) {
                // Kiểm tra role cụ thể
                hasPermission = roleName === routePermission.role;
            } else if (routePermission.module && userData) {
                // Kiểm tra permission theo module
                try {
                    const user = JSON.parse(userData);
                    const permissions = user.role?.permissions || [];
                    const requiredApiPath = `/api/v1/${routePermission.module.toLowerCase()}`;

                    hasPermission = permissions.some((permission: any) =>
                        permission.apiPath === requiredApiPath &&
                        permission.method === 'GET'
                    );
                } catch (error) {
                    hasPermission = false;
                }
            }

            if (!hasPermission) {
                return NextResponse.redirect(new URL('/admin/ui/auth_forbidden', request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images|public|.*\\.(?:jpg|jpeg|gif|png|svg|ico|css|js|woff|woff2|ttf|eot)).*)',
    ],
};