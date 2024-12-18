const fs = require('fs');
const sheetDoc = require('../../queryData/sheetDoc');

const ciceroKey = JSON.parse (fs.readFileSync('ciceroKey.json'));

module.exports = {  
  tiktokCommentsReport: async function tiktokCommentsReport(clientName){

    console.log("Report Tiktok Function Executed");

    const d = new Date();
    const localDate = d.toLocaleDateString('id');
    const localHours = d.toLocaleTimeString('id');

    //Check Client_ID. then get async data
    let isClientID = false;
    let isStatus;
    let tiktokAccount;
    let isClientType;
    
    const clientDoc = await sheetDoc.sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
    const clientRows = clientDoc.data;

    for (let i = 0; i < clientRows.length; i++){
      if (clientRows[i].get('CLIENT_ID') === clientName){
        isClientID = true;
        isStatus = clientRows[i].get('STATUS');
        isClientType = clientRows[i].get('TYPE');
        tiktokAccount = clientRows[i].get('TIKTOK');
      }
    }

    // If Client_ID exist. then get official content
    if (isClientID && isStatus){    
      try {

        let userDoc = await sheetDoc.sheetDoc(ciceroKey.dbKey.userDataID, clientName);
        let userRows = userDoc.data;
        
        let divisiList = [];

        for (let i = 0; i < userRows.length; i++){
          if(!divisiList.includes(userRows[i].get('DIVISI'))){
            divisiList.push(userRows[i].get('DIVISI')); 
          }
        }

        //Collect Shortcode from Database        
        let shortcodeList = [];

        const tiktokOfficialDoc = await sheetDoc.sheetDoc(ciceroKey.dbKey.tiktokOfficialID, clientName);
        const tiktokOfficialRows = tiktokOfficialDoc.data; 

        let shortcodeListString = '';

        for (let i = 0; i < tiktokOfficialRows.length; i++){
          let itemDate = new Date(tiktokOfficialRows[i].get('TIMESTAMP')*1000);
          if(itemDate.toLocaleDateString('id') === localDate){
            if (!shortcodeList.includes(tiktokOfficialRows[i].get('SHORTCODE'))){
              shortcodeList.push(tiktokOfficialRows[i].get('SHORTCODE'));
              shortcodeListString = shortcodeListString.concat('\nhttps://tiktok.com/'+tiktokAccount+'/video/'+tiktokOfficialRows[i].get('SHORTCODE'));  
            }
          }
        }

        let tiktokUsernameDoc = await sheetDoc.sheetDoc(ciceroKey.dbKey.tiktokCommentsUsernameID, clientName);
        let tiktokCommentsUsernameRows = tiktokUsernameDoc.data;

        let userCommentData = [];
        
        for (let i = 0; i < shortcodeList.length; i++){
          //code on the go
          for (let ii = 0; ii < tiktokCommentsUsernameRows.length; ii++){
            if (tiktokCommentsUsernameRows[ii].get('SHORTCODE') === shortcodeList[i]){

              const fromRows = Object.values(tiktokCommentsUsernameRows[ii].toObject());
              
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

        for (let iii = 1; iii < userRows.length; iii++){
          if(!userCommentData.includes(userRows[iii].get('TIKTOK').replaceAll('@', ''))){
            if(!userNotComment.includes(userRows[iii].get('ID_KEY'))){    
              userNotComment.push(userRows[iii].get('ID_KEY'));
              notCommentList.push(userRows[iii]);
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
        
        let tiktokSudah = userRows.length-notCommentList.length;
        let responseData;

        if (isClientType === "RES"){
          responseData = {
            data : "Mohon Ijin Komandan,\n\nMelaporkan Rekap Pelaksanaan Komentar dan Likes Pada "+shortcodeList.length+" Konten dari akun Resmi Tik Tok *POLRES "+clientName
            +"* dengan Link konten sbb ::\n"+shortcodeListString+"\n\nWaktu Rekap : "+localDate+"\nJam : "+localHours+" WIB\n\nDengan Rincian Data sbb:\n\n_Jumlah User : "
            +userRows.length+"_\n_Jumlah User Sudah melaksanakan: "+tiktokSudah+"_\n_Jumlah User Belum melaksanakan : "
            +userCounter+"_\n\nRincian Data Username Tiktok :"+dataTiktok+"\n\n_System Administrator Cicero_",
            state : true,
            code : 200
          }
        } else if (isClientType === "RES"){
          responseData = {
            data : "*"+clientName+"*\n\nRekap Pelaksanaan Komentar dan Likes Pada "+shortcodeList.length+" Konten dari akun Resmi Tik Tok "+tiktokAccount
            +" dengan Link konten sbb :\n"+shortcodeListString+"\n\nWaktu Rekap : "+localDate+"\nJam : "+localHours+" WIB\n\nDengan Rincian Data sbb:\n\n_Jumlah User : "
            +userRows.length+"_\n_Jumlah User Sudah melaksanakan: "+tiktokSudah+"_\n_Jumlah User Belum melaksanakan : "
            +userCounter+"_\n\nRincian Data Username Tiktok :"+dataTiktok+"\n\n_System Administrator Cicero_",
            state : true,
            code : 200
          }
        }

        console.log('Return Success');

        return responseData;

      } catch (error) {

        let responseData = {
          data : error,
          state : false,
          code : 303
        }

        console.log('Return Success');

        return responseData; 
      }
    }  else {

      let responseData = {
        data : 'Your Client ID has Expired, Contacts Developers for more Informations',
        state : true,
        code : 200
      }
 
      console.log('Return Success');

      return responseData;
    }     
  },
}