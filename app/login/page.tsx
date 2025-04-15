import { LoginForm } from '@/components/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Anmelden | EmployCD',
  description: 'Melden Sie sich an, um auf EmployCD zuzugreifen',
};

export default function LoginPage() {
  return <LoginForm />;
} 