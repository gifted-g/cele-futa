const requireNew = (module) => {
  return require(process.cwd() + "/node_modules/" + module);
};

const express = require("express");
const app = express();

const interfaces = require("os").networkInterfaces();
const http = require("http").createServer(app);
const fs = require("fs");

const io = require("socket.io")(http);

const getIPAddress = () => {
  for (let devName in interfaces) {
    const iface = interfaces[devName];

    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      )
        return alias.address;
    }
  }
  return "localhost";
};

const PORT = 3000;
const appUrl = `http://${getIPAddress()}:${PORT}`;

const expressApp = () => {
  app.set("view engine", "ejs");
  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));

  app.use(express.json());

  // Render the "Add Hymn" form
  app.get("/add", (req, res) => {
    res.render("add_hymn", { title: "Add Hymn", ipAddress: appUrl });
  });

  app.get("/", (req, res) => {
    res.render("projector");
  });

  app.get("/overlay", (req, res) => {
    res.render("overlay");
  });

  app.post("/add-lyrics", (req, res) => {
    const lyrics = JSON.parse(fs.readFileSync("./lyrics.json")) || [];

    lyrics.push(req.body);

    fs.writeFileSync("./lyrics.json", JSON.stringify(lyrics, null, 2));

    res.json({
      success: true,
    });
  });

  app.get("/get-lyrics", (req, res) => {
    const lyrics = JSON.parse(fs.readFileSync("./lyrics.json"));

    fs.writeFileSync("./lyrics.json", JSON.stringify(lyrics, null, 2));

    return res.json({
      lyrics,
    });
  });

  app.get("/control-panel", (req, res) => {
    res.render("control-panel", {
      ipAddress: appUrl,
    });
  });

  app.get("/control-bible", (req, res) => {
    res.render("control-panel-bible", {
      ipAddress: appUrl,
    });
  });

  io.on("connection", (socket) => {
    socket.on("hymn-content", (hymn) => {
      io.emit("lyrics", hymn);
    });

    socket.on("bible-content", (bibleC) => {
      io.emit("scripture", {
        scripture: bibleC.line,
        quote: bibleC.title,
        version: bibleC.version,
      });
    });
  });

  app.get("/bible-books", (req, res) => {
    const books = fs.readdirSync("./bible");
    res.json(books);
  });

  app.post("/get-chapters", (req, res) => {
    const { book } = req.body;

    const chapters = fs.readdirSync(`./bible/${book}`);
    const reading = JSON.parse(fs.readFileSync(`./bible/${book}/1.json`));

    res.json({
      totalChapters: chapters.length,
      versions: reading.map((a) => a.version),
    });
  });

  app.post("/get-verse-chapter", (req, res) => {
    const { book, chapter } = req.body;

    const verses = JSON.parse(
      fs.readFileSync(`./bible/${book}/${chapter}.json`)
    );

    res.json({
      totalVerse: verses[0].data.length,
      versions: verses.map((a) => a.version),
    });
  });

  app.post("/get-content", (req, res) => {
    const { book, chapter } = req.body;
    let { version } = req.query;

    if (!version) {
      version = "kjv";
    }

    let reading = JSON.parse(
      fs.readFileSync(`./bible/${book}/${chapter}.json`)
    ).filter((a) => {
      return a.version == version;
    })[0];

    res.json({
      reading,
    });
  });

  http.listen(PORT, "0.0.0.0", () => console.log(`app live at ${appUrl}`));
};

module.exports = expressApp;
