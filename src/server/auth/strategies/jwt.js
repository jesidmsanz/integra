import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("🔍 Headers de autorización:", req.headers.authorization);
  console.log("🔍 NEXTAUTH_SECRET disponible:", !!process.env.NEXTAUTH_SECRET);
  
  const token = authHeader && authHeader.split(" ")[1];
  console.log("🔍 Token extraído:", token ? `${token.substring(0, 20)}...` : "No token");

  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ message: "No token provided" });
  }
  
  if (!process.env.NEXTAUTH_SECRET) {
    console.log("❌ NEXTAUTH_SECRET no está definido");
    return res.status(500).json({ message: "Server configuration error" });
  }
  
  jwt.verify(token, process.env.NEXTAUTH_SECRET, (err, user) => {
    if (err) {
      console.log("❌ Token inválido o expirado:", err.message);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    
    console.log("✅ Token válido, usuario decodificado:", user);
    
    // Normalizar el objeto user para que tenga tanto 'id' como 'userId'
    req.user = {
      ...user,
      id: user.userId, // Mapear userId a id para compatibilidad
    };
    
    console.log("🔍 Usuario final en req.user:", req.user);
    next();
  });
};
