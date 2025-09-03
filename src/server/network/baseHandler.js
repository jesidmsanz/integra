const passport = require("passport");
const nc = require("next-connect");
const { authenticateToken } = require("../auth/strategies/jwt");

const baseHandler = () =>
  nc({ attachParams: true })
    .use(passport.initialize())
    .use((req, res, next) => {
      if (req.method === "POST" && req.url.includes("/auth/refresh-token")) {
        return next();
      }
      if (req.method === "GET" && req.url.includes("specialties/update")) {
        return next();
      }
      authenticateToken(req, res, next);
    });

module.exports = baseHandler;
