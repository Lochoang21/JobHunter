# Hướng Dẫn Áp Dụng Phân Quyền Cho Table Components

## Tổng Quan

Hướng dẫn này sẽ giúp bạn áp dụng phân quyền cho tất cả các table components trong admin panel.

## Các Bước Thực Hiện

### 1. Import Permission Hook

Thêm import vào đầu file:

```typescript
import { usePermissionGuard } from "@/hooks/usePermissionGuard";
// hoặc sử dụng utility function
import { useTablePermissions } from "@/utils/tablePermissionUtils";
```

### 2. Sử Dụng Hook Trong Component

```typescript
// Cách 1: Sử dụng usePermissionGuard trực tiếp
const { canCreate, canRead, canUpdate, canDelete } = usePermissionGuard();

// Cách 2: Sử dụng utility function
const { canCreate, getTableActions } = useTablePermissions('module_name');
```

### 3. Áp Dụng Cho Create Button

```typescript
// Thay thế
<Button color="primary" onClick={() => setIsCreateModalOpen(true)}>
  Create Item
</Button>

// Bằng
{canCreate('module_name') && (
  <Button color="primary" onClick={() => setIsCreateModalOpen(true)}>
    Create Item
  </Button>
)}
```

### 4. Áp Dụng Cho Table Actions

#### Cách 1: Sử dụng usePermissionGuard

```typescript
// Thay thế tableActionData cũ
const tableActionData = [
  {
    icon: "solar:eye-linear",
    listtitle: "View",
    onClick: (item) => { /* ... */ },
  },
  // ...
];

// Bằng function động
const getTableActions = (item) => {
  const actions = [];

  if (canRead('module_name')) {
    actions.push({
      icon: "solar:eye-linear",
      listtitle: "View",
      onClick: () => {
        setSelectedItem(item);
        setIsDrawerOpen(true);
      },
    });
  }

  if (canUpdate('module_name')) {
    actions.push({
      icon: "solar:pen-new-square-broken",
      listtitle: "Edit",
      onClick: () => {
        setSelectedItem(item);
        setIsUpdateModalOpen(true);
      },
    });
  }

  if (canDelete('module_name')) {
    actions.push({
      icon: "solar:trash-bin-minimalistic-outline",
      listtitle: "Delete",
      onClick: () => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
      },
    });
  }

  return actions;
};
```

#### Cách 2: Sử dụng useTablePermissions

```typescript
const { getTableActions } = useTablePermissions('module_name');

const tableActionHandlers = {
  view: (item) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  },
  edit: (item) => {
    setSelectedItem(item);
    setIsUpdateModalOpen(true);
  },
  delete: (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  },
};

// Trong render
const tableActions = getTableActions(item, tableActionHandlers);
```

### 5. Cập Nhật Table Row Rendering

```typescript
// Thay thế
{jobs.map((job) => (
  <Table.Row key={job.id}>
    {/* ... */}
    <Table.Cell>
      <div className="flex justify-center items-center">
        {tableActionData.map((item, index) => (
          <button
            key={index}
            onClick={() => item.onClick?.(job)}
            className="p-2 rounded-full hover:bg-lightprimary hover:text-primary transition-colors"
            title={item.listtitle}
          >
            <Icon icon={item.icon} height={18} />
          </button>
        ))}
      </div>
    </Table.Cell>
  </Table.Row>
))}

// Bằng
{jobs.map((job) => {
  const tableActions = getTableActions(job);
  return (
    <Table.Row key={job.id}>
      {/* ... */}
      <Table.Cell>
        <div className="flex justify-center items-center">
          {tableActions.length > 0 ? (
            tableActions.map((item, index) => (
              <button
                key={index}
                onClick={() => item.onClick()}
                className="p-2 rounded-full hover:bg-lightprimary hover:text-primary transition-colors"
                title={item.listtitle}
              >
                <Icon icon={item.icon} height={18} />
              </button>
            ))
          ) : (
            <span className="text-gray-400 text-sm">No actions available</span>
          )}
        </div>
      </Table.Cell>
    </Table.Row>
  );
})}
```

## Danh Sách Modules Cần Áp Dụng

| Module | File Path | Status |
|--------|-----------|--------|
| users | `src/app/components/users/UserTable.tsx` | ✅ Done |
| companies | `src/app/components/companies/CompanyTable.tsx` | ✅ Done |
| jobs | `src/app/components/jobs/JobTable.tsx` | ✅ Done |
| skills | `src/app/components/skills/SkillTable.tsx` | ⏳ Pending |
| resumes | `src/app/components/resume/ResumeTable.tsx` | ⏳ Pending |
| permissions | `src/app/components/permissions/PermissionTable.tsx` | ⏳ Pending |
| roles | `src/app/components/roles/RoleTable.tsx` | ⏳ Pending |

## Template Code Hoàn Chỉnh

```typescript
"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Spinner, Modal, Alert } from "flowbite-react";
import { Icon } from "@iconify/react";
import api from "@/services/api";
import { useTablePermissions } from "@/utils/tablePermissionUtils";

const ModuleTable: React.FC = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Permission guard hook
  const { canCreate, getTableActions } = useTablePermissions('module_name');

  // Table action handlers
  const tableActionHandlers = {
    view: (item) => {
      setSelectedItem(item);
      // Open view modal/drawer
    },
    edit: (item) => {
      setSelectedItem(item);
      setIsUpdateModalOpen(true);
    },
    delete: (item) => {
      setSelectedItem(item);
      setIsDeleteModalOpen(true);
    },
  };

  return (
    <div className="rounded-xl shadow-md bg-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h5 className="card-title">Module Name</h5>
        {canCreate() && (
          <Button color="primary" onClick={() => setIsCreateModalOpen(true)}>
            Create Item
          </Button>
        )}
      </div>

      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>ID</Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {items.map((item) => {
            const tableActions = getTableActions(item, tableActionHandlers);
            return (
              <Table.Row key={item.id}>
                <Table.Cell>{item.id}</Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>
                  <div className="flex justify-center items-center">
                    {tableActions.length > 0 ? (
                      tableActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => action.onClick()}
                          className="p-2 rounded-full hover:bg-lightprimary hover:text-primary transition-colors"
                          title={action.listtitle}
                        >
                          <Icon icon={action.icon} height={18} />
                        </button>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">No actions available</span>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>

      {/* Modals */}
      {/* Create Modal */}
      {/* Update Modal */}
      {/* Delete Modal */}
    </div>
  );
};

export default ModuleTable;
```

## Lưu Ý Quan Trọng

1. **Module Name**: Đảm bảo sử dụng đúng tên module (users, companies, jobs, skills, resumes, permissions, roles)
2. **Permission Mapping**: Mỗi module cần có permission tương ứng trong API
3. **Icon Consistency**: Sử dụng cùng icon cho các action tương tự
4. **Error Handling**: Xử lý lỗi khi không có quyền truy cập
5. **Loading States**: Hiển thị loading khi đang kiểm tra quyền

## Testing

Sau khi áp dụng, test với các user có quyền khác nhau:
- SUPER_ADMIN: Có tất cả quyền
- ADMIN: Có một số quyền
- Manage User: Chỉ có quyền quản lý users
- User thường: Không có quyền admin 