'use client';

import { FC, Suspense } from 'react';
import { FallBack } from '~/components/fragments/fallback';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { useCreateUser } from '../../_hooks/use-create-user';
import { useGetRoles } from '../../_hooks/use-get-roles';
import { FormUser } from '../../_components/form';
import { FormDataUserCreate } from '../../_components/form/schema';

const CreateUserForm = () => {
  const { data: roles } = useGetRoles();
  const createUser = useCreateUser();

  return (
    <FormUser
      mode="create"
      roles={roles}
      onSubmit={(data) => createUser.mutate(data as FormDataUserCreate)}
      isLoading={createUser.isPending}
    />
  );
};

export const Component: FC = () => {
  return (
    <div className="max-w-2xl">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Create a user and assign one or more marketplace roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<FallBack />}>
            <CreateUserForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};
