import { readFileSync } from 'fs';
import { sheetDoc as _sheetDoc } from '../database_query/sheetDoc.js';
import { clientData } from '../database_query/clientData.js';
import { listValueData } from '../database_query/listValueData.js';
const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));
export async function reportTiktokComments(clientName) {
  try {
    console.log("Report Tiktok Function Executed");
    const d = new Date();
    const localDate = d.toLocaleDateString('id');
    const localHours = d.toLocaleTimeString('id');
    const clientResponse = await clientData(clientName);

    if (clientResponse.state) {
      // If Client_ID exist. then get official content
      if (clientResponse.data.isClientID && clientResponse.data.isStatus) {
          let divisiResponse = await listValueData(clientName, 'DIVISI');
          let divisiList = divisiResponse.data;
          let userDoc = await _sheetDoc(ciceroKey.dbKey.userDataID, clientName);
          let userRows = await userDoc.data;
          var userAll = 0;
          for (let i = 0; i < userRows.length; i++) {
            if (userRows[i].get('STATUS') === 'TRUE' ){
              userAll++;
            }
          }
          //Collect Shortcode from Database        
          let shortcodeList = [];
          const tiktokOfficialDoc = await _sheetDoc(ciceroKey.dbKey.tiktokOfficialID, clientName);
          const tiktokOfficialRows = await tiktokOfficialDoc.data;
          let shortcodeListString = '';
          for (let i = 0; i < tiktokOfficialRows.length; i++) {
            let itemDate = new Date(tiktokOfficialRows[i].get('TIMESTAMP') * 1000);
            if (itemDate.toLocaleDateString('id') === localDate) {
              if (!shortcodeList.includes(tiktokOfficialRows[i].get('SHORTCODE'))) {
                shortcodeList.push(tiktokOfficialRows[i].get('SHORTCODE'));
                shortcodeListString = shortcodeListString.concat('\nhttps://tiktok.com/' + clientResponse.data.tiktokAccount + '/video/' + tiktokOfficialRows[i].get('SHORTCODE'));
              }
            }
          }
          if (shortcodeList.length >= 1) {
            let tiktokUsernameDoc = await _sheetDoc(ciceroKey.dbKey.tiktokCommentUsernameID, clientName);
            let tiktokCommentsUsernameRows = await tiktokUsernameDoc.data;
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
                  if (clientResponse.data.isClientType === "RES") {

                  userByDivisi = userByDivisi.concat('\n' + notCommentList[iv].get('TITLE') + ' ' + notCommentList[iv].get('NAMA') + ' - ' + notCommentList[iv].get('TIKTOK'));
                  divisiCounter++;
                  userCounter++;
                  } else if (clientResponse.data.isClientType === "COM") {

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
            if (clientResponse.data.isClientType === "RES") {
              responseData = {
                data: "Mohon Ijin Komandan,\n\nMelaporkan Rekap Pelaksanaan Komentar dan Likes Pada " + shortcodeList.length + " Konten dari akun Resmi Tik Tok *POLRES " 
                  + clientName + "* dengan Link konten sbb ::\n" + shortcodeListString + "\n\nWaktu Rekap : " + localDate + "\nJam : " 
                  + localHours + " WIB\n\nDengan Rincian Data sbb:\n\n_Jumlah User : "+ userAll + "_\n_Jumlah User Sudah melaksanakan: " + tiktokSudah 
                  + "_\n_Jumlah User Belum melaksanakan : "+ userCounter + "_\n\nRincian Data Username Tiktok :" + dataTiktok + "\n\n_System Administrator Cicero_",
                state: true,
                code: 200
              };
            } else if (clientResponse.data.isClientType === "COM") {
              responseData = {
                data: "*" + clientName + "*\n\nRekap Pelaksanaan Komentar dan Likes Pada " + shortcodeList.length + " Konten dari akun Resmi Tik Tok " 
                  + clientName+ " dengan Link konten sbb :\n" + shortcodeListString + "\n\nWaktu Rekap : " + localDate + "\nJam : " 
                  + localHours + " WIB\n\nDengan Rincian Data sbb:\n\n_Jumlah User : "+ userAll + "_\n_Jumlah User Sudah melaksanakan: " 
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
    } else {
      let responseData = {
        data: 'Client Name Doesn\'t Exist',
        state: false,
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