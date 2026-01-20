import z from "zod";

export const UserSchema = z.object({
  username: z.string().min(3).max(30),
  fullName: z.string().min(3).max(100),
  password: z.string().min(6).max(100),
  role: z.enum(["admin", "user"]),
});

export type CreateUserInput = z.infer<typeof UserSchema>;

export const EditUserSchema = UserSchema.extend({
  password: z.string().min(6).max(100).optional().or(z.literal("")),
});

export type EditUserInput = z.infer<typeof EditUserSchema>;
