const express = require('express');
const quest = require('request');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
var cors = require('cors')
let port = process.env.PORT || 3000

const app = express();

app.use(cors())

app.listen(port)
//ROUTES


app.get('/search', (request, response) => {
    console.log(request.query.link);
    quest(`${request.query.link}`, (error, _response, html) => {
        if (!error && _response.statusCode == 200) {
          const $ = cheerio.load(html);
          const bookArray = [];
          $('[target]').each((i,el) => {
            const title = $(el).text()
            const link = $(el).attr('href');
         bookArray.push({name:title, link:link})
          });
          response.send(bookArray) 
        }
      });
});

// Download
app.get('/download', (request, response) => {
    console.log(request.query.link);
    DownloadBook(request.query.link).then((data)=>{
        console.log(data);
        response.send(data) 
    }).catch(console.error);
});



//FUNCTIONS

function DownloadBook (link) {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({
                args: [
                  '--no-sandbox',
                  '--disable-setuid-sandbox',
                ],
              });
            const page = await browser.newPage();
            await page.goto(`${link}`, {waitUntil: 'networkidle2'});
            console.log('Clicking on "Download PDF" button');
            await page.on('response', response => {
                console.log(response.url());
                if (response.url().indexOf('dtoken') > -1){
                    console.log("response code: ", response.status(), response.url());
                    urls = response.url()
                    return resolve(urls);
                }
                  
              });
             
            await page.click('a.btn.btn-primary.dlButton.addDownloadedBook')
            await page.waitForNavigation({waitUntil: 'networkidle2'})
            browser.close();
            
            
        } catch (e) {
            return reject(e);
        }
    })
}