import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDb from "./lib/db";
import User from "./models/user.model";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      //   credentails provide email or password etc details using that we can check and store in db
      async authorize(credentials, request) {
        await connectDb();
        const email = credentials.email;
        const password = credentials.password as string;
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("user does not exist");
        }
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
          throw new Error("password does not match");
        }
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    // this work on insert user data in token
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        // next-auth by default take only this id, name, email for external method add use global like create file next-auth and define globally
      }
      return token;
    },
    // using this store data in session like cookie
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  //   this help to redirect on pages after login,logout etc
  pages: {
    signIn: "/login",
    error: "/login",
  },
  //   this help to from which location we store session
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60 * 1000, //for 10 days
  },
  secret:process.env.AUTH_SECRET
});
