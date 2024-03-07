'use client';

import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from './ui/button';
export default function AuthButtons() {
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
      {session && (
        <span>
          {session.user?.name ? session.user.name : session.user?.email}
        </span>
      )}
      <Button size={'sm'} variant={'default'} onClick={onClick}>
        {session ? '로그아웃' : '로그인'}
      </Button>
      {!session && (
        <Button size={'sm'} variant={'default'}>
          <Link href="/auth/signup">회원가입</Link>
        </Button>
      )}
    </div>
  );
}
