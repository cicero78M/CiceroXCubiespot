import { readFileSync } from 'fs';
import { sheetDoc } from '../database_query/sheetDoc.js';
import { listValueData } from '../database_query/listValueData.js';

let date = new Date();

const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));

export async function usernameAbsensi(clientName, clientType) {
  try {
    const userDoc = await sheetDoc(ciceroKey.dbKey.userDataID, clientName);
    const userRows = userDoc.data;
    let userActive = 0;
    for (let i = 0; i < userRows.length; i++) {            
      if (userRows[i].get("STATUS") === 'TRUE'){
        userActive++;
      }
    }
    let divisiResponse = await listValueData(clientName, 'DIVISI');
    let divisiList = divisiResponse.data;

    let userString = '';
    let userCounter = 0;

    for (let i = 0; i < divisiList.length; i++) {
      let divisiCounter = 0;
      let userByDivisi = '';
      for (let ii = 0; ii < userRows.length; ii++) {            
          if (divisiList[i] === userRows[ii].get('DIVISI')) {
            if (userRows[ii].get(clientType) === null || userRows[ii].get(clientType) === undefined) {
              userByDivisi = userByDivisi.concat('\n' + userRows[ii].get('TITLE') + ' ' + userRows[ii].get('NAMA'));
              divisiCounter++;
              userCounter++;
            }
        }
      }

      if(userCounter != 0){
        userString = userString.concat('\n\n' + divisiList[i] + ' : ' + divisiCounter + ' User\n' + userByDivisi);
      }
    }

    let userDone = userActive - userCounter;
    let responseData = {
      data: "*" + clientName + "*\n\nInformasi Rekap Data username profile akun " + clientType + " sampai dengan\n\nWaktu Rekap : " + date + "\n\nDengan Rincian Data sbb:\n\nJumlah User : " + userActive + " \nJumlah User Sudah melengkapi: " + userDone + "\nJumlah User Belum melengkapi : " + userCounter + "\n\nRincian Data Username " + clientType + " :" + userString + "\n\n_System Administrator Cicero_",
      state: true,
      code: 200
    };
    console.log('Return Success');
    return responseData;
  } catch (error) {
    let responseData = {
      data: error,
      state: false,
      code: 303
    };
    console.log('Return Success');
    return responseData;
  }
}