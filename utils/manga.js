const cheerio = require("cheerio");
const { default: axios } = require("axios");

const BASE_URL = "http://fanfox.net";

async function getHotManga() {
  let { data } = await axios.get(`${BASE_URL}/hot/`);
  let $ = cheerio.load(data);
  let mangas = [];
  $(".manga-list-1-list")
    .children("li")
    .each(function (index, elem) {
      let title = $(this).children("a").attr("title");
      let img = $(this).children("a").children("img").attr("src");
      let href = $(this).children("a").attr("href");
      mangas.push({
        title,
        img,
        href,
      });
    });
  return mangas;
}

async function getLatestRelease() {
  let { data } = await axios.get(`${BASE_URL}/releases`);
  let $ = cheerio.load(data);
  let mangas = [];
  $(".manga-list-4-list")
    .children("li")
    .each(function (index, elem) {
      let title = $(this).children("a").attr("title");
      let img = $(this).children("a").children("img").attr("src");
      let href = $(this).children("a").attr("href");
      let sub = $(this).children(".manga-list-4-item-subtitle").text();
      let time = $(this)
        .children(".manga-list-4-item-subtitle")
        .children("span")
        .text();

      mangas.push({
        title,
        img,
        href,
        sub,
        time,
      });
    });
  return mangas;
}

// getLatestRelease()
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));
