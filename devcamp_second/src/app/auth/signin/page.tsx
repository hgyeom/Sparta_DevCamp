import { ClientSafeProvider, getProviders } from 'next-auth/react';
import SigninForm from '@/components/signinForm';

export default async function SignInPage() {
  const providers = (await getProviders()) as Record<
    string,
    ClientSafeProvider
  >;

  return <SigninForm providers={providers} />;
}
