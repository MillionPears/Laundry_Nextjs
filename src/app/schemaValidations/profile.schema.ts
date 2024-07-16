import z from 'zod'


export const ProfileSchema = z.object({
    id: z.number(),
    name: z.string(),
    address: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    hobbie: z.string(),
    avatar: z.string().url(),
})



export const UpdateProfileBody =z.object({
    username: z.string().default('million'),
    name: z.string().min(6),
    address: z.string(),
    hobbie: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    avatar: z.string()
    
})

export type UpdateProfileBodyType = z.TypeOf<typeof UpdateProfileBody>

export const ProfileRes = z.object({
    data: ProfileSchema,
    message: z.string()
})

export type ProfileResType = z.TypeOf<typeof ProfileRes>