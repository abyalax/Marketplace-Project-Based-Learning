import { prisma } from '~/db/prisma';
import { Prisma } from '~/generated/prisma/client';
import { Repository } from '../base/repositories';
import { UserMapper } from './users.map';
import { UserListItem, UserPayload } from './users.type';

const rolesInclude = {
  user_roles: {
    include: {
      role: true,
    },
  },
} satisfies Prisma.UserInclude;

const mapUserListItem = (user: Prisma.UserGetPayload<{ include: typeof rolesInclude }>): UserListItem => ({
  id: user.id,
  name: user.name,
  email: user.email,
  roles: user.user_roles.map((userRole) => ({
    id: userRole.role.id,
    name: userRole.role.name,
  })),
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export class UserRepository extends Repository<Prisma.UserDelegate, Prisma.UserWhereInput, Prisma.UserOrderByWithRelationInput> {
  constructor() {
    super(prisma.user);
  }

  _getModel() {
    return this.model;
  }

  findByEmail(email: string) {
    return this.model.findUnique({
      where: { email },
    });
  }

  async findWithRolesAndPermissions(where: Prisma.UserWhereUniqueInput) {
    const user = await prisma.user.findUniqueOrThrow({
      where,
      include: {
        user_roles: {
          include: {
            role: {
              include: {
                role_permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return UserMapper.toDTO(user);
  }

  async listUsers(options: {
    page: number;
    per_page: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    where?: Prisma.UserWhereInput;
  }) {
    const page = Number(options.page) || 1;
    const perPage = Number(options.per_page) || 10;
    const searchableWhere: Prisma.UserWhereInput | undefined = options.search
      ? {
          OR: [
            { name: { contains: options.search, mode: 'insensitive' } },
            { email: { contains: options.search, mode: 'insensitive' } },
            {
              user_roles: {
                some: {
                  role: {
                    name: { contains: options.search, mode: 'insensitive' },
                  },
                },
              },
            },
          ],
        }
      : undefined;

    const where: Prisma.UserWhereInput = {
      AND: [options.where, searchableWhere].filter(Boolean) as Prisma.UserWhereInput[],
    };

    const allowedSorts = new Set(['id', 'name', 'email', 'createdAt', 'updatedAt']);
    const sortBy = options.sort_by && allowedSorts.has(options.sort_by) ? options.sort_by : 'id';
    const sortOrder = options.sort_order === 'desc' ? 'desc' : 'asc';

    const [totalCount, users] = await prisma.$transaction([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        include: rolesInclude,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
    ]);

    return {
      items: users.map(mapUserListItem),
      meta: {
        page,
        per_page: perPage,
        total_count: totalCount,
        total_pages: Math.ceil(totalCount / perPage),
      },
    };
  }

  async listRoles() {
    return prisma.role.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findUserDetail(where: Prisma.UserWhereInput) {
    const user = await prisma.user.findFirstOrThrow({
      where,
      include: rolesInclude,
    });
    return mapUserListItem(user);
  }

  async createUser(data: Required<UserPayload>) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
          user_roles: {
            createMany: {
              data: data.roleIds.map((roleId) => ({ role_id: roleId })),
            },
          },
        },
        include: rolesInclude,
      });

      await this.syncMentorProfile(tx, user.id, data.roleIds);
      return mapUserListItem(user);
    });
  }

  async updateUser(id: number, data: UserPayload) {
    return prisma.$transaction(async (tx) => {
      await tx.userRoles.deleteMany({ where: { user_id: id } });
      const user = await tx.user.update({
        where: { id },
        data: {
          name: data.name,
          email: data.email,
          ...(data.password ? { password: data.password } : {}),
          user_roles: {
            createMany: {
              data: data.roleIds.map((roleId) => ({ role_id: roleId })),
            },
          },
        },
        include: rolesInclude,
      });

      await this.syncMentorProfile(tx, id, data.roleIds);
      return mapUserListItem(user);
    });
  }

  async hasBusinessRecords(id: number) {
    const mentorProfile = await prisma.mentorProfile.findUnique({
      where: { userId: id },
      select: { id: true },
    });

    const [
      authoredProjects,
      authoredClasses,
      mediaAssets,
      orders,
      payments,
      subscriptions,
      entitlements,
      enrollments,
      projectProgress,
      lessonProgress,
      bookmarks,
      visitors,
      trafficEvents,
      mentorProjects,
      mentorClasses,
      mentorPayouts,
    ] = await prisma.$transaction([
      prisma.project.count({ where: { authorId: id } }),
      prisma.learningClass.count({ where: { authorId: id } }),
      prisma.mediaAsset.count({ where: { ownerId: id } }),
      prisma.order.count({ where: { userId: id } }),
      prisma.payment.count({ where: { userId: id } }),
      prisma.subscription.count({ where: { userId: id } }),
      prisma.entitlement.count({ where: { userId: id } }),
      prisma.enrollment.count({ where: { userId: id } }),
      prisma.projectProgress.count({ where: { userId: id } }),
      prisma.lessonProgress.count({ where: { userId: id } }),
      prisma.bookmark.count({ where: { userId: id } }),
      prisma.visitor.count({ where: { userId: id } }),
      prisma.trafficEvent.count({ where: { userId: id } }),
      prisma.project.count({ where: { mentorId: mentorProfile?.id ?? -1 } }),
      prisma.learningClass.count({ where: { mentorId: mentorProfile?.id ?? -1 } }),
      prisma.mentorPayout.count({ where: { mentorId: mentorProfile?.id ?? -1 } }),
    ]);

    return [
      authoredProjects,
      authoredClasses,
      mediaAssets,
      orders,
      payments,
      subscriptions,
      entitlements,
      enrollments,
      projectProgress,
      lessonProgress,
      bookmarks,
      visitors,
      trafficEvents,
      mentorProjects,
      mentorClasses,
      mentorPayouts,
    ].some((count) => count > 0);
  }

  async deleteUser(id: number) {
    return prisma.user.delete({ where: { id } });
  }

  private async syncMentorProfile(
    tx: Prisma.TransactionClient,
    userId: number,
    roleIds: number[],
  ) {
    const mentorRole = await tx.role.findUnique({
      where: { name: 'Mentor' },
      select: { id: true },
    });

    if (!mentorRole) return;

    if (roleIds.includes(mentorRole.id)) {
      await tx.mentorProfile.upsert({
        where: { userId },
        update: { isActive: true },
        create: { userId, isActive: true },
      });
      return;
    }

    await tx.mentorProfile.updateMany({
      where: { userId },
      data: { isActive: false },
    });
  }
}
