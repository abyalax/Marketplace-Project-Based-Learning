import { Metadata } from 'next';
import { PageScreen } from '~/components/layouts/page';
import { Component } from './_components';

export const metadata: Metadata = {
  title: 'User Detail',
  description: 'View or update marketplace user information.',
};

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ userId: string }>;
};

const breadcrumbItems = (userId: string) => [
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
    title: 'Detail',
    url: `/users/${userId}`,
    active: true,
  },
];

export default async function Page({ params }: Props) {
  const { userId } = await params;

  return (
    <PageScreen title="User Detail" breadcrumbs={breadcrumbItems(userId)}>
      <Component userId={userId} />
    </PageScreen>
  );
}
