export const navigationClient = (clientId: string) => [
  { name: 'Login', href: `/${clientId}/auth/login` },
  { name: 'Register', href: `/${clientId}/auth/register` },
];

export const navigationAdmin = [
  { name: 'Home', href: '/backoffice' },
  { name: 'Users', href: '/backoffice/clients' },
  { name: 'Create User', href: '/clients/create' },
];

export const navigationGuest = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Mentors', href: '/mentors' },
  { name: 'Order', href: '/order' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Live Learning', href: '/live-learning' },

  /**Just For Development */
  { name: 'Learner', href: '/1' },
  { name: 'Admin', href: '/backoffice' },
];
