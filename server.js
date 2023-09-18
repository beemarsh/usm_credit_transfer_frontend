const next = require("next");
var https = require("https");
var fs = require("fs");

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const httpsOptions = {
  key: fs.readFileSync("./app.localhost.com-key.pem"),
  cert: fs.readFileSync("./app.localhost.com.pem"),
};

const next = require("next");
const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev: true, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  https
    .createServer(httpsOptions, (req, res) => {
      // handle ....
    })
    .listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on localhost:${port}`);
    });
});
