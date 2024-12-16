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

    console.log("Report Function Executed");

    const d = new Date();
    const localDate = d.toLocaleDateString('id');
    const hours = d.toLocaleTimeString('id');

    const userClientDoc = new GoogleSpreadsheet(userClientID, googleAuth);//Google Authentication for user client DB

    const clientDoc = new GoogleSpreadsheet(clientID, googleAuth);//Google Authentication for client DB

    const instaOfficialDoc = new GoogleSpreadsheet(instaOfficialID, googleAuth);//Google Authentication for InstaOfficial DB

    const instaLikesUsernameDoc= new GoogleSpreadsheet(instaLikesUsernameID, googleAuth);//Google Authentication for instaLikes Username DB

    //Check Client_ID. then get async data
    let isClientID = false;
    let isStatus;
    let isType;

    await clientDoc.loadInfo(); // loads document properties and worksheets
 
    const clientDataSheet = clientDoc.sheetsByTitle['ClientData'];
    const rowsClientData = await clientDataSheet.getRows();

    for (let i = 0; i < rowsClientData.length; i++){
      if (rowsClientData[i].get('CLIENT_ID') === sheetName){
        isClientID = true;
        isStatus = rowsClientData[i].get('STATUS');
        isType = rowsClientData[i].get('TYPE') 
      }
    }

    // If Client_ID exist. then get official content
    if (isClientID && isStatus){    
      try {

        await userClientDoc.loadInfo(); // loads document properties and worksheets
        let userClientSheet = userClientDoc.sheetsByTitle[sheetName];
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

        if(shortcodeList.length >= 1){

          await instaLikesUsernameDoc.loadInfo(); // loads document properties and worksheets
          let instaLikesUsernameSheet = instaLikesUsernameDoc.sheetsByTitle[sheetName];
          let instaLikesUsernameData = await instaLikesUsernameSheet.getRows();

          let userLikesData = [];
          
          for (let i = 0; i < shortcodeList.length; i++){
            //code on the go
            for (let ii = 0; ii < instaLikesUsernameData.length; ii++){
              if (instaLikesUsernameData[ii].get('SHORTCODE') === shortcodeList[i]){
        
                const fromRows = Object.values(instaLikesUsernameData[ii].toObject());
                
                for (let iii = 0; iii < fromRows.length; iii++){

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

          for (let iii = 0; iii < userClientData.length; iii++){
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
                if (isType === "RES"){
                  userByDivisi = userByDivisi.concat('\n'+notLikesList[iv].get('TITLE') +' '+notLikesList[iv].get('NAMA')+' - '+notLikesList[iv].get('INSTA'));
                  divisiCounter++;
                  userCounter++;
                } else if(isType === "COM"){
                  userByDivisi = userByDivisi.concat('\n'+notLikesList[iv].get('NAMA')+' - '+notLikesList[iv].get('INSTA'));
                  divisiCounter++;
                  userCounter++;
                }
              }  
            }
            
            if ( divisiCounter != 0){
              dataInsta = dataInsta.concat('\n\n*'+divisiList[iii]+'* : '+divisiCounter+' User\n'+userByDivisi);
            }
          }
    
          let instaSudah = userClientData.length-notLikesList.length;
          let responseData;
          if (isType === 'COM'){

            responseData = {
              message : "*"+sheetName+"*\n\nInformasi Rekap Data yang belum melaksanakan likes pada "+shortcodeList.length+" konten Instagram :\n"+shortcodeListString+
              "\n\nWaktu Rekap : "+localDate+"\nJam : "+hours+" WIB\n\nDengan Rincian Data sbb:\n\n_Jumlah User : "
              +userClientData.length+"_\n_Jumlah User Sudah melaksanakan: "+instaSudah+"_\n_Jumlah User Belum melaksanakan : "
              +userCounter+"_\n\n*Rincian Yang Belum Melaksanakan :*"+dataInsta+"\n\n_System Administrator Cicero_",
              state : true,
              code : 1
            }

          } else if(isType === "RES"){

            responseData = {
              message : "Mohon Ijin Komandan,\n\nMelaporkan Rekap Pelaksanaan Likes Pada "+shortcodeList.length+" Konten dari akun Resmi Instagram *POLRES "+sheetName+
              "* dengan Link konten sbb : \n"+shortcodeListString+"\n\nWaktu Rekap : "+localDate+"\nJam : "+hours+" WIB\n\nDengan Rincian Data sbb:\n\n_Jumlah User : "
              +userClientData.length+"_\n_Jumlah User Sudah melaksanakan: "+instaSudah+"_\n_Jumlah User Belum melaksanakan : "
              +userCounter+"_\n\n*Rincian Yang Belum Melaksanakan :*"+dataInsta+"\n\n_System Administrator Cicero_",
              state : true,
              code : 1
            }

          }
          userClientDoc.delete;
          clientDoc.delete;
          instaOfficialDoc.delete;
          instaLikesUsernameDoc.delete;
          return responseData;

        } else {
          responseData = {
            message : "Tidak ada konten data untuk di olah",
            state : true,
            code : 1
          }
          userClientDoc.delete;
          clientDoc.delete;
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
        userClientDoc.delete;
        clientDoc.delete;
        instaOfficialDoc.delete;
        instaLikesUsernameDoc.delete;
        return responseData; 
      }
    }  else {

      let responseData = {
        message : 'Your Client ID has Expired, Contacts Developers for more Informations',
        state : true,
        code : 1
      }
 
      userClientDoc.delete;
      clientDoc.delete;
      instaOfficialDoc.delete;
      instaLikesUsernameDoc.delete;
 
      return responseData;

    }    
  },
}