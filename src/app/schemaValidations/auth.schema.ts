import z from 'zod'

export const RegisterBody = z
  .object({
    username: z.string().email(),
    password: z.string().min(6).max(100),
    role: z.number().default(1),
  })
  .strict()
  
  

  export type RegisterBodyType = z.TypeOf<typeof RegisterBody>
  

  export const RegisterRes = z.object({
  data: z.object({
    token: z.string(),
    expiresAt: z.string(),
    account: z.object({
      username: z.string(),
      role: z.number(),
    })
  }),
  message: z.string()
})

export type RegisterResType = z.TypeOf<typeof RegisterRes>

export const LoginBody = z
  .object({
    username: z.string(),
    password: z.string().min(6).max(100)
  })
  .strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>

export const LoginRes = RegisterRes

export type LoginResType = z.TypeOf<typeof LoginRes>

export const UserRes = z
  .object({
    data: z.object({
      username: z.string(),
     role: z.number(),
    }),
    message: z.string()
  })

export type UserResType = z.TypeOf<typeof UserRes>
