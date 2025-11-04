import NextAuth from "next-auth";
const {
  getUser,
  updateRefreshToken,
  updateAccessToken,
} = require("@/server/components/users/controller");
const { getUserPermissions } = require("@/server/utils/userPermissions");
import * as bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import { generateAccessToken } from "@/utils/auth/generateAccessToken";
import { generateRefreshToken } from "@/utils/auth/generateRefreshToken";

const generateTokens = (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  return { accessToken, refreshToken };
};

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { username, password } = credentials;
        const user = await getUser({ username });

        if (!user) {
          throw new Error("User not found");
        }
        if (!(await bcrypt.compare(password, user.password))) {
          throw new Error("Incorrect password");
        }
        const { accessToken, refreshToken } = generateTokens(user);

        if (!user.id) {
          console.error("User ID is missing:", user);
          throw new Error("User ID is required");
        }

        await updateRefreshToken(user.id, refreshToken);
        await updateAccessToken(user.id, accessToken);

        // Obtener permisos del usuario basados en sus roles
        let permissions = [];
        try {
          permissions = await getUserPermissions(user.id);
        } catch (error) {
          console.error("Error obteniendo permisos del usuario:", error);
        }

        user.id = user._id;
        delete user.Password;
        return {
          ...user,
          accessToken,
          refreshToken,
          permissions, // Incluir permisos en el objeto de usuario
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.permissions = user.permissions || []; // Incluir permisos en el token
        token.roles = user.roles || []; // Incluir roles en el token
        token.user = {
          Email: user.email || user.Email || "",
          Role: user.Role || "",
          FirstName: user.firstName || user.FirstName || "",
          LastName: user.lastName || user.LastName || "",
          Phone: user.phone || user.Phone || "",
          Active: user.active !== undefined ? user.active : (user.Active || false),
        };
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.permissions = token.permissions || []; // Incluir permisos en la sesión
        session.roles = token.roles || []; // Incluir roles en la sesión
        session.user = token.user;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
  },
  session: {
    jwt: true,
    maxAge: 60 * 60, // Duración de la sesión (1 hora)
    updateAge: 5 * 60, // Intervalo para actualizar el token (5 minutos)
  },
});
