//Google Spreadsheet
import { readFileSync } from 'fs';
import { sheetDoc as _sheetDoc } from '../../queryData/sheetDoc.js';
import { listValueData } from '../../queryData/listValueData.js';
import { clientData } from '../../queryData/clientData.js';

const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));

export async function reportInstaLikes(clientName) {

  console.log("Insta Report Function Executed");

  const d = new Date();
  const localDate = d.toLocaleDateString('id');
  const hours = d.toLocaleTimeString('id');

  //Check Client_ID. then get async data

  const clientResponse = await clientData(clientName);

  // If Client_ID exist. then get official content
  if (clientResponse.data.isClientID && clientResponse.data.isStatus) {
    try {

      let divisiResponse = await listValueData(clientName, 'DIVISI');
      let divisiList = divisiResponse.data;

      let userDoc = await _sheetDoc(ciceroKey.dbKey.userDataID, clientName);
      let userRows = userDoc.data;

      //Collect Shortcode from Database        
      let shortcodeList = [];

      const instaOfficialDoc = await _sheetDoc(ciceroKey.dbKey.instaOfficialID, clientName);
      const instaOfficialRows = instaOfficialDoc.data;

      let shortcodeListString = '';

      for (let i = 0; i < instaOfficialRows.length; i++) {

        let itemDate = new Date(instaOfficialRows[i].get('TIMESTAMP') * 1000);

        if (itemDate.toLocaleDateString('id') === localDate) {
          if (!shortcodeList.includes(instaOfficialRows[i].get('SHORTCODE'))) {

            shortcodeList.push(instaOfficialRows[i].get('SHORTCODE'));

            if (instaOfficialRows[i].get('TYPE') === 'reel') {
              shortcodeListString = shortcodeListString.concat('\nhttps://instagram.com/reel/' + instaOfficialRows[i].get('SHORTCODE'));
            } else {
              shortcodeListString = shortcodeListString.concat('\nhttps://instagram.com/p/' + instaOfficialRows[i].get('SHORTCODE'));
            }

          }
        }
      }

      if (shortcodeList.length >= 1) {

        let instaLikesUsernameDoc = await _sheetDoc(ciceroKey.dbKey.instaLikesUsernameID, clientName);
        let instaLikesUsernameRows = instaLikesUsernameDoc.data;

        let userLikesData = [];

        for (let i = 0; i < shortcodeList.length; i++) {
          //code on the go
          for (let ii = 0; ii < instaLikesUsernameRows.length; ii++) {
            if (instaLikesUsernameRows[ii].get('SHORTCODE') === shortcodeList[i]) {

              const fromRows = Object.values(instaLikesUsernameRows[ii].toObject());

              for (let iii = 0; iii < fromRows.length; iii++) {

                if (fromRows[iii] != undefined || fromRows[iii] != null || fromRows[iii] != "") {

                  if (!userLikesData.includes(fromRows[iii])) {
                    userLikesData.push(fromRows[iii]);
                  }
                }
              }
            }
          }
        }

        let UserNotLikes = [];
        let notLikesList = [];

        for (let iii = 0; iii < userRows.length; iii++) {
          if (!userLikesData.includes(userRows[iii].get('INSTA'))) {
            if (!UserNotLikes.includes(userRows[iii].get('ID_KEY'))) {
              if(userRows[iii].get('STATUS') === 'TRUE' && userRows[iii].get('EXCEPTION') === "FALSE"){
                
                UserNotLikes.push(userRows[iii].get('ID_KEY'));
                notLikesList.push(userRows[iii]);
                
              }
            }
          }
        }

        let dataInsta = '';
        let userCounter = 0;

        for (let iii = 0; iii < divisiList.length; iii++) {

          let divisiCounter = 0;
          let userByDivisi = '';

          for (let iv = 0; iv < notLikesList.length; iv++) {
            if (divisiList[iii] === notLikesList[iv].get('DIVISI')) {
              
              if (clientResponse.data.isClientType === "RES") {
                userByDivisi = userByDivisi.concat('\n' + notLikesList[iv].get('TITLE') + ' ' + notLikesList[iv].get('NAMA') + ' - ' + notLikesList[iv].get('INSTA'));
                divisiCounter++;
                userCounter++;
              } else if (clientResponse.data.isClientType === "COM") {
                userByDivisi = userByDivisi.concat('\n' + notLikesList[iv].get('NAMA') + ' - ' + notLikesList[iv].get('INSTA'));
                divisiCounter++;
                userCounter++;
              }
            }
          }

          if (divisiCounter != 0) {
            dataInsta = dataInsta.concat('\n\n*' + divisiList[iii] + '* : ' + divisiCounter + ' User\n' + userByDivisi);
          }

        }

        let instaSudah = userRows.length - notLikesList.length;
        let responseData;

        if (clientResponse.data.isClientType === 'COM') {

          responseData = {
            data: "*" + clientName + "*\n\nInformasi Rekap Data yang belum melaksanakan likes pada " + shortcodeList.length + " konten Instagram :\n" + shortcodeListString +
              "\n\nWaktu Rekap : " + localDate + "\nJam : " + hours + " WIB\n\nDengan Rincian Data sbb:\n\n_Jumlah User : "
              + userRows.length + "_\n_Jumlah User Sudah melaksanakan: " + instaSudah + "_\n_Jumlah User Belum melaksanakan : "
              + userCounter + "_\n\n*Rincian Yang Belum Melaksanakan :*" + dataInsta + "\n\n_System Administrator Cicero_",
            state: true,
            code: 202
          };

        } else if (clientResponse.data.isClientType === "RES") {

          responseData = {
            data: "Mohon Ijin Komandan,\n\nMelaporkan Rekap Pelaksanaan Likes Pada " + shortcodeList.length + " Konten dari akun Resmi Instagram *POLRES " + clientName +
              "* dengan Link konten sbb : \n" + shortcodeListString + "\n\nWaktu Rekap : " + localDate + "\nJam : " + hours + " WIB\n\nDengan Rincian Data sbb:\n\n_Jumlah User : "
              + userRows.length + "_\n_Jumlah User Sudah melaksanakan: " + instaSudah + "_\n_Jumlah User Belum melaksanakan : "
              + userCounter + "_\n\n*Rincian Yang Belum Melaksanakan :*" + dataInsta + "\n\n_System Administrator Cicero_",
            state: true,
            code: 202
          };

        }

        console.log('Return Success');

        return responseData;

      } else {

        let responseData = {
          data: "Tidak ada konten data untuk di olah",
          state: true,
          code: 200
        };

        console.log('Return No Content');
        return responseData;

      }
    } catch (error) {

      let responseData = {
        data: error,
        state: false,
        code: 303
      };

      console.log(error);
      return responseData;

    }

  } else {

    let responseData = {
      data: 'Your Client ID has Expired, Contacts Developers for more Informations',
      state: true,
      code: 200
    };

    console.log('Return Expired ID');
    return responseData;

  }
}