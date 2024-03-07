'use client';

import { ClientSafeProvider, signIn, useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

type IProps = {
  providers: Record<string, ClientSafeProvider>;
};

interface FormValue {
  email: string;
  password: string;
}

export default function SigninForm({ providers }: IProps) {
  const router = useRouter();
  const { data: session } = useSession();

  if (session) {
    router.push('/');
  }

  const onSubmit = async (data: any) => {
    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: '/',
    }).then((result) => {
      if (result!.error) {
        alert('이메일 또는 비밀번호가 다릅니다.');
        return;
      }
      router.push('/');
    });
  };

  const form = useForm<FormValue>();
  return (
    <main className="flex justify-center items-center h-screen">
      <Card className="w-[380px] ">
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>소셜로그인</CardDescription>
          <div>
            {Object.values(providers).map(
              (provider) =>
                provider.name !== 'Credentials' && (
                  <div key={provider.name} className="m-4 ">
                    <Button onClick={() => signIn(provider.id)}>
                      {provider.name}
                    </Button>
                  </div>
                )
            )}
          </div>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative space-y-3 overflow-x-hidden"
          >
            <CardContent>
              <div className="space-y-3 ">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이메일</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="hello@sparta-devcamp.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>비밀번호</FormLabel>
                      <FormControl>
                        <Input
                          type={'password'}
                          placeholder="비밀번호"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit">로그인</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </main>
  );
}
