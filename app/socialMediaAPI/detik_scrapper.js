import * as cheerio from 'cheerio';
import axios from 'axios';


export async function detikScrapping() {   
    try {

      const axiosResponse = await axios.request({
        method: "GET",
        url: "https://news.detik.com/berita/d-7745563/hoegeng-awards-2025-resmi-dibuka-saatnya-usulkan-polisi-teladan-di-sekitarmu",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
      });
      
              
      const $ = cheerio.load(axiosResponse.data);

      console.log($('.komentar-iframe-min-media__user').text());

    } catch (error) {
      console.log(error);
    }
}