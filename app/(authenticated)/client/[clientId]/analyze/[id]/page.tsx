import { Metadata } from 'next';
import { PageScreen } from '~/components/layouts/page';

export const metadata: Metadata = {
  title: 'Legacy CV Analyze Reference',
};

export default function Page() {
  return (
    <PageScreen title="Legacy CV Analyze Reference" breadcrumbs={[]}>
      <p className="text-muted-foreground text-sm">The CV analysis detail flow is retained only as a boilerplate reference.</p>
    </PageScreen>
  );
}
