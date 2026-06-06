import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import { PERMISSIONS, ROLE } from '~/common/const/permission';
import { PrismaClient } from '~/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const permissionsData = [
  { key: PERMISSIONS.LEARNER.READ_PROJECT, name: 'Read Projects' },
  { key: PERMISSIONS.LEARNER.READ_CLASS, name: 'Read Classes' },
  { key: PERMISSIONS.LEARNER.READ_MESSAGES, name: 'Read Messages' },
  { key: PERMISSIONS.LEARNER.CREATE_ENROLLMENT, name: 'Create Enrollment' },
  { key: PERMISSIONS.LEARNER.READ_ENROLLMENT, name: 'Read Enrollment' },
  { key: PERMISSIONS.LEARNER.UPDATE_PROGRESS, name: 'Update Progress' },
  { key: PERMISSIONS.LEARNER.CREATE_BOOKMARK, name: 'Create Bookmark' },
  { key: PERMISSIONS.LEARNER.DELETE_BOOKMARK, name: 'Delete Bookmark' },
  { key: PERMISSIONS.LEARNER.CREATE_ORDER, name: 'Create Order' },
  { key: PERMISSIONS.LEARNER.READ_ORDER, name: 'Read Order' },
  { key: PERMISSIONS.LEARNER.READ_SUBSCRIPTION, name: 'Read Subscription' },
  { key: PERMISSIONS.MENTOR.CREATE_PROJECT, name: 'Create Projects' },
  { key: PERMISSIONS.MENTOR.READ_PROJECT, name: 'Read Projects' },
  { key: PERMISSIONS.MENTOR.UPDATE_PROJECT, name: 'Update Projects' },
  { key: PERMISSIONS.MENTOR.DELETE_PROJECT, name: 'Delete Projects' },
  { key: PERMISSIONS.MENTOR.PUBLISH_PROJECT, name: 'Publish Projects' },
  { key: PERMISSIONS.MENTOR.CREATE_CLASS, name: 'Create Classes' },
  { key: PERMISSIONS.MENTOR.READ_CLASS, name: 'Read Classes' },
  { key: PERMISSIONS.MENTOR.UPDATE_CLASS, name: 'Update Classes' },
  { key: PERMISSIONS.MENTOR.DELETE_CLASS, name: 'Delete Classes' },
  { key: PERMISSIONS.MENTOR.UPLOAD_ASSET, name: 'Upload Assets' },
  { key: PERMISSIONS.MENTOR.READ_ASSET, name: 'Read Assets' },
  { key: PERMISSIONS.MENTOR.DELETE_ASSET, name: 'Delete Assets' },
  { key: PERMISSIONS.MENTOR.READ_ENROLLMENT, name: 'Read Enrollments' },
  { key: PERMISSIONS.MENTOR.READ_REVENUE, name: 'Read Revenue' },
  { key: PERMISSIONS.MENTOR.READ_PAYOUT, name: 'Read Payouts' },
  { key: PERMISSIONS.ADMIN.MANAGE_USERS, name: 'Manage Users' },
  { key: PERMISSIONS.ADMIN.MANAGE_MENTORS, name: 'Manage Mentors' },
  { key: PERMISSIONS.ADMIN.MODERATE_PROJECTS, name: 'Moderate Projects' },
  { key: PERMISSIONS.ADMIN.MODERATE_CLASSES, name: 'Moderate Classes' },
  { key: PERMISSIONS.ADMIN.READ_TRAFFIC, name: 'Read Traffic Analytics' },
  { key: PERMISSIONS.ADMIN.READ_REVENUE, name: 'Read Revenue Analytics' },
  { key: PERMISSIONS.ADMIN.MANAGE_PAYMENTS, name: 'Manage Payments' },
  { key: PERMISSIONS.ADMIN.MANAGE_SUBSCRIPTIONS, name: 'Manage Subscriptions' },
  { key: PERMISSIONS.ADMIN.MANAGE_SETTINGS, name: 'Manage Settings' },
] as const;

const rolePermissionKeys = {
  [ROLE.LEARNER]: [
    PERMISSIONS.LEARNER.READ_PROJECT,
    PERMISSIONS.LEARNER.READ_CLASS,
    PERMISSIONS.LEARNER.READ_MESSAGES,
    PERMISSIONS.LEARNER.CREATE_ENROLLMENT,
    PERMISSIONS.LEARNER.READ_ENROLLMENT,
    PERMISSIONS.LEARNER.UPDATE_PROGRESS,
    PERMISSIONS.LEARNER.CREATE_BOOKMARK,
    PERMISSIONS.LEARNER.DELETE_BOOKMARK,
    PERMISSIONS.LEARNER.CREATE_ORDER,
    PERMISSIONS.LEARNER.READ_ORDER,
    PERMISSIONS.LEARNER.READ_SUBSCRIPTION,
  ],
  [ROLE.MENTOR]: [
    PERMISSIONS.LEARNER.READ_PROJECT,
    PERMISSIONS.LEARNER.READ_CLASS,
    PERMISSIONS.MENTOR.CREATE_PROJECT,
    PERMISSIONS.MENTOR.READ_PROJECT,
    PERMISSIONS.MENTOR.UPDATE_PROJECT,
    PERMISSIONS.MENTOR.DELETE_PROJECT,
    PERMISSIONS.MENTOR.PUBLISH_PROJECT,
    PERMISSIONS.MENTOR.CREATE_CLASS,
    PERMISSIONS.MENTOR.READ_CLASS,
    PERMISSIONS.MENTOR.UPDATE_CLASS,
    PERMISSIONS.MENTOR.DELETE_CLASS,
    PERMISSIONS.MENTOR.UPLOAD_ASSET,
    PERMISSIONS.MENTOR.READ_ASSET,
    PERMISSIONS.MENTOR.DELETE_ASSET,
    PERMISSIONS.MENTOR.READ_ENROLLMENT,
    PERMISSIONS.MENTOR.READ_REVENUE,
    PERMISSIONS.MENTOR.READ_PAYOUT,
  ],
  [ROLE.ADMIN]: permissionsData.map((permission) => permission.key),
} as const;

export async function userSeeder() {
  console.log('Seeding marketplace roles, permissions, users, and baseline data...');

  for (const roleName of Object.values(ROLE)) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }

  for (const permission of permissionsData) {
    await prisma.permissions.upsert({
      where: { key: permission.key },
      update: { name: permission.name },
      create: permission,
    });
  }

  const [roles, permissions] = await Promise.all([prisma.role.findMany(), prisma.permissions.findMany()]);
  const roleIds = Object.fromEntries(roles.map((role) => [role.name, role.id]));
  const permissionIds = Object.fromEntries(permissions.map((permission) => [permission.key, permission.id]));

  await prisma.rolePermissions.createMany({
    data: Object.entries(rolePermissionKeys).flatMap(([roleName, permissionKeys]) =>
      permissionKeys.map((permissionKey) => ({
        role_id: roleIds[roleName],
        permission_id: permissionIds[permissionKey],
      })),
    ),
    skipDuplicates: true,
  });

  const [learnerPass, mentorPass, adminPass] = await Promise.all([
    bcrypt.hash('learner_pass', 10),
    bcrypt.hash('mentor_pass', 10),
    bcrypt.hash('admin_pass', 10),
  ]);

  const learner = await prisma.user.upsert({
    where: { email: 'learner@gmail.com' },
    update: { name: 'Learner' },
    create: { name: 'Learner', email: 'learner@gmail.com', password: learnerPass },
  });
  const mentor = await prisma.user.upsert({
    where: { email: 'mentor@gmail.com' },
    update: { name: 'Mentor' },
    create: { name: 'Mentor', email: 'mentor@gmail.com', password: mentorPass },
  });
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: { name: 'Admin' },
    create: { name: 'Admin', email: 'admin@gmail.com', password: adminPass },
  });

  await prisma.userRoles.createMany({
    data: [
      { user_id: learner.id, role_id: roleIds[ROLE.LEARNER] },
      { user_id: mentor.id, role_id: roleIds[ROLE.MENTOR] },
      { user_id: admin.id, role_id: roleIds[ROLE.ADMIN] },
    ],
    skipDuplicates: true,
  });

  await prisma.mentorProfile.upsert({
    where: { userId: mentor.id },
    update: {
      headline: 'Project-based learning mentor',
      expertise: 'IoT, product prototyping, practical engineering',
    },
    create: {
      userId: mentor.id,
      headline: 'Project-based learning mentor',
      bio: 'Baseline mentor profile for Sprint 1 marketplace development.',
      expertise: 'IoT, product prototyping, practical engineering',
    },
  });

  await prisma.category.createMany({
    data: [
      { name: 'Internet of Things', slug: 'internet-of-things', description: 'Connected hardware and sensor projects.' },
      { name: 'Robotics', slug: 'robotics', description: 'Robotics, motion, and automation projects.' },
      { name: 'Web Development', slug: 'web-development', description: 'Practical software projects for the web.' },
    ],
    skipDuplicates: true,
  });

  await prisma.subscriptionPlan.createMany({
    data: [
      {
        name: 'Monthly Premium',
        slug: 'monthly-premium',
        description: 'Monthly access to premium learning content.',
        price: 99000,
        billingInterval: 'MONTHLY',
      },
      {
        name: 'Yearly Premium',
        slug: 'yearly-premium',
        description: 'Yearly access to premium learning content.',
        price: 999000,
        billingInterval: 'YEARLY',
      },
    ],
    skipDuplicates: true,
  });

  const existingPlatformRule = await prisma.revenueShareRule.findFirst({
    where: { scope: 'PLATFORM', mentorId: null, classId: null, isActive: true },
  });

  if (!existingPlatformRule) {
    await prisma.revenueShareRule.create({
      data: {
        scope: 'PLATFORM',
        mentorPercent: 70,
        platformPercent: 30,
      },
    });
  }

  console.log('Marketplace seed data created.');
}
