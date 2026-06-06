'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FC, Suspense } from 'react';
import { ROLE } from '~/common/const/permission';
import { FallBack } from '~/components/fragments/fallback';
import { Button } from '~/components/ui/button';
import { H1 } from '~/components/ui/typography';
import { UsersTable } from './users-table';

export const Component: FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const canManage = session?.user.roles?.some((role) => role.name === ROLE.ADMIN) ?? false;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <H1>Users</H1>
        {canManage && <Button onClick={() => router.push('/users/create')}>Create User</Button>}
      </div>
      <Suspense fallback={<FallBack />}>
        <UsersTable />
      </Suspense>
    </div>
  );
};
