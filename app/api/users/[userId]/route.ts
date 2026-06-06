import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';
import { env } from '~/common/const/credential';
import { PERMISSIONS } from '~/common/const/permission';
import { ZodBadRequestException } from '~/lib/handler/error';
import { safeHandler } from '~/lib/handler/safe-handler';
import { userService } from '~/modules/users/user.service';

type Params = {
  userId: string;
};

const userPayloadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  roleIds: z.array(z.coerce.number().int().positive()).min(1, 'Select at least one role'),
});

const getActor = async (req: NextRequest) => {
  const token = await getToken({ req, secret: env.JWT_SECRET });
  return {
    id: Number(token?.id),
    roles: token?.roles?.map((role) => role.name) ?? [],
  };
};

export const GET = safeHandler<Params>(async (req, { params }) => {
  const { userId } = await params;
  const data = await userService.findVisibleUser(Number(userId), await getActor(req));
  return NextResponse.json({ message: 'Success get user', data });
}, [PERMISSIONS.USERS.READ]);

export const PUT = safeHandler<Params>(async (req, { params }) => {
  const { userId } = await params;
  const parsed = userPayloadSchema.safeParse(await req.json());
  if (!parsed.success) throw new ZodBadRequestException(parsed.error);

  const data = await userService.updateManagedUser(Number(userId), {
    ...parsed.data,
    password: parsed.data.password || undefined,
  });
  return NextResponse.json({ message: 'User updated successfully', data });
}, [PERMISSIONS.USERS.UPDATE]);

export const DELETE = safeHandler<Params>(async (req, { params }) => {
  const { userId } = await params;
  const data = await userService.deleteManagedUser(Number(userId), (await getActor(req)).id);
  return NextResponse.json({ message: 'User deleted successfully', data });
}, [PERMISSIONS.USERS.DELETE]);
