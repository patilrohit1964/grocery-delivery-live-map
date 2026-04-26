import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDb from "./lib/db";
import User from "./models/user.model";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";

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
        if (!email || !password) {
          return null;
        }
        const user = await User.findOne({ email });
        if (!user) {
          return null;
        }
        const isMatched = await bcrypt.compare(password, user.password);

        if (!isMatched) {
          return null;
        }
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // for google sign in data
    async signIn({ user, account }) {
      if (account?.provider == "google") {
        await connectDb();
        let dbUser = await User.findOne({ email: user?.email });
        if (!dbUser) {
          dbUser = await User.create({
            name: user?.name,
            email: user?.email,
            image: user?.image,
          });
        }
        user.id = dbUser?._id.toString();
        user.role = dbUser?.role;
      }
      return true;
    },
    // this work on insert user data in token
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        // next-auth by default take only this id, name, email for external method add use global like create file next-auth and define globally
      }
      if (trigger === "update") {
        token.role = session.role;
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
  secret: process.env.AUTH_SECRET,
});
