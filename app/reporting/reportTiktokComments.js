import { sheetDoc as _sheetDoc, ciceroKey } from '../database_query/sheetDoc.js';
import { listValueData } from '../database_query/listValueData.js';
  
export async function reportTiktokComments(clientValue) {
    try {
          //Date Time
      let d = new Date();
      let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
      let hours = d.toLocaleTimeString("en-US", {timeZone: "Asia/Jakarta"}); 
      console.log("Report Tiktok Function Executed");

      const clientName = clientValue.get('CLIENT_ID');
      const tiktokAccount = clientValue.get('TIKTOK');

      if (clientValue.get('STATUS') === 'TRUE') {

        // If Client_ID exist. then get official content
            let divisiResponse = await listValueData(clientName, 'DIVISI');
            let divisiList = divisiResponse.data;
            let userDoc = await _sheetDoc(ciceroKey.dbKey.userDataID, clientName);
            let userRows =  userDoc.data;
            var userAll = 0;

            for (let i = 0; i < userRows.length; i++) {
              if (userRows[i].get('STATUS') === 'TRUE' ){
                userAll++;
              }
            }
            //Collect Shortcode from Database        
            let shortcodeList = [];
            const tiktokOfficialDoc = _sheetDoc(ciceroKey.dbKey.tiktokOfficialID, clientName).then (
              
            )
            const tiktokOfficialRows = tiktokOfficialDoc.data;
            let shortcodeListString = '';
            for (let i = 0; i < tiktokOfficialRows.length; i++) {
              let itemDate = new Date(tiktokOfficialRows[i].get('TIMESTAMP') * 1000);
              if (itemDate.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"}) === localDate) {
                if (!shortcodeList.includes(tiktokOfficialRows[i].get('SHORTCODE'))) {
                  shortcodeList.push(tiktokOfficialRows[i].get('SHORTCODE'));
                  shortcodeListString = shortcodeListString.concat('\nhttps://tiktok.com/' + tiktokAccount + '/video/' + tiktokOfficialRows[i].get('SHORTCODE'));
                }
              }
            }
            if (shortcodeList.length >= 1) {
              let tiktokUsernameDoc =  _sheetDoc(ciceroKey.dbKey.tiktokCommentUsernameID, clientName);
              let tiktokCommentsUsernameRows = tiktokUsernameDoc.data;
              let userCommentData = [];
              for (let i = 0; i < shortcodeList.length; i++) {
                //code on the go
                for (let ii = 0; ii < tiktokCommentsUsernameRows.length; ii++) {
                  if (tiktokCommentsUsernameRows[ii].get('SHORTCODE') === shortcodeList[i]) {
                    const fromRows = Object.values(tiktokCommentsUsernameRows[ii].toObject());
                    for (let iii = 0; iii < fromRows.length; iii++) {
                      if (fromRows[iii] != undefined || fromRows[iii] != null || fromRows[iii] != "") {
                        if (!userCommentData.includes(fromRows[iii])) {
                          userCommentData.push(fromRows[iii]);
                        }
                      }
                    }
                  }
                }
              }
              let userNotComment = [];
              let notCommentList = [];
              for (let iii = 0; iii < userRows.length; iii++) {
                if (!userCommentData.includes(userRows[iii].get('TIKTOK').replaceAll('@', ''))) {
                  if (!userNotComment.includes(userRows[iii].get('ID_KEY'))) {
                    if (userRows[iii].get('STATUS') === 'TRUE' ){
                      if (userRows[iii].get('EXCEPTION') === "FALSE"){                   
                        userNotComment.push(userRows[iii].get('ID_KEY'));
                        notCommentList.push(userRows[iii]);
                      }
                    }
                  }
                }
              }
              let dataTiktok = '';
              let userCounter = 0;
              for (let iii = 0; iii < divisiList.length; iii++) {
                let divisiCounter = 0;
                let userByDivisi = '';
                for (let iv = 0; iv < notCommentList.length; iv++) {
                  if (divisiList[iii] === notCommentList[iv].get('DIVISI')) {
                    if (clientValue.get('TYPE') === "RES") {

                    userByDivisi = userByDivisi.concat('\n' + notCommentList[iv].get('TITLE') + ' ' + notCommentList[iv].get('NAMA') + ' - ' + notCommentList[iv].get('TIKTOK'));
                    divisiCounter++;
                    userCounter++;
                    } else if (clientValue.get('TYPE')  === "COM") {

                      let name = notCommentList[iv].get('NAMA');
                      let nameUpper = name.toUpperCase();
                      userByDivisi = userByDivisi.concat('\n' + nameUpper + ' - ' + notCommentList[iv].get('TIKTOK'));
                      divisiCounter++;
                      userCounter++;
                    }

                  }
                }
                if (divisiCounter != 0) {
                  dataTiktok = dataTiktok.concat('\n\n*' + divisiList[iii] + '* : ' + divisiCounter + ' User\n' + userByDivisi);
                }
              }
              let tiktokSudah = userAll - notCommentList.length;
              let responseData;
              if (clientValue.get('TYPE')  === "RES") {
                responseData = {
                  data: "Mohon Ijin Komandan,\n\nMelaporkan Rekap Pelaksanaan Komentar dan Likes Pada " + shortcodeList.length + " Konten dari akun Resmi Tik Tok *POLRES " 
                    + clientName + "* dengan Link konten sbb ::\n" + shortcodeListString + "\n\nWaktu Rekap : " + localDate + "\nJam : " 
                    + hours + "\n\nDengan Rincian Data sbb:\n\n_Jumlah User : "+ userAll + "_\n_Jumlah User Sudah melaksanakan: " + tiktokSudah 
                    + "_\n_Jumlah User Belum melaksanakan : "+ userCounter + "_\n\nRincian Data Username Tiktok :" + dataTiktok + "\n\n_System Administrator Cicero_",
                  state: true,
                  code: 200
                };
              } else if (clientValue.get('TYPE')  === "COM") {
                responseData = {
                  data: "*" + clientName + "*\n\nRekap Pelaksanaan Komentar dan Likes Pada " + shortcodeList.length + " Konten dari akun Resmi Tik Tok " 
                    + clientName+ " dengan Link konten sbb :\n" + shortcodeListString + "\n\nWaktu Rekap : " + localDate + "\nJam : " 
                    + hours + "\n\nDengan Rincian Data sbb:\n\n_Jumlah User : "+ userAll + "_\n_Jumlah User Sudah melaksanakan: " 
                    + tiktokSudah + "_\n_Jumlah User Belum melaksanakan : "+ userCounter + "_\n\nRincian Data Username Tiktok :" 
                    + dataTiktok + "\n\n_System Administrator Cicero_",
                  state: true,
                  code: 200
                };
              }
              console.log('Return Success');
              return responseData;
            } else {
              let responseData = {
                data: 'Tidak ada Konten Data untuk di Olah',
                state: true,
                code: 201
              };
              console.log(responseData.data);
              return responseData;
            }
        } else {
          let responseData = {
            data: 'Your Client ID has Expired, Contacts Developers for more Informations',
            state: true,
            code: 201
          };
          console.log(responseData.data);
          return responseData;
        }

    } catch (error) {
      let responseData = {
        data: error,
        state: false,
        code: 303
      };
      console.log(responseData.data);
      return responseData;
    }
    

}