const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");

const cors = require("cors");

const port = parseInt(process.env.PORT, 10) || 3038;
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
