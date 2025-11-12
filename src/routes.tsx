import { createBrowserRouter } from 'react-router-dom'

import { Categories } from './pages/app/categories'
import { Coupons } from './pages/app/coupons'
import { Dashboard } from './pages/app/dashboard'
import { Orders } from './pages/app/orders'
import { Products } from './pages/app/products'
import { Settings } from './pages/app/settings'
import { Upgrade } from './pages/app/upgrade'
import { SignIn } from './pages/auth/sign-in'
import { SignUp } from './pages/auth/sign-up'
import { WrongAccount } from './pages/auth/wrong-account'
import { AppLayout } from './pages/layouts/app'
import { AuthLayout } from './pages/layouts/auth'
import { NotFound } from './pages/not-found'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/orders',
        element: <Orders />,
      },
      {
        path: '/categories',
        element: <Categories />,
      },
      {
        path: '/products',
        element: <Products />,
      },
      {
        path: '/coupons',
        element: <Coupons />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      {
        path: '/upgrade',
        element: <Upgrade />,
      },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '/sign-in',
        element: <SignIn />,
      },
      {
        path: '/sign-up',
        element: <SignUp />,
      },
      {
        path: '/wrong-account',
        element: <WrongAccount />,
      },
    ],
  },
])
