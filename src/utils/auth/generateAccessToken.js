import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, username: user.Username },
    process.env.NEXTAUTH_SECRET,
    { expiresIn: "1h" }
  );
};
