import { NextResponse } from 'next/server';
import { PERMISSIONS } from '~/common/const/permission';
import { safeHandler } from '~/lib/handler/safe-handler';
import { userService } from '~/modules/users/user.service';

export const permissions = [PERMISSIONS.USERS.READ];

export const GET = safeHandler(async () => {
  const data = await userService.listRoles();
  return NextResponse.json({ message: 'Success get roles', data });
}, [PERMISSIONS.USERS.READ]);
