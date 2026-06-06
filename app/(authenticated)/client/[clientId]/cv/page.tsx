import { Metadata } from 'next';
import { PageScreen } from '~/components/layouts/page';

export const metadata: Metadata = {
  title: 'Legacy CV Reference',
};

export default function Page() {
  return (
    <PageScreen title="Legacy CV Reference" breadcrumbs={[]}>
      <p className="text-muted-foreground text-sm">
        This boilerplate CV feature is retired from the active product. Its source remains as a reference pattern while Sprint 1
        defines the marketplace schema foundation.
      </p>
    </PageScreen>
  );
}
