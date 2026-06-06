'use client';

import { useSession } from 'next-auth/react';
import { FC, Suspense } from 'react';
import { ROLE } from '~/common/const/permission';
import { FallBack } from '~/components/fragments/fallback';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { useGetRoles } from '../../_hooks/use-get-roles';
import { useGetUser } from '../../_hooks/use-get-user';
import { useUpdateUser } from '../../_hooks/use-update-user';
import { FormUser } from '../../_components/form';
import { FormDataUserUpdate } from '../../_components/form/schema';

type Props = {
  userId: string;
};

const UserDetailForm: FC<Props> = ({ userId }) => {
  const { data: session } = useSession();
  const { data: roles } = useGetRoles();
  const { data: user } = useGetUser(userId);
  const updateUser = useUpdateUser(userId);
  const canManage = session?.user.roles?.some((role) => role.name === ROLE.ADMIN) ?? false;

  return (
    <FormUser
      mode="update"
      roles={roles}
      readOnly={!canManage}
      initialValues={{
        name: user.name,
        email: user.email,
        roleIds: user.roles.map((role) => role.id),
      }}
      onSubmit={(data) => updateUser.mutate(data as FormDataUserUpdate)}
      isLoading={updateUser.isPending}
    />
  );
};

export const Component: FC<Props> = ({ userId }) => {
  return (
    <div className="max-w-2xl">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Admins can update users. Mentors can view assigned learners only.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<FallBack />}>
            <UserDetailForm userId={userId} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};
