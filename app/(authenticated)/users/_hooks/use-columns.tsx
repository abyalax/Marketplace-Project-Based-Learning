import { createColumnHelper } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { UserListItem } from '~/modules/users/users.type';

const columnHelper = createColumnHelper<UserListItem>();
export type TUserColumn = keyof UserListItem | 'select' | 'action' | 'roles';

type Params = {
  defaultVisible: TUserColumn[];
  canManage: boolean;
  onDelete: (user: UserListItem) => void;
};

export const useColumns = ({ defaultVisible, canManage, onDelete }: Params) => {
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected() ? true : table.getIsSomeRowsSelected() ? 'indeterminate' : false}
            onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
            onClick={(event) => event.stopPropagation()}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            onClick={(event) => event.stopPropagation()}
            aria-label="Select row"
          />
        ),
      }),
      columnHelper.accessor('id', {
        id: 'id',
        header: 'ID',
      }),
      columnHelper.accessor('name', {
        id: 'name',
        header: 'Name',
      }),
      columnHelper.accessor('email', {
        id: 'email',
        header: 'Email',
      }),
      columnHelper.display({
        id: 'roles',
        header: 'Roles',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.roles.map((role) => (
              <Badge key={role.id} variant="secondary">
                {role.name}
              </Badge>
            ))}
          </div>
        ),
      }),
      columnHelper.display({
        id: 'action',
        header: 'Action',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button asChild size="icon" variant="ghost" onClick={(event) => event.stopPropagation()}>
              <Link href={`/users/${row.original.id}`}>
                <Pencil className="size-4" />
              </Link>
            </Button>
            {canManage && (
              <Button
                size="icon"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(row.original);
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        ),
      }),
    ],
    [canManage, onDelete],
  );

  const columnIds = useMemo(() => columns.map((column) => column.id), [columns]);

  const initialColumnVisibility = useMemo(() => {
    return columnIds.reduce(
      (acc, value) => {
        acc[value as TUserColumn] = defaultVisible.includes(value as TUserColumn);
        return acc;
      },
      {} as Record<TUserColumn, boolean>,
    );
  }, [columnIds, defaultVisible]);

  return { columns, initialColumnVisibility, columnIds };
};
