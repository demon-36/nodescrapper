var puppeteer = require('puppeteer');
var cheerio = require('cheerio');
const { get } = require('request');

var url = "http://quotes.toscrape.com";

async function get_quotes(quotes) {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.setViewport({width:1920, height:2160});
  await page.goto("http://quotes.toscrape.com/js/", {waitUntil: 'networkidle2'})
  .then(content => page.content())
      .then((success) => {
        var $ = cheerio.load(success);
        $("div.quote").each(function(i, element){
          var quote = $(element).find("span.text").text();
          var author = $(element).find("small.author").text();
          let metadata = {
              Quote: quote,
              Author: author
          };
          quotes.push(metadata);
        });
      })
  await browser.close();
}

async function get_description(auth){
  for(let ea of auth){
    var eurl = ea.About;
    //console.log(eurl);
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setViewport({width:1920, height:2160});
    await page.goto(eurl, {waitUntil: 'networkidle2'})
    .then(content => page.content())
        .then((success) => {
          var $ = cheerio.load(success);
          var desc=$("div.author-description").text();
          ea.Description=desc;
        })
    await browser.close();
  }
}

async function get_authors(authors) {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.setViewport({width:1920, height:2160});
  await page.goto("http://quotes.toscrape.com/js/", {waitUntil: 'networkidle2'})
  .then(content => page.content())
      .then((success) => {
        var $ = cheerio.load(success);
        $("div.quote").each(function(i, element){
          var author = $(element).find("small.author").text();
          var k=$(element).find("span").eq(1).find("a").attr("href");
          var ssa = author.split(".");
          var s = "";
          for(let ch of ssa){
            ch=ch.trim();
            var sarr = ch.split(" ");
            for(let c of sarr){
              if(c.indexOf(".")!=-1){
                c=c.split(".").join("-");
              }
              s+=c[0].toUpperCase()+c.slice(1);
              s+="-";
            }
          }
          var str = s.substring(0, s.length - 1);
          var aurl = url+"/author/"+str;
          var desc="";
          let metadata = {
              Author: author,
              About: aurl,
              Description: desc
          };
          authors.push(metadata);
        });
      })
  await browser.close();
}

async function get_quotes_author(quotes, name) {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.setViewport({width:1920, height:2160});
  await page.goto("http://quotes.toscrape.com/js/", {waitUntil: 'networkidle2'})
  .then(content => page.content())
      .then((success) => {
        var $ = cheerio.load(success);
        $("div.quote").each(function(i, element){
          var quote = $(element).find("span.text").text();
          var author = $(element).find("small.author").text();
          if(author==name){
            let metadata = {
              Quote: quote,
              Author: author
            };
            quotes.push(metadata);
          }
        });
      })
  await browser.close();
}

async function get_tags_author(tags, name) {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.setViewport({width:1920, height:2160});
  await page.goto("http://quotes.toscrape.com/js/", {waitUntil: 'networkidle2'})
  .then(content => page.content())
      .then((success) => {
        var $ = cheerio.load(success);
        $("div.quote").each(function(i, element){
          var author = $(element).find("small.author").text();
          if(author==name){
            var tagsname = $(element).find("div.tags").find("a.tag");
            var tagsdata=[];
            $(tagsname).each(function(ind, ele){
                var tagname = ($(this).text());
                tagsdata.push(tagname);
            });
            for(let t of tagsdata){
              tags[t] = (tags[t]||0)+1;
            }
          }
        });
      })
  await browser.close();
}

module.exports = {
  get_quotes,
  get_authors,
  get_quotes_author,
  get_tags_author,
  get_description
}