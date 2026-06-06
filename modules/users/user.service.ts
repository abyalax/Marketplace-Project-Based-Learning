import bcrypt from 'bcrypt';
import { ROLE } from '~/common/const/permission';
import { MetaRequest } from '~/common/types/meta';
import { Prisma } from '~/generated/prisma/client';
import { ConflictException, ForbiddenException, NotFoundException } from '~/lib/handler/error';
import { Service } from '../base/services';
import { UserRepository } from './user.repository';
import { UserListItem, UserPayload } from './users.type';

class UserService extends Service<UserRepository> {
  constructor() {
    super(new UserRepository());
  }
  _getRepository = () => this.repository;
  _getModel = () => this._getModel;

  paginateUsers(page: number, per_page: number) {
    return this.repository.paginate({
      page,
      per_page,
    });
  }

  listRoles() {
    return this.repository.listRoles();
  }

  async listVisibleUsers(params: MetaRequest<UserListItem>, actor: { id: number; roles: string[] }) {
    const where = this.getVisibleUsersWhere(actor);
    return this.repository.listUsers({
      page: params.page,
      per_page: params.per_page,
      search: params.search,
      sort_by: params.sort_by,
      sort_order: params.sort_order,
      where,
    });
  }

  findVisibleUser(id: number, actor: { id: number; roles: string[] }) {
    return this.repository.findUserDetail({
      id,
      ...this.getVisibleUsersWhere(actor),
    });
  }

  findByEmail(email: string) {
    return this.repository.findByEmail(email);
  }

  findUser(where: Prisma.UserWhereUniqueInput) {
    return this.repository.findWithRolesAndPermissions(where);
  }

  create(data: Prisma.UserCreateInput) {
    return this.repository.create(0, data);
  }

  async createManagedUser(payload: UserPayload) {
    await this.assertUniqueEmail(payload.email);
    const roleIds = await this.assertRoleIds(payload.roleIds);
    if (!payload.password) throw new ConflictException('Password is required');
    const password = await bcrypt.hash(payload.password, 10);
    return this.repository.createUser({ ...payload, roleIds, password });
  }

  async updateManagedUser(id: number, payload: UserPayload) {
    const current = await this.repository._getModel().findUnique({
      where: { id },
      select: { email: true },
    });
    if (!current) throw new NotFoundException('User not found');
    if (current.email !== payload.email) await this.assertUniqueEmail(payload.email);
    const roleIds = await this.assertRoleIds(payload.roleIds);
    const password = payload.password ? await bcrypt.hash(payload.password, 10) : undefined;
    return this.repository.updateUser(id, { ...payload, roleIds, password });
  }

  async deleteManagedUser(id: number, actorId: number) {
    if (id === actorId) throw new ForbiddenException('You cannot delete your own account');
    const existing = await this.repository._getModel().findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new NotFoundException('User not found');
    const hasBusinessRecords = await this.repository.hasBusinessRecords(id);
    if (hasBusinessRecords) {
      throw new ConflictException('User has related business records and cannot be hard deleted');
    }
    await this.repository.deleteUser(id);
    return { id };
  }

  private getVisibleUsersWhere(actor: { id: number; roles: string[] }): Prisma.UserWhereInput {
    if (actor.roles.includes(ROLE.ADMIN)) return {};

    if (actor.roles.includes(ROLE.MENTOR)) {
      return {
        user_roles: {
          some: {
            role: {
              name: ROLE.LEARNER,
            },
          },
        },
        OR: [
          {
            enrollments: {
              some: {
                class: {
                  mentor: {
                    userId: actor.id,
                  },
                },
              },
            },
          },
          {
            orders: {
              some: {
                status: 'PAID',
                class: {
                  mentor: {
                    userId: actor.id,
                  },
                },
              },
            },
          },
          {
            entitlements: {
              some: {
                class: {
                  mentor: {
                    userId: actor.id,
                  },
                },
              },
            },
          },
        ],
      };
    }

    return { id: -1 };
  }

  private async assertUniqueEmail(email: string) {
    const existing = await this.repository.findByEmail(email);
    if (existing) throw new ConflictException('Email already exists');
  }

  private async assertRoleIds(roleIds: number[]) {
    const uniqueRoleIds = [...new Set(roleIds)];
    if (uniqueRoleIds.length === 0) throw new ConflictException('At least one role is required');
    const roles = await this.repository.listRoles();
    const validIds = new Set(roles.map((role) => role.id));
    if (uniqueRoleIds.some((roleId) => !validIds.has(roleId))) throw new ConflictException('Invalid role selected');
    return uniqueRoleIds;
  }
}

export const userService = new UserService();
