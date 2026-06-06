import { Metadata } from 'next';
import { PageScreen } from '~/components/layouts/page';
import { Component } from './_components';

export const metadata: Metadata = {
  title: 'Create User',
  description: 'Create a marketplace user and assign roles.',
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
    active: false,
  },
  {
    title: 'Create',
    url: '/users/create',
    active: true,
  },
];

export default function Page() {
  return (
    <PageScreen title="Create User" breadcrumbs={breadcrumbItems}>
      <Component />
    </PageScreen>
  );
}
