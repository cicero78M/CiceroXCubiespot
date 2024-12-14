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
    let isStatus;
  
    const clientDataSheet = clientDoc.sheetsByTitle['ClientData'];
    const rowsClientData = await clientDataSheet.getRows();

    for (let i = 0; i < rowsClientData.length; i++){
      if (rowsClientData[i].get('CLIENT_ID') === sheetName){
        isClientID = true;
        isStatus = rowsClientData[i].get('STATUS');
      }
    }

    // If Client_ID exist. then get official content
    if (isClientID && isStatus){    
      try {
        await userClientDoc.loadInfo(); // loads document properties and worksheets
        let userClientSheet = await userClientDoc.sheetsByTitle[sheetName];
        let userClientData = await userClientSheet.getRows();
        
        let divisiList = [];

        for (let i = 0; i < userClientData.length; i++){
            if(!divisiList.includes(userClientData[i].get('DIVISI'))){
                divisiList.push(userClientData[i].get('DIVISI')); 
            }
        }

        //Collect Shortcode from Database        
        let shortcodeList = [];

        await instaOfficialDoc.loadInfo(); // loads document properties and worksheets
        const instaOfficialSheet = instaOfficialDoc.sheetsByTitle[sheetName];
        const instaOfficialData = await instaOfficialSheet.getRows();

        let shortcodeListString = '';

        for (let i = 0; i < instaOfficialData.length; i++){
            let itemDate = new Date(instaOfficialData[i].get('TIMESTAMP')*1000);
            if(itemDate.toLocaleDateString('id') === localDate){
                if (!shortcodeList.includes(instaOfficialData[i].get('SHORTCODE'))){
                    shortcodeList.push(instaOfficialData[i].get('SHORTCODE'));

                    if (instaOfficialData[i].get('TYPE') === 'reel'){
                        shortcodeListString = shortcodeListString.concat('\nhttps://instagram.com/reel/'+instaOfficialData[i].get('SHORTCODE'));
                    } else {
                        shortcodeListString = shortcodeListString.concat('\nhttps://instagram.com/p/'+instaOfficialData[i].get('SHORTCODE'));
                    }
                }
            }
        }

        await instaLikesUsernameDoc.loadInfo(); // loads document properties and worksheets
        let instaLikesUsernameSheet = await instaLikesUsernameDoc.sheetsByTitle[sheetName];
        let instaLikesUsernameData = await instaLikesUsernameSheet.getRows();

        let userLikesData = [];
        
        for (let i = 0; i < shortcodeList.length; i++){
          //code on the go
          for (let ii = 0; ii < instaLikesUsernameData.length; ii++){
                if (instaLikesUsernameData[ii].get('SHORTCODE') === shortcodeList[i]){
                    const fromRows = Object.values(instaLikesUsernameData[ii].toObject());
                    for (let iii = 1; iii < fromRows.length; iii++){
                        if(fromRows[iii] != undefined || fromRows[iii] != null || fromRows[iii] != ""){
                            if(!userLikesData.includes(fromRows[iii])){
                                userLikesData.push(fromRows[iii]);
                            }
                        }
                    }        
                }
            }
        }

        let UserNotLikes = [];
        let notLikesList = [];

        for (let iii = 1; iii < userClientData.length; iii++){
            if(!userLikesData.includes(userClientData[iii].get('INSTA'))){
                if(!UserNotLikes.includes(userClientData[iii].get('ID_KEY'))){    
                    UserNotLikes.push(userClientData[iii].get('ID_KEY'));
                    notLikesList.push(userClientData[iii]);
                }
            }
        }

        let dataInsta = '';
        let userCounter = 0;
  
        for (let iii = 0; iii < divisiList.length; iii++){
        
            let divisiCounter = 0 ;
            let userByDivisi = '';
  
            for (let iv = 0; iv < notLikesList.length; iv++){
                if(divisiList[iii] === notLikesList[iv].get('DIVISI')){
                    userByDivisi = userByDivisi.concat('\n'+notLikesList[iv].get('TITLE') +' '+notLikesList[iv].get('NAMA')+' - '+notLikesList[iv].get('INSTA'));
                    divisiCounter++;
                    userCounter++;
                }  
            }
            
            if ( divisiCounter != 0){
                dataInsta = dataInsta.concat('\n\n*'+divisiList[iii]+'* : '+divisiCounter+' User\n'+userByDivisi);
            }
        }
  
        let instaSudah = userClientData.length-notLikesList.length;
        let responseData = {
          message : "*"+sheetName+"*\n\nInformasi Rekap Data yang belum melaksanakan likes pada konten Instagram :\n"+shortcodeListString+"\n\nWaktu Rekap : "+localDate+"\n\nDengan Rincian Data sbb:\n\nJumlah User : "
          +userClientData.length+" \nJumlah User Sudah melaksanakan: "+instaSudah+"\nJumlah User Belum melaksanakan : "
          +userCounter+"\n\nRincian Data Username Insta :"+dataInsta+"\n\n_System Administrator Cicero_",
          state : true,
          code : 1
        }

        return responseData;

      } catch (error) {
        
        let responseData = {
          message : error,
          state : false,
          code : 0
        }
  
        return responseData; 
      }
    }  else {

      let responseData = {
        message : 'Your Client ID has Expired, Contacts Developers for more Informations',
        state : true,
        code : 1
      }

      return responseData;
    }     
  },
}