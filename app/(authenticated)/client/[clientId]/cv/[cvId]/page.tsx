import { Metadata } from 'next';
import { PageScreen } from '~/components/layouts/page';

export const metadata: Metadata = {
  title: 'Legacy CV Reference',
};

export default function Page() {
  return (
    <PageScreen title="Legacy CV Reference" breadcrumbs={[]}>
      <p className="text-muted-foreground text-sm">CV detail pages are retired from the active marketplace product.</p>
    </PageScreen>
  );
}
