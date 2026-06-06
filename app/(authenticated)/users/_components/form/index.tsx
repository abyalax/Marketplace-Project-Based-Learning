'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { Role } from '~/modules/users/users.type';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { FormDataUser, FormDataUserCreate, FormDataUserUpdate, userCreateSchema, userUpdateSchema } from './schema';

type Props = {
  mode: 'create' | 'update';
  roles: Role[];
  initialValues?: Partial<FormDataUserUpdate>;
  onSubmit: (data: FormDataUser) => void;
  isLoading?: boolean;
  readOnly?: boolean;
};

export const FormUser: FC<Props> = ({ mode, roles, initialValues, onSubmit, isLoading = false, readOnly = false }) => {
  const form = useForm<FormDataUserCreate | FormDataUserUpdate>({
    resolver: zodResolver(mode === 'create' ? userCreateSchema : userUpdateSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      email: initialValues?.email ?? '',
      password: '',
      roleIds: initialValues?.roleIds ?? roles.filter((role) => role.name === 'Learner').map((role) => role.id),
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit({
      ...data,
      password: data.password?.trim() || undefined,
    } as FormDataUser);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter user name" disabled={readOnly || isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter email address" disabled={readOnly || isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!readOnly && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{mode === 'create' ? 'Password' : 'New Password'}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={mode === 'create' ? 'Enter password' : 'Leave blank to keep current password'}
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="roleIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Roles</FormLabel>
              <div className="grid gap-3 sm:grid-cols-3">
                {roles.map((role) => {
                  const checked = field.value?.includes(role.id);
                  return (
                    <label
                      key={role.id}
                      className="border-input flex items-center gap-3 rounded-md border px-3 py-2 text-sm"
                    >
                      <Checkbox
                        checked={checked}
                        disabled={readOnly || isLoading}
                        onCheckedChange={(value) => {
                          const current = field.value ?? [];
                          field.onChange(value ? [...current, role.id] : current.filter((roleId) => roleId !== role.id));
                        }}
                      />
                      {role.name}
                    </label>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {!readOnly && (
          <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
            {isLoading ? 'Processing...' : mode === 'create' ? 'Create User' : 'Update User'}
          </Button>
        )}
      </form>
    </Form>
  );
};
