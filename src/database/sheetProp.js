const fs = require('fs');
const axios = require('axios');

//Google Spreadsheet
const { GoogleSpreadsheet } = require ('google-spreadsheet');
const { JWT } = require ('google-auth-library');
const { console } = require('inspector');
const { Console } = require('console');

const googleCreds = JSON.parse (fs.readFileSync('ciceroKey.json'));

const googleAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: googleCreds.client_email,
  key: googleCreds.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

module.exports = {
    instaLikesDataBase: async function instaLikesDataBase(sheetName, instaLikesUsernameID){
            
        try {   

            const instaLikesUsernameDoc= new GoogleSpreadsheet(instaLikesUsernameID, googleAuth);//Google Authentication for instaLikes Username DB
            await instaLikesUsernameDoc.loadInfo(); // loads document properties and worksheets
            await instaLikesUsernameDoc.addSheet({title : sheetName, headerValues: ['SHORTCODE']});
            let instaLikesUsernameSheet = await instaLikesUsernameDoc.sheetsByTitle[sheetName];
            instaLikesUsernameSheet.resize({rowCount:1000 , columnCount : 1501});
            
            await instaLikesUsernameSheet.loadCells();
            let header = instaLikesUsernameSheet.getCell(0,0);
            header.value = 'SHORTCODE';
            header.textFormat = { bold: true, fontSize: 13};
            await instaLikesUsernameSheet.saveUpdatedCells();

            let i = 1;

            async function pushHeaders() { //  create a loop function
                setTimeout(async function() { //  call a 2s setTimeout when the loop is called                           
                    let header = await instaLikesUsernameSheet.getCell(0,i);
                    header.value = 'USER_'+i;
                    header.textFormat = { bold: true, fontSize: 13};
                    await instaLikesUsernameSheet.saveUpdatedCells(); // save all updates in one call
                    i++;  //  increment the counter
                    
                    if (i < 1500) {  //  if the counter < rowsSource.length, call the loop function
                        pushHeaders(); //  again which will trigger another 
                    } else {
                        return 'succes update header';
                    }
                }, 700);
            }   

            let response = await pushHeaders();
            console.log(response);
            return response;

        } catch (error) {
            return 'Error, Sheet Name exist';
        }
    }
}
