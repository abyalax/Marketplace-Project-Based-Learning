import { Metadata } from 'next';
import { PageScreen } from '~/components/layouts/page';
import { Component } from './_components';

export const metadata: Metadata = {
  title: 'Users',
  description: 'Manage marketplace users and roles.',
};

export const dynamic = 'force-dynamic';

const breadcrumbItems = [
  {
    title: 'Home',
    url: '/',
    active: false,
  },
  {
    title: 'Users',
    url: '/users',
    active: true,
  },
];

export default function Page() {
  return (
    <PageScreen title="Users" breadcrumbs={breadcrumbItems}>
      <Component />
    </PageScreen>
  );
}
