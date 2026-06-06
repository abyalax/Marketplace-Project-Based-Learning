import z from 'zod';

const roleIdsSchema = z.array(z.number()).min(1, 'Select at least one role');

export const userCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  roleIds: roleIdsSchema,
});

export const userUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().refine((value) => value.length === 0 || value.length >= 6, 'Password must be at least 6 characters').optional(),
  roleIds: roleIdsSchema,
});

export type FormDataUserCreate = z.infer<typeof userCreateSchema>;
export type FormDataUserUpdate = z.infer<typeof userUpdateSchema>;
export type FormDataUser = FormDataUserCreate | FormDataUserUpdate;
