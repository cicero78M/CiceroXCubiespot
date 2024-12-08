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
  reportInstaLikes: async function reportInstaLikes(sheetName, userClientID, clientID, instaOfficialID, instaLikesUsernameID){

    console.log("Executing Functions");
    const d = new Date();
    const localDate = d.toLocaleDateString('id');

    const userClientDoc = new GoogleSpreadsheet(userClientID, googleAuth);//Google Authentication for user client DB
    await userClientDoc.loadInfo(); // loads document properties and worksheets

    const clientDoc = new GoogleSpreadsheet(clientID, googleAuth);//Google Authentication for client DB
    await clientDoc.loadInfo(); // loads document properties and worksheets

    const instaOfficialDoc = new GoogleSpreadsheet(instaOfficialID, googleAuth);//Google Authentication for InstaOfficial DB
    await instaOfficialDoc.loadInfo(); // loads document properties and worksheets

    const instaLikesUsernameDoc= new GoogleSpreadsheet(instaLikesUsernameID, googleAuth);//Google Authentication for instaLikes Username DB

    //Check Client_ID. then get async data
    let isClientID = false;
    let instaOfficial;
    let isStatus;
  
    const clientDataSheet = clientDoc.sheetsByTitle['ClientData'];
    const rowsClientData = await clientDataSheet.getRows();

    for (let i = 0; i < rowsClientData.length; i++){
      if (rowsClientData[i].get('CLIENT_ID') === sheetName){
        isClientID = true;
        instaOfficial = rowsClientData[i].get('INSTAGRAM');
        isStatus = rowsClientData[i].get('STATUS');
      }
    }

    // If Client_ID exist. then get official content
    if (isClientID && isStatus){    
      try {
    
        //Collect Shortcode from Database        
        let shortcodeList = [];
        const officialInstaSheet = instaOfficialDoc.sheetsByTitle[sheetName];
        const officialInstaData = await officialInstaSheet.getRows();

        for (let i = 0; i < officialInstaData.length; i++){
            let itemDate = new Date(officialInstaData[i].get('TIMESTAMP')*1000);
            if(itemDate.toLocaleDateString('id') === localDate){
                if (!shortcodeList.includes(officialInstaData[i].get('SHORTCODE'))){
                    shortcodeList.push(officialInstaData[i].get('SHORTCODE'));
                  }
            }
        }
        console.log(shortcodeList);
        
        await instaLikesUsernameDoc.loadInfo(); // loads document properties and worksheets
        let instaLikesUsernameSheet = await instaLikesUsernameDoc.sheetsByTitle[sheetName];
        let instaLikesUsernameData = await instaLikesUsernameSheet.getRows();
        
        for (let i = 0; i < shortcodeList.length; i++){
          //code on the go
          for (let ii = 0; ii < instaLikesUsernameData.length; ii++){
            if (instaLikesUsernameData[ii].get('SHORTCODE') === shortcodeList[i]){

                const fromRows = Object.values(instaLikesUsernameData[ii].toObject());

                let userLikesData = [];
                
                for (let iii = 1; iii < fromRows.length; iii++){
                    if(fromRows[iii] != undefined || fromRows[iii] != null || fromRows[iii] != ""){
                        if(!userLikesData.includes(fromRows[iii])){
                            userLikesData.push(fromRows[iii]);
                        }
                    }
                }

                console.log(userLikesData);

            }
          }

        }

      } catch (error) {
        return 'Error, Contacts Developers';
      }
    }  else {
      return 'Your Client ID has Expired, Contacts Developers for more Informations';
    }     
  },
}