'use client';

import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/utils';

import { registerSchema } from '@/api/users/schema';

import Image from 'next/image';
import Arrow from '/public/arrow.svg';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export default function Home() {
  type RegisterSchema = z.infer<typeof registerSchema>;

  const { toast } = useToast();

  const [stage, setStage] = useState(0);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    // defaultValues를 넣지 않으면 오류 메시지가 Requierd로 나온다.
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onClickNextButton = async () => {
    // 유효성 검사 실행 > schema.ts
    // 24.03.04 > trigger를 이용해 유효성 검사를 한다.
    // form.trigger(['name', 'email', 'phone', 'role']);

    // getValues는 값을 가져온다. 입력 필드를 수정하여 오류를 뱉어야 하는 상황에 setStage가 발동하는 이유를 찾기 위해 사용.
    // 바로 위의 상황만이 아닌 입력 필드를 수정하여 다음 단계로를 눌렀을 때 넘어가야 하는 상황에서도 넘어가지 않는다. getValues로는 데이터는 정상적으로 보임. 배치 업데이트 때문인가?
    // 예시 사이트에서도 위 오류는 마찬가지였다. 우선 넘어가자. 다음에 오류 수정해보기. >> 성공?
    // console.log(form.getValues('name'));

    // getFieldState는 field의 state를 가져온다.
    // const nameState = form.getFieldState('name');
    // const emailState = form.getFieldState('email');
    // const phoneState = form.getFieldState('phone');
    // const roleState = form.getFieldState('role');

    // 아무것도 입력하지 않은 상태에서 다음 단계로를 눌렀을 때 setStep이 발동한다. 이유를 찾아보자.
    // 이유는 잘 모르겠다. 일단 변경을 감지하는 isDirty를 찾았기 때문에 이걸 사용해서 막아두자.
    // if (!nameState.isDirty || nameState.invalid) return;
    // if (!emailState.isDirty || emailState.invalid) return;
    // if (!phoneState.isDirty || phoneState.invalid) return;
    // if (!roleState.isDirty || roleState.invalid) return;

    // 다음 단계로
    // setStage(1);

    // 24.03.05 >  ----------------------
    // 새로고침 후 필드 하나의 입력이 잘못되어도(vincalid가 false여도) 다음단계로 넘어가는 상황을 막기 위해 async await을 사용. 66번 줄부터의 문제를 해결한 듯하다.

    // const test = form.trigger(['name', 'email', 'phone', 'role']);
    // console.log(test); // promise

    // isDirty가 필요할까?? 2중으로 검사하는게 아니라면 필요하지 않을 것 같다.
    // isValid를 검사하기 전에 사용한다면.. 필요하려나? 서버 통신을 줄일 수 있을 것 같다.
    // 생각해보니 isDirty도 서버와 통신한다. 필요없을듯.
    const isValid = await form.trigger(['name', 'email', 'phone', 'role']);
    if (isValid) setStage(1);
  };

  function onSubmit(data: RegisterSchema) {
    const { password, confirmPassword } = data;
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: '비밀번호가 일치하지 않습니다.',
        duration: 950,
      });
      return;
    }
    alert(JSON.stringify(data, null, 4)); // 보기 쉽게.
  }

  // const handle
  return (
    <main className="flex justify-center items-center h-screen">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle>계정을 생성합니다.</CardTitle>
          <CardDescription>필수 정보를 입력해볼게요.</CardDescription>
        </CardHeader>
        <Form {...form /* form 객체 전달 */}>
          <form
            onSubmit={form.handleSubmit(onSubmit) /* submit > onSubmit 발동 */}
            className="relative space-y-3 overflow-x-hidden"
          >
            <CardContent>
              <div
                className="space-y-3 transition-transform duration-300 ease-in-out"
                style={
                  stage == 0
                    ? { transform: 'translateX(0%) ' }
                    : { transform: 'translateX(-120%)' }
                }
              >
                <FormField
                  control={form.control /* useForm 훅 사용 */}
                  name="name" // 식별자
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름</FormLabel>
                      <FormControl>
                        <Input placeholder="홍길동" {...field} />
                      </FormControl>
                      {/* 메시지 표시 */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>연락처</FormLabel>
                      <FormControl>
                        <Input placeholder="01000000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>역할</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="역할을 선택해주세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">관리자</SelectItem>
                          <SelectItem value="user">일반사용자</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 비밀번호 영역 */}
              <div
                className="space-y-3 absolute top-0 left-6 right-6 transition-transform duration-300 ease-in-out "
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
                        <Input type={'password'} {...field} />
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
                        <Input type={'password'} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            {/* 아래 버튼들에 사용한 cn함수는 인자의 값이 true이면 class에 넣어주고, false라면 넣어주지 않는 함수라고 한다. */}
            <CardFooter>
              <Button
                type="button"
                className={cn({ hidden: stage === 1 })}
                onClick={onClickNextButton}
              >
                다음 단계로
                <Image src={Arrow} alt="화살표" />
              </Button>
              <div className={`flex gap-2  ${cn({ hidden: stage === 0 })}`}>
                <Button type="submit">계정등록하기</Button>
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
