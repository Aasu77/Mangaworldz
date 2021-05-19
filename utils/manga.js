const cheerio = require("cheerio");
const { default: axios } = require("axios");

const BASE_URL = "http://fanfox.net";

class MangaWorldz {
  async getHotManga() {
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

  async getLatestRelease() {
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

  async getManga(href) {
    let manga = {
      img: "",
      title: "",
      status: "",
      author: "",
      genre: [],
      chapters: [],
    };
    let { data } = await axios.get(`${BASE_URL}/${href}`);
    let $ = cheerio.load(data);
    manga.img = $(".detail-bg-img").attr("src");
    manga.title = $(".detail-info-right-title-font").text();
    manga.status = $(".detail-info-right-title-tip").text();
    manga.author = $(".detail-info-right-say").children("a").attr("title");
    $(".detail-info-right-tag-list")
      .children("a")
      .each(function (ind, elem) {
        manga.genre.push($(this).attr("title"));
      });
    $(".detail-main-list")
      .children("li")
      .each(function (ind, elem) {
        let href = $(this).children("a").attr("href").slice(0, -6);
        let title = $(this)
          .children("a")
          .children("div")
          .children("p.title3")
          .text();
        let updated = $(this)
          .children("a")
          .children("div")
          .children("p.title2")
          .text();
        manga.chapters.push({
          href,
          title,
          updated,
        });
      });
    return manga;
  }

  async getChapter(href) {
    let page_no = 1;
    let chapter = {
      title: "",
      chapter_no: 0,
      total_page: "",
      pages: [],
    };
    let { data } = await axios.get(`${BASE_URL}/${href}/${page_no}.html`);
    let $ = cheerio.load(data);
    chapter.title = $(".reader-header-title-1").children("a").text();
    chapter.chapter_no = $(".reader-header-title-2").text();
    let temp = [];
    $(".pager-list-left")
      .children("span")
      .children("a")
      .each(function (ind, elem) {
        temp.push($(this).text());
      });
    chapter.total_page = temp.length - 1;
    chapter.pages.push({ img: $(".reader-main").children("img").attr("src") });
    return chapter;
  }
}

module.exports = MangaWorldz;

let manga = new MangaWorldz();
// manga
//   .getManga("/manga/tokyo_manji_revengers/")
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));

manga
  .getChapter("/manga/tokyo_manji_revengers/v01/c030/")
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
