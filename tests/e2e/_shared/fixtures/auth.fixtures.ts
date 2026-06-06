import { test as base, expect, type Page, type TestInfo } from '@playwright/test';

export const ROLES = ['learner', 'mentor', 'admin'] as const;

export type Role = (typeof ROLES)[number];

export type TestUser = {
  email: string;
  password: string;
};

export const TEST_USERS = {
  learner: {
    email: 'learner@gmail.com',
    password: 'learnerPassword1_',
  },
  mentor: {
    email: 'mentor.e2e@test.local',
    password: 'mentorPassword1_',
  },
  admin: {
    email: 'admin.e2e@test.local',
    password: 'adminPassword1_',
  },
} satisfies Record<Role, TestUser>;

type LoginAs = (role: Role) => Promise<void>;

type AuthFixtures = {
  loginAs: LoginAs;
};

async function loginWithRole(page: Page, role: Role): Promise<void> {
  const user = TEST_USERS[role];

  await page.goto('/login');

  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);

  await page
    .getByRole('button', {
      name: /login|sign in/i,
    })
    .click();

  await page.waitForURL(/dashboard|projects/);
}

export const test = base.extend<AuthFixtures>({
  loginAs: async ({ page }: { page: Page }, use: (fixture: LoginAs) => Promise<void>, _testInfo: TestInfo): Promise<void> => {
    await use(async (role: Role): Promise<void> => {
      await loginWithRole(page, role);
    });
  },
});

export { expect };
