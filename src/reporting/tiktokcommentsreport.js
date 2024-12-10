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
  reportTiktokComments: async function reportTiktokComments(sheetName, userClientID, clientID, tiktokOfficialID, tiktokCommentsUsernameID){

    console.log("Executing Functions");
    const d = new Date();
    const localDate = d.toLocaleDateString('id');

    const userClientDoc = new GoogleSpreadsheet(userClientID, googleAuth);//Google Authentication for user client DB
    await userClientDoc.loadInfo(); // loads document properties and worksheets

    const clientDoc = new GoogleSpreadsheet(clientID, googleAuth);//Google Authentication for client DB
    await clientDoc.loadInfo(); // loads document properties and worksheets

    const tiktokOfficialDoc = new GoogleSpreadsheet(tiktokOfficialID, googleAuth);//Google Authentication for InstaOfficial DB
    await tiktokOfficialDoc.loadInfo(); // loads document properties and worksheets

    const tiktokCommentsUsernameDoc= new GoogleSpreadsheet(tiktokCommentsUsernameID, googleAuth);//Google Authentication for instaLikes Username DB

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

        await tiktokOfficialDoc.loadInfo(); // loads document properties and worksheets

        const tiktokOfficialSheet = tiktokOfficialDoc.sheetsByTitle[sheetName];
        const tiktokOfficialData= await tiktokOfficialSheet.getRows();

        let shortcodeListString = '';

        for (let i = 0; i < tiktokOfficialData.length; i++){
            let itemDate = new Date(tiktokOfficialData[i].get('TIMESTAMP')*1000);
            if(itemDate.toLocaleDateString('id') === localDate){
                if (!shortcodeList.includes(tiktokOfficialData[i].get('SHORTCODE'))){
                    shortcodeList.push(tiktokOfficialData[i].get('SHORTCODE'));
                    shortcodeListString = shortcodeListString.concat('\nhttps://tiktok.com/video/'+tiktokOfficialData[i].get('SHORTCODE'));  
                }
            }
        }

        await tiktokCommentsUsernameDoc.loadInfo(); // loads document properties and worksheets
        let tiktokCommentsUsernameSheet = await tiktokCommentsUsernameDoc.sheetsByTitle[sheetName];
        let tiktokCommentsUsernameData = await tiktokCommentsUsernameSheet.getRows();

        let userCommentData = [];
        
        for (let i = 0; i < shortcodeList.length; i++){
          //code on the go
          for (let ii = 0; ii < tiktokCommentsUsernameData.length; ii++){
                if (tiktokCommentsUsernameData[ii].get('SHORTCODE') === shortcodeList[i]){
                    const fromRows = Object.values(tiktokCommentsUsernameData[ii].toObject());
                    for (let iii = 1; iii < fromRows.length; iii++){
                        if(fromRows[iii] != undefined || fromRows[iii] != null || fromRows[iii] != ""){
                            if(!userCommentData.includes(fromRows[iii])){
                                userCommentData.push(fromRows[iii]);
                            }
                        }
                    }        
                }
            }
        }

        let userNotComment = [];
        let notCommentList = [];

        for (let iii = 1; iii < userClientData.length; iii++){
            if(!userCommentData.includes(userClientData[iii].get('TIKTOK').replaceAll('@', ''))){
                if(!userNotComment.includes(userClientData[iii].get('ID_KEY'))){    
                    userNotComment.push(userClientData[iii].get('ID_KEY'));
                    notCommentList.push(userClientData[iii]);
                }
            }
        }

        let dataTiktok = '';
        let userCounter = 0;
  
        for (let iii = 0; iii < divisiList.length; iii++){
        
            let divisiCounter = 0 ;
            let userByDivisi = '';
  
            for (let iv = 0; iv < notCommentList.length; iv++){
                if(divisiList[iii] === notCommentList[iv].get('DIVISI')){
                    userByDivisi = userByDivisi.concat('\n'+notCommentList[iv].get('TITLE') +' '+notCommentList[iv].get('NAMA')+' - '+notCommentList[iv].get('TIKTOK'));
                    divisiCounter++;
                    userCounter++;
                }  
            }
            
            if ( divisiCounter != 0){
                dataTiktok = dataTiktok.concat('\n\n*'+divisiList[iii]+'* : '+divisiCounter+' User\n'+userByDivisi);
            }
        }
  
        let tiktokSudah = userClientData.length-notCommentList.length;
  
        let response = "*"+sheetName+"*\n\nInformasi Rekap Data yang belum melaksanakan likes dan komentar pada konten TikTok :\n"+shortcodeListString+"\n\nWaktu Rekap : "+localDate+"\n\nDengan Rincian Data sbb:\n\nJumlah User : "
        +userClientData.length+" \nJumlah User Sudah melaksanakan: "+tiktokSudah+"\nJumlah User Belum melaksanakan : "
        +userCounter+"\n\nRincian Data Username Tiktok :"+dataTiktok+"\n\n_System Administrator Cicero_";
        
        return response;

      } catch (error) {
        console.log(error);
        return 'Error, Contacts Developers';
      }
    }  else {
      return 'Your Client ID has Expired, Contacts Developers for more Informations';
    }     
  },
}