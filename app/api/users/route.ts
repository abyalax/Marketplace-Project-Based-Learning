import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import z from 'zod';
import { env } from '~/common/const/credential';
import { PERMISSIONS } from '~/common/const/permission';
import { metaRequestSchema } from '~/common/types/meta';
import { ZodBadRequestException } from '~/lib/handler/error';
import { safeHandler } from '~/lib/handler/safe-handler';
import { userService } from '~/modules/users/user.service';

export const permissions = [PERMISSIONS.USERS.READ];

const userPayloadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  roleIds: z.array(z.coerce.number().int().positive()).min(1, 'Select at least one role'),
});

const getActor = async (req: NextRequest) => {
  const token = await getToken({ req, secret: env.JWT_SECRET });
  return {
    id: Number(token?.id),
    roles: token?.roles?.map((role) => role.name) ?? [],
  };
};

export const GET = safeHandler(
  async (req: NextRequest) => {
    const parsed = metaRequestSchema.safeParse(Object.fromEntries(req.nextUrl.searchParams.entries()));
    if (!parsed.success) throw new ZodBadRequestException(parsed.error);

    const data = await userService.listVisibleUsers(parsed.data, await getActor(req));
    return NextResponse.json({ message: 'Success get users', data });
  },
  [PERMISSIONS.USERS.READ],
);

export const POST = safeHandler(
  async (req: NextRequest) => {
    const parsed = userPayloadSchema.safeParse(await req.json());
    if (!parsed.success) throw new ZodBadRequestException(parsed.error);

    const data = await userService.createManagedUser(parsed.data);
    return NextResponse.json({ message: 'User created successfully', data }, { status: 201 });
  },
  [PERMISSIONS.USERS.CREATE],
);
