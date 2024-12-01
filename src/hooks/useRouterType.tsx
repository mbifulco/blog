// not next/router here!
import { useRouter } from 'next/compat/router';

export const RouterType = {
  Pages: 'pages',
  App: 'app',
} as const;

export type RouterType = (typeof RouterType)[keyof typeof RouterType];

export function useRouterType(): RouterType {
  // it returns the router instance if it is rendered in the pages router
  // returns null if it is in the app router
  const router = useRouter();
  if (!router) return RouterType.App;
  return RouterType.Pages;
}
