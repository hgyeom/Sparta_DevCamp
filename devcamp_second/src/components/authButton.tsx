'use client';

import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from './ui/button';

interface AuthProps {
  isLogin: boolean;
}

export default function AuthButtons({ isLogin }: AuthProps) {
  const { data: session } = useSession();

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (session) {
      await signOut();
    } else {
      await signIn();
    }
  };

  return (
    <div className="flex justify-end gap-4">
      {isLogin && (
        <span>
          {session
            ? session.user?.name
              ? session.user.name
              : session.user?.email
            : '로그인 중입니다.'}
        </span>
      )}
      <Button size={'sm'} variant={'default'} onClick={onClick}>
        {isLogin ? '로그아웃' : '로그인'}
      </Button>
      {!isLogin && (
        <Button size={'sm'} variant={'default'}>
          <Link href="/auth/signup">회원가입</Link>
        </Button>
      )}
    </div>
  );
}
