const fs = require('fs');

//Google Spreadsheet
const { GoogleSpreadsheet } = require ('google-spreadsheet');
const { JWT } = require ('google-auth-library');

const googleCreds = JSON.parse (fs.readFileSync('ciceroKey.json'));

const googleAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: googleCreds.client_email,
  key: googleCreds.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

module.exports = {
    headerData: async function headerData(sheetName, instaOfficialID, instaLikesUsernameID){
            
        try {   

            //InstaOfficial Header
            const instaOfficialDoc = new GoogleSpreadsheet(instaOfficialID, googleAuth);//Google Authentication for InstaOfficial DB
            
            await instaOfficialDoc.loadInfo(); // loads document properties and worksheets
            await instaOfficialDoc.addSheet({title : sheetName, headerValues: ['TIMESTAMP',	'USER_ACCOUNT',	'SHORTCODE', 'ID', 'TYPE', 'CAPTION', 
                'COMMENT_COUNT', 'LIKE_COUNT', 'PLAY_COUNT', 'THUMBNAIL', 'VIDEO_URL']});

            const instaLikesUsernameDoc= new GoogleSpreadsheet(instaLikesUsernameID, googleAuth);//Google Authentication for instaLikes Username DB
            
            await instaLikesUsernameDoc.loadInfo(); // loads document properties and worksheets
            await instaLikesUsernameDoc.addSheet({title : sheetName, headerValues: ['SHORTCODE']});
            
            let instaLikesUsernameSheet = instaLikesUsernameDoc.sheetsByTitle[sheetName];
            
            await instaLikesUsernameSheet.resize({rowCount:1000 , columnCount : 1501});
            await instaLikesUsernameSheet.loadCells();

            let header = instaLikesUsernameSheet.getCell(0,0);
            header.value = 'SHORTCODE';
            header.textFormat = { bold: true, fontSize: 13};
            
            await instaLikesUsernameSheet.saveUpdatedCells();

            let i = 1;

            async function pushHeaders() { //  create a loop function
                
                setTimeout(async function() { //  call a 2s setTimeout when the loop is called                           
                
                    let header = instaLikesUsernameSheet.getCell(0, i);
                    header.value = 'USER_'+i;
                    header.textFormat = { bold: true, fontSize: 13};
                    await instaLikesUsernameSheet.saveUpdatedCells(); // save all updates in one call    
                    i++;  //  increment the counter
                    
                    if (i < 1500) {  //  if the counter < rowsSource.length, call the loop function
                       
                        try {
                            pushHeaders(); //  again which will trigger another                         
                        } catch (error) {
                            let responseData = {
                                message : error,
                                state : false,
                                code : 0
                            }
                
                            instaOfficialDoc.delete;
                            instaLikesUsernameDoc.delete;
                            return responseData;                        }
                        
                    } else {
                                                
                        let responseData = {
                            message : 'Client DataBase for '+sheetName+' Created, with header properties',
                            state : true,
                            code : 1
                        }
            
                        instaOfficialDoc.delete;
                        instaLikesUsernameDoc.delete;
                        return responseData;
                    }
                }, 800);
            }   

            try {

                pushHeaders();
            
            } catch (error) {

                let responseData = {
                    message : error,
                    state : false,
                    code : 0
                }
                                
                instaOfficialDoc.delete;
                instaLikesUsernameDoc.delete;
                return responseData;            
            }

        } catch (error) {

            let responseData = {
                message : error,
                state : false,
                code : 0
              }
            
            return responseData;        
        }
    }
}
