import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  // Usar user.id si está disponible, sino user._id
  const userId = user.id || user._id;
  const username = user.Username || user.username || '';
  
  console.log("🔍 Generando token para usuario:", { userId, username, userKeys: Object.keys(user) });
  
  return jwt.sign(
    { userId, username },
    process.env.NEXTAUTH_SECRET,
    { expiresIn: "1h" }
  );
};
