import { expect, test } from '../_shared/fixtures/auth.fixtures';

test.describe('Project Discovery - Guest', () => {
  test('guest can browse free and premium projects', async ({ guestPage }) => {
    await guestPage.goto('/projects');

    await expect(guestPage.getByRole('heading', { name: /projects/i })).toBeVisible();

    await expect(guestPage.getByText(/free/i).first()).toBeVisible();

    await expect(guestPage.getByText(/premium/i).first()).toBeVisible();
  });

  test('guest can see premium preview but cannot access full premium content', async ({ guestPage }) => {
    await guestPage.goto('/projects');

    await guestPage
      .getByText(/premium/i)
      .first()
      .click();

    await expect(guestPage.getByText(/login|sign in|purchase|subscribe/i)).toBeVisible();
  });
});
