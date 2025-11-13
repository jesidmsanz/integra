import handler from "@/server/components/employee_news/network";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configurar Next.js para no parsear automáticamente el body
export const config = {
  api: {
    bodyParser: false, // Deshabilitar el parsing automático del body
  },
};

// Configurar multer para Next.js
const uploadDir = path.join(process.cwd(), 'public', 'files');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("=== NEXTJS UPLOAD DESTINATION ===");
    console.log("file:", file);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    console.log("=== NEXTJS UPLOAD FILENAME ===");
    console.log("file:", file);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + ext;
    console.log("Generated filename:", filename);
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Middleware para manejar multer en Next.js
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function(req, res) {
  try {
    console.log("=== NEXTJS API ROUTE ===");
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Content-Type:", req.headers['content-type']);
    
    // Solo procesar con multer si es multipart/form-data
    if ((req.method === 'POST' || req.method === 'PUT') && req.headers['content-type']?.includes('multipart/form-data')) {
      console.log("Procesando con multer...");
      
      try {
        await runMiddleware(req, res, upload.single('document'));
        console.log("Multer procesado exitosamente");
        console.log("req.body después de multer:", req.body);
        console.log("req.file después de multer:", req.file);
      } catch (multerError) {
        console.error("Error en multer:", multerError);
        return res.status(400).json({ error: "Error procesando archivo: " + multerError.message });
      }
    } else if ((req.method === 'POST' || req.method === 'PUT') && req.headers['content-type']?.includes('application/json')) {
      console.log("Procesando JSON manualmente...");
      
      // Leer el body como Promise para esperarlo correctamente
      const bodyPromise = new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (parseError) {
            reject(parseError);
          }
        });
        req.on('error', reject);
      });
      
      try {
        req.body = await bodyPromise;
        console.log("req.body JSON parseado:", req.body);
      } catch (parseError) {
        console.error("Error parseando JSON:", parseError);
        return res.status(400).json({ error: "Error parseando JSON: " + parseError.message });
      }
    } else {
      console.log("No es multipart ni JSON, pasando directamente");
    }
    
    // Llamar al handler original (req.body ya está listo)
    return handler(req, res);
  } catch (error) {
    console.error("Error en Next.js API route:", error);
    return res.status(500).json({ error: error.message });
  }
};
