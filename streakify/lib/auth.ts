import { compare, hash } from "bcryptjs";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getSupabaseAdmin } from "@/lib/supabase";

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in"
  },
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const supabase = getSupabaseAdmin();
        const { data: user, error } = await supabase
          .from("users")
          .select("id, email, name, password")
          .eq("email", credentials.email)
          .single();

        if (error || !user?.password) {
          return null;
        }

        const valid = await compare(credentials.password, user.password);
        if (!valid) {
          return null;
        }

        return {
          id: String(user.id),
          email: user.email,
          name: user.name
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
};

export async function hashPassword(password: string) {
  return hash(password, 12);
}
