import { z } from 'zod';

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,20}$/;

export const userSchema = z
  .object({
    email: z.string().email({ message: '올바른 이메일을 입력해주세요.' }),
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자리 이상이어야 합니다.')
      .max(20, '비밀번호는 20자리 이하이어야 합니다.')
      .refine(
        (value) => passwordRegex.test(value),
        '비밀번호는 최소 8자리 이상이어야 하며 영문, 숫자를 포함해야 합니다.'
      ),
    confirmPassword: z
      .string()
      .min(8, '비밀번호는 최소 8자리 이상이어야 합니다.')
      .max(20, '비밀번호는 20자리 이하이어야 합니다.')
      .refine(
        (value) => passwordRegex.test(value),
        '비밀번호는 최소 8자리 이상이어야 하며 영문과 숫자를 포함해야 합니다.'
      ),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '비밀번호가 일치하지 않습니다.',
        path: ['confirmPassword'],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '비밀번호가 일치하지 않습니다.',
        path: ['password'],
      });
    }
  });
