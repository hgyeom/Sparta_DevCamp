'use client';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { userSchema } from '@/validators/user/userSchema';

export default function Signup() {
  type UserSchema = z.infer<typeof userSchema>;

  const [stage, setStage] = useState(0);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = form.watch('password');
  const confirmPassword = form.watch('confirmPassword');

  useEffect(() => {
    const checkPasswordMatch = async () => {
      if (password !== '' && password === confirmPassword) {
        form.trigger(['confirmPassword', 'password']);
      }
    };

    checkPasswordMatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, confirmPassword]);

  const onClickNextButton = async () => {
    setIsEmailValid(await form.trigger('email'));
    if (isEmailValid) setStage(1);
  };

  const onSubmit = async (data: UserSchema) => {
    await form.trigger(['password', 'confirmPassword']);

    if (data.password === data.confirmPassword) {
      alert(JSON.stringify(data, null, 4));
    }
  };

  return (
    <main className="flex justify-center items-center h-screen">
      <Card className="w-[380px] ">
        <CardHeader>
          <CardTitle>계정을 생성합니다.</CardTitle>
          <CardDescription>
            {stage === 0 ? (
              <>
                로그인에 사용할 <b>아이디</b>를 입력해주세요.
              </>
            ) : (
              <>
                로그인에 사용할 <b>비밀번호</b>를 입력해주세요.
              </>
            )}
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative space-y-3 overflow-x-hidden"
          >
            <CardContent
              style={{
                height: stage !== 0 ? '250px' : '120px',
                transition: 'height 0.5s ease-in-out',
              }}
            >
              <div
                className="space-y-3 transition-transform duration-500 ease-in-out"
                style={
                  stage == 0
                    ? { transform: 'translateX(0%) ' }
                    : { transform: 'translateX(-120%)' }
                }
              >
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
                          onChange={async (e: ChangeEvent) => {
                            field.onChange(e);
                            setIsEmailValid(await form.trigger('email'));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 비밀번호 영역 */}
              <div
                className="space-y-3 absolute top-0 left-6 right-6 transition-transform duration-500 ease-in-out "
                style={
                  stage == 0
                    ? { transform: 'translateX(120%)' }
                    : {
                        transform: 'translateX(0%)',
                      }
                }
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>비밀번호</FormLabel>
                      <FormControl>
                        <Input
                          type={'password'}
                          {...field}
                          onChange={(e: ChangeEvent) => {
                            field.onChange(e);
                            form.trigger('password');
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>비밀번호 확인</FormLabel>
                      <FormControl>
                        <Input
                          type={'password'}
                          {...field}
                          onChange={(e: ChangeEvent) => {
                            field.onChange(e);
                            form.trigger('confirmPassword');
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="button"
                variant={isEmailValid === false ? 'secondary' : 'default'}
                className={cn({ hidden: stage === 1 })}
                onClick={onClickNextButton}
              >
                다음 단계로
              </Button>
              <div className={`flex gap-2  ${cn({ hidden: stage === 0 })}`}>
                <Button
                  type="submit"
                  variant={
                    password !== confirmPassword ||
                    password === '' ||
                    confirmPassword === ''
                      ? 'secondary'
                      : 'default'
                  }
                >
                  계정등록하기
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStage(0)}
                >
                  이전 단계로
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </main>
  );
}
