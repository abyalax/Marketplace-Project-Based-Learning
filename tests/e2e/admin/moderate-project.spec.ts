import { expect, test } from '../_shared/fixtures/auth.fixtures';

test.describe('Admin Project Moderation', () => {
  test('admin can view project moderation queue', async ({ page, loginAs }) => {
    await loginAs('admin');

    await page.goto('/admin/projects');

    await expect(page.getByRole('heading', { name: /projects/i })).toBeVisible();

    await expect(page.getByText(/published|draft|pending/i).first()).toBeVisible();
  });
});
