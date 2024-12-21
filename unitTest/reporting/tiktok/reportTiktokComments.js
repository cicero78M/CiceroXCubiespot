import { readFileSync } from 'fs';
import { sheetDoc as _sheetDoc } from '../../queryData/sheetDoc.js';
import { clientData } from '../../queryData/clientData.js';

const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));

export async function reportTiktokComments(clientName) {

  console.log("Report Tiktok Function Executed");

  const d = new Date();
  const localDate = d.toLocaleDateString('id');
  const localHours = d.toLocaleTimeString('id');

  const clientResponse = await clientData(clientName);

  if (clientResponse.state) {

    // If Client_ID exist. then get official content
    if (clientResponse.data.isClientID && clientResponse.data.isStatus) {
      try {

        let userDoc = await _sheetDoc(ciceroKey.dbKey.userDataID, clientName);
        let userRows = userDoc.data;

        let divisiList = [];

        for (let i = 0; i < userRows.length; i++) {
          if (!divisiList.includes(userRows[i].get('DIVISI'))) {
            divisiList.push(userRows[i].get('DIVISI'));
          }
        }

        //Collect Shortcode from Database        
        let shortcodeList = [];

        const tiktokOfficialDoc = await _sheetDoc(ciceroKey.dbKey.tiktokOfficialID, clientName);
        const tiktokOfficialRows = tiktokOfficialDoc.data;

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
          let phoneList = [];

          for (let iii = 0; iii < userRows.length; iii++) {
            if (!userCommentData.includes(userRows[iii].get('TIKTOK').replaceAll('@', ''))) {
              if (!userNotComment.includes(userRows[iii].get('ID_KEY'))) {
                if (!phoneList.includes(userRows[iii].get('WHATSAPP'))) {
                  phoneList.push(userRows[iii].get('WHATSAPP'));
                }
                userNotComment.push(userRows[iii].get('ID_KEY'));
                notCommentList.push(userRows[iii]);
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
                userByDivisi = userByDivisi.concat('\n' + notCommentList[iv].get('TITLE') + ' ' + notCommentList[iv].get('NAMA') + ' - ' + notCommentList[iv].get('TIKTOK'));
                divisiCounter++;
                userCounter++;
              }
            }

            if (divisiCounter != 0) {
              dataTiktok = dataTiktok.concat('\n\n*' + divisiList[iii] + '* : ' + divisiCounter + ' User\n' + userByDivisi);
            }
          }

          let tiktokSudah = userRows.length - notCommentList.length;
          let responseData;

          if (isClientType === "RES") {
            responseData = {
              data: "Mohon Ijin Komandan,\n\nMelaporkan Rekap Pelaksanaan Komentar dan Likes Pada " + shortcodeList.length + " Konten dari akun Resmi Tik Tok *POLRES " + clientName
                + "* dengan Link konten sbb ::\n" + shortcodeListString + "\n\nWaktu Rekap : " + localDate + "\nJam : " + localHours + " WIB\n\nDengan Rincian Data sbb:\n\n_Jumlah User : "
                + userRows.length + "_\n_Jumlah User Sudah melaksanakan: " + tiktokSudah + "_\n_Jumlah User Belum melaksanakan : "
                + userCounter + "_\n\nRincian Data Username Tiktok :" + dataTiktok + "\n\n_System Administrator Cicero_",
              phone: phoneList,
              state: true,
              code: 202
            };
          } else if (isClientType === "RES") {
            responseData = {
              data: "*" + clientName + "*\n\nRekap Pelaksanaan Komentar dan Likes Pada " + shortcodeList.length + " Konten dari akun Resmi Tik Tok " + tiktokAccount
                + " dengan Link konten sbb :\n" + shortcodeListString + "\n\nWaktu Rekap : " + localDate + "\nJam : " + localHours + " WIB\n\nDengan Rincian Data sbb:\n\n_Jumlah User : "
                + userRows.length + "_\n_Jumlah User Sudah melaksanakan: " + tiktokSudah + "_\n_Jumlah User Belum melaksanakan : "
                + userCounter + "_\n\nRincian Data Username Tiktok :" + dataTiktok + "\n\n_System Administrator Cicero_",
              phone: phoneList,
              state: true,
              code: 202
            };
          }

          console.log('Return Success');

          return responseData;
        } else {

          let responseData = {
            data: 'Tidak ada Konten Data untuk di Olah',
            state: true,
            code: 200
          };

          console.log('Return No Data');

          return responseData;

        }
      } catch (error) {

        let responseData = {
          data: error,
          state: false,
          code: 303
        };

        console.log('Return Error');

        return responseData;
      }
    } else {

      let responseData = {
        data: 'Your Client ID has Expired, Contacts Developers for more Informations',
        state: true,
        code: 200
      };

      console.log('Return Client ID has Expire');

      return responseData;
    }

  } else {

    let responseData = {
      data: 'Client Name Doesn\'t Exist',
      state: false,
      code: 303
    };

    console.log('Return Client Name Doesn\'t Exis');

    return responseData;

  }
}