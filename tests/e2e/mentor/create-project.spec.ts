import { expect, test } from '../_shared/fixtures/auth.fixtures';

test.describe('Mentor Project Management', () => {
  test('mentor can create draft project', async ({ page, loginAs }) => {
    await loginAs('mentor');

    await page.goto('/mentor/projects/new');

    await page.getByLabel('Title').fill('E2E Arduino Starter Project');
    await page.getByLabel('Description').fill('Project created from E2E test.');
    await page.getByLabel('Objectives').fill('Learn basic project-based workflow.');

    await page.getByRole('button', { name: /save draft/i }).click();

    await expect(page.getByText(/draft saved|project created/i)).toBeVisible();
  });
});
