const multer = require('multer');
const path = require('path');
const fs = require('fs');

console.log("=== UPLOAD MIDDLEWARE LOADING ===");

// Crear directorio de uploads en public/files si no existe
const uploadDir = path.join(process.cwd(), 'public', 'files');
console.log("=== UPLOAD MIDDLEWARE DEBUG ===");
console.log("__dirname:", __dirname);
console.log("uploadDir:", uploadDir);
console.log("uploadDir exists:", fs.existsSync(uploadDir));

if (!fs.existsSync(uploadDir)) {
  console.log("Creating upload directory...");
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Upload directory created successfully");
}

// Configurar storage simple
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("=== STORAGE DESTINATION CALLED ===");
    console.log("file:", file);
    console.log("uploadDir:", uploadDir);
    console.log("req.method:", req.method);
    console.log("req.url:", req.url);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    console.log("=== STORAGE FILENAME CALLED ===");
    console.log("file:", file);
    console.log("file.fieldname:", file.fieldname);
    console.log("file.originalname:", file.originalname);
    console.log("file.mimetype:", file.mimetype);
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + ext;
    console.log("Generated filename:", filename);
    cb(null, filename);
  }
});

// Configurar multer sin filtros por ahora
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

console.log("=== UPLOAD MIDDLEWARE LOADED ===");

// Middleware de logging para todas las peticiones
const requestLogger = (req, res, next) => {
  console.log("=== REQUEST LOGGER ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Content-Type:", req.headers['content-type']);
  console.log("Body keys:", Object.keys(req.body || {}));
  console.log("File:", req.file ? req.file.filename : 'No file');
  console.log("Files:", req.files ? Object.keys(req.files) : 'No files');
  next();
};

module.exports = { upload, requestLogger }; 