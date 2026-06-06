'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';
import { ROLE } from '~/common/const/permission';
import { metaRequestSchema } from '~/common/types/meta';
import { ConfirmDialog } from '~/components/fragments/confim/confirm-dialog';
import { Table } from '~/components/fragments/table';
import { useSearch } from '~/components/hooks/use-search';
import { UserListItem } from '~/modules/users/users.type';
import { useColumns } from '../_hooks/use-columns';
import { useDeleteUser } from '../_hooks/use-delete-user';
import { useGetUsers } from '../_hooks/use-get-users';

export const UsersTable = () => {
  const router = useRouter();
  const search = useSearch(metaRequestSchema);
  const { data: session } = useSession();
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const deleteUser = useDeleteUser();
  const canManage = session?.user.roles?.some((role) => role.name === ROLE.ADMIN) ?? false;
  const { data } = useGetUsers(search);

  const handleDelete = useCallback((user: UserListItem) => {
    setSelectedUser(user);
  }, []);

  const { columns, columnIds, initialColumnVisibility } = useColumns({
    defaultVisible: ['select', 'id', 'name', 'email', 'roles', 'action'],
    canManage,
    onDelete: handleDelete,
  });

  return (
    <>
      <Table
        engineSide="server_side"
        data={data}
        columns={columns}
        columnIds={columnIds as string[]}
        onClickRow={(user) => router.push(`/users/${user.id}`)}
        initialColumnVisibility={initialColumnVisibility}
      />
      <ConfirmDialog
        open={selectedUser !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedUser(null);
        }}
        title="Delete User"
        desc={`Delete ${selectedUser?.name ?? 'this user'}? This only succeeds when the user has no related business records.`}
        destructive
        isLoading={deleteUser.isPending}
        handleConfirm={() => {
          if (!selectedUser) return;
          deleteUser.mutate(selectedUser.id.toString(), {
            onSuccess: () => setSelectedUser(null),
          });
        }}
      />
    </>
  );
};
