const { default: axios } = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const url = "https://www.ccchymns.sogapps.com/hymnBook/hymn";

const lang = {
  English: "English",
  Yoruba: "Yoruba",
};

const selector = "body > div.container > pre";

const getText = (res) => {
  const html = res.data;
  const $ = cheerio.load(html);
  return $("body > div.container > pre")
    .text()
    .split("\n")
    .map((a) => a.trim().replace("\t", ""));
};

const run = async () => {
  for (let i = 1; i < 981; i++) {
    try {
      const [eng, yor] = await Promise.all([
        axios.get(`${url}/${i}/${lang.English}`),
        axios.get(`${url}/${i}/${lang.Yoruba}`),
      ]);

      const htmleng = getText(eng);
      const htmlyor = getText(yor);

      const lyrics = JSON.parse(fs.readFileSync("./lyrics.json")) || [];

      lyrics.push({
        title: `HYMN ${i}`,
        content: htmleng,
        language: lang.English,
      });

      lyrics.push({
        title: `HYMN ${i}`,
        content: htmlyor,
        language: lang.Yoruba,
      });

      fs.writeFileSync("./lyrics.json", JSON.stringify(lyrics, null, 2));
    } catch (error) {
      console.log("error", error.message);
    }

    console.log(`${i} of 978`);
  }
};

run();
