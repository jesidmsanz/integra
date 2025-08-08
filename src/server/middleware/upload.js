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
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    console.log("=== STORAGE FILENAME CALLED ===");
    console.log("file:", file);
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

module.exports = upload; 