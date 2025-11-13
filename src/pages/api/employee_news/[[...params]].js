import handler from "@/server/components/employee_news/network";
import multer from "multer";
import path from "path";
import fs from "fs";

// Deshabilitar bodyParser para manejar multipart y JSON manualmente
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
    // Procesar JSON manualmente (el stream puede no ser readable con raw-body)
    else if ((req.method === "POST" || req.method === "PUT") && isJSON) {
      req.body = await new Promise((resolve, reject) => {
        let body = '';
        let timeout;
        
        // Verificar si el stream es readable
        if (!req.readable) {
          // Si no es readable, puede que ya fue consumido
          // Intentar usar req.body si existe
          if (req.body) {
            return resolve(req.body);
          }
          return reject(new Error('Stream not readable'));
        }
        
        req.on('data', chunk => {
          body += chunk.toString();
        });
        
        req.on('end', () => {
          clearTimeout(timeout);
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        });
        
        req.on('error', (err) => {
          clearTimeout(timeout);
          reject(err);
        });
        
        // Timeout de seguridad (30 segundos)
        timeout = setTimeout(() => {
          reject(new Error('Timeout reading request body'));
        }, 30000);
      });
    }

    // Pasar al handler (req.body ya está listo)
    return handler(req, res);
  } catch (error) {
    console.error("Error en Next.js API route:", error);
    return res.status(500).json({ error: error.message });
  }
}
