# Hệ Thống Phân Quyền - JobFinder

## Tổng Quan

Hệ thống phân quyền được xây dựng dựa trên Role-Based Access Control (RBAC) với các thành phần chính:

- **Roles**: Vai trò của người dùng (SUPER_ADMIN, ADMIN, Manage User, etc.)
- **Permissions**: Quyền cụ thể cho từng hành động (CREATE, READ, UPDATE, DELETE)
- **Modules**: Các module trong hệ thống (users, companies, jobs, etc.)

## Cấu Trúc API Response

Khi đăng nhập, API trả về thông tin user với role và permissions:

```json
{
  "user": {
    "id": 1,
    "email": "admin@gmail.com",
    "name": "David Loc",
    "role": {
      "id": 4,
      "name": "SUPER_ADMIN",
      "permissions": [
        {
          "id": 113,
          "name": "Create a user",
          "apiPath": "/api/v1/users",
          "method": "POST",
          "module": "USERS"
        }
      ]
    }
  }
}
```

## Các Hook và Components

### 1. usePermissionGuard Hook

Hook chính để kiểm tra quyền trong components:

```typescript
import { usePermissionGuard } from '@/hooks/usePermissionGuard';

const MyComponent = () => {
  const { 
    hasRole, 
    hasPermission, 
    canCreate, 
    canRead, 
    canUpdate, 
    canDelete,
    userRole,
    userPermissions 
  } = usePermissionGuard();

  // Kiểm tra role
  const isAdmin = hasRole('SUPER_ADMIN');
  
  // Kiểm tra permission cụ thể
  const canCreateUser = hasPermission('Create a user');
  
  // Kiểm tra quyền theo module
  const canManageUsers = canCreate('users') || canRead('users') || canUpdate('users') || canDelete('users');
};
```

### 2. PermissionGuard Component

Component wrapper để bảo vệ các phần tử UI:

```typescript
import { PermissionGuard } from '@/components/common/PermissionGuard';

// Bảo vệ theo role
<PermissionGuard role="SUPER_ADMIN">
  <AdminPanel />
</PermissionGuard>

// Bảo vệ theo permission
<PermissionGuard permission="Create a user">
  <CreateUserButton />
</PermissionGuard>

// Bảo vệ theo module và action
<PermissionGuard module="users" action="create">
  <CreateUserForm />
</PermissionGuard>

// Với fallback
<PermissionGuard 
  module="users" 
  action="read" 
  fallback={<div>Bạn không có quyền xem danh sách users</div>}
>
  <UserTable />
</PermissionGuard>
```

### 3. ActionButton Component

Component cho các nút hành động:

```typescript
import { ActionButton } from '@/components/common/PermissionGuard';

<ActionButton
  module="users"
  action="create"
  onClick={handleCreateUser}
  className="bg-blue-500 text-white px-4 py-2 rounded"
>
  Tạo User
</ActionButton>
```

### 4. TableAction Component

Component cho các hành động trong bảng:

```typescript
import { TableAction } from '@/components/common/PermissionGuard';

<TableAction
  module="users"
  action="update"
  onClick={() => handleEditUser(user.id)}
  className="bg-yellow-500 text-white px-2 py-1 rounded"
>
  Sửa
</TableAction>
```

## Middleware Protection

Middleware kiểm tra quyền truy cập route:

```typescript
// Định nghĩa quyền cho từng route
const ROUTE_PERMISSIONS = {
  '/admin/ui/user': { module: 'users', action: 'read' },
  '/admin/ui/company': { module: 'companies', action: 'read' },
  '/admin/ui/form': { role: 'SUPER_ADMIN' }
};

// SUPER_ADMIN có quyền truy cập tất cả
// Các role khác cần có permission cụ thể
```

## Cách Sử Dụng

### 1. Trong Component

```typescript
import { usePermissionGuard } from '@/hooks/usePermissionGuard';
import { PermissionGuard, ActionButton } from '@/components/common/PermissionGuard';

const UserManagement = () => {
  const { canCreate, canRead, canUpdate, canDelete } = usePermissionGuard();

  return (
    <div>
      <h1>Quản lý Users</h1>
      
      {/* Chỉ hiển thị nút tạo nếu có quyền */}
      <PermissionGuard module="users" action="create">
        <ActionButton
          module="users"
          action="create"
          onClick={handleCreate}
          className="btn btn-primary"
        >
          Tạo User
        </ActionButton>
      </PermissionGuard>

      {/* Bảng chỉ hiển thị nếu có quyền đọc */}
      <PermissionGuard 
        module="users" 
        action="read"
        fallback={<div>Bạn không có quyền xem danh sách users</div>}
      >
        <UserTable />
      </PermissionGuard>
    </div>
  );
};
```

### 2. Trong Menu/Sidebar

```typescript
// Sidebaritems.ts
const SidebarContent = [
  {
    heading: "UTILITIES",
    children: [
      {
        name: "User",
        icon: "solar:user-circle-linear",
        url: "/admin/ui/user",
        module: "users", // Kiểm tra quyền quản lý users
      },
      {
        name: "Form",
        icon: "solar:password-minimalistic-outline",
        url: "/admin/ui/form",
        role: "SUPER_ADMIN", // Chỉ SUPER_ADMIN mới thấy
      },
    ],
  },
];
```

### 3. Kiểm Tra Quyền Trong Logic

```typescript
const handleDeleteUser = (userId: number) => {
  if (!canDelete('users')) {
    alert('Bạn không có quyền xóa user');
    return;
  }
  
  // Thực hiện xóa user
  deleteUser(userId);
};
```

## Các Role và Permission Mặc Định

### SUPER_ADMIN
- Có tất cả quyền
- Truy cập được tất cả routes
- Không cần kiểm tra permission cụ thể

### ADMIN
- Quyền quản lý các module chính
- Cần có permission cụ thể cho từng action

### Manage User
- Quyền quản lý users
- Có thể tạo, sửa, xóa, xem users

## Debug và Troubleshooting

### 1. Kiểm Tra Cookies
```typescript
// Trong browser console
console.log(document.cookie);
```

### 2. Kiểm Tra User Data
```typescript
import { authService } from '@/services/auth.service';

console.log('User role:', authService.getUserRole());
console.log('User permissions:', authService.getUserPermissions());
console.log('Is authenticated:', authService.isAuthenticated());
```

### 3. Sử Dụng PermissionTest Component
Component này hiển thị tất cả thông tin về quyền hiện tại của user.

## Lưu Ý Quan Trọng

1. **SUPER_ADMIN** luôn có quyền truy cập tất cả
2. Cookie `user_data` chứa thông tin đầy đủ về user và permissions
3. Middleware kiểm tra quyền trước khi cho phép truy cập route
4. Components tự động ẩn/hiện dựa trên quyền của user
5. Luôn kiểm tra quyền ở cả frontend và backend

## Ví Dụ Thực Tế

Với user có role "Manage User" và permissions:
- Create a user
- Update a user  
- Delete a user
- Get a user by Id
- Get user with Pagination

User này sẽ:
- ✅ Thấy menu "User" trong sidebar
- ✅ Truy cập được `/admin/ui/user`
- ✅ Thấy nút "Create User"
- ✅ Thấy các nút "Edit", "Delete" trong bảng
- ❌ Không thấy menu "Form" (chỉ dành cho SUPER_ADMIN)
- ❌ Không truy cập được các module khác nếu không có permission 