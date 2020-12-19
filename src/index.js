const express = require("express");
const cors = require("cors");
const compression = require('compression');

const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const port = 8080;
const routes = require("./routes")

let url =
  "mongodb+srv://budget-admin:E2P7yRolex2BOeqM@cluster0.1xfm9.mongodb.net/<dbname>?retryWrites=true&w=majority";

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    const app = express();

    app.use(cors());
    app.use(bodyParser.json());
    app.use(compression());

    app.use("/api", routes);

    app.get("/", (req, res) => {
      res.write("Hello World! From inside");
      res.end();
    });

    app.listen(port);
  });
