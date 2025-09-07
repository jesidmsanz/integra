const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");

const cors = require("cors");

const port = parseInt(process.env.PORT, 10) || 3000;
const hostname = "localhost";
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  // Middleware setup
  const corsOptions = {
    origin: "*",
    credentials: true,
  };

  server.use(cors(corsOptions));
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());

  // Servir archivos estáticos desde la carpeta public/files
  server.use('/files', express.static(path.join(process.cwd(), 'public', 'files')));
  
  // Servir archivos PDF desde la carpeta public/pdfs
  server.use('/pdfs', express.static(path.join(process.cwd(), 'public', 'pdfs')));

  // Endpoint de prueba para upload
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log("=== TEST UPLOAD DESTINATION ===");
      console.log("file:", file);
      cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
      console.log("=== TEST UPLOAD FILENAME ===");
      console.log("file:", file);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const filename = 'test-' + uniqueSuffix + ext;
      console.log("Generated filename:", filename);
      cb(null, filename);
    }
  });

  const upload = multer({ storage: storage });

  server.post('/api/test-upload', upload.single('document'), (req, res) => {
    console.log("=== TEST UPLOAD ENDPOINT ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    res.json({
      message: "File uploaded successfully",
      filename: req.file ? req.file.filename : null
    });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    console.log(`> Ready on http://${hostname}:${port}`);
    if (err) throw err;
  });

  if (!dev) {
    //Tasks
  }
});
