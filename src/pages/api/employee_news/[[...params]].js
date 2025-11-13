import handler from "@/server/components/employee_news/network";
import multer from "multer";
import path from "path";
import fs from "fs";
import getRawBody from "raw-body";

// Configurar Next.js: deshabilitar bodyParser solo para multipart
export const config = {
  api: {
    bodyParser: false,
  },
};

// Usar el mismo multer que el middleware del servidor
const uploadDir = path.join(process.cwd(), "public", "files");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
};

export default async function (req, res) {
  try {
    const contentType = req.headers["content-type"] || "";
    const isMultipart = contentType.includes("multipart/form-data");
    const isJSON = contentType.includes("application/json");

    // Procesar multipart con multer
    if ((req.method === "POST" || req.method === "PUT") && isMultipart) {
      await runMiddleware(req, res, upload.single("document"));
    }
    // Procesar JSON con raw-body (más robusto que leer manualmente)
    else if ((req.method === "POST" || req.method === "PUT") && isJSON) {
      const rawBody = await getRawBody(req, {
        length: req.headers["content-length"],
        limit: "10mb",
        encoding: "utf8",
      });
      req.body = JSON.parse(rawBody);
    }

    // Pasar al handler (que ya maneja todo)
    return handler(req, res);
  } catch (error) {
    console.error("Error en Next.js API route:", error);
    return res.status(500).json({ error: error.message });
  }
}
