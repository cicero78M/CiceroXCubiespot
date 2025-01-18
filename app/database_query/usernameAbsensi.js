import { ciceroKey, newRowsData } from '../database/new_query/sheet_query.js';
import { newListValueData } from '../database/new_query/data_list_query.js';

let date = new Date();

export async function usernameAbsensi(clientName, clientType) {
  
  return new Promise(async (resolve, reject) => {
  
    try {
      
      let userActive = 0;

      await newRowsData(
        ciceroKey.dbKey.userDataID, 
        clientName
      ).then(
        userRows =>{
          for (let i = 0; i < userRows.length; i++) {            
            if (userRows[i].get("STATUS") === 'TRUE'){
              userActive++;
            }
          }
        }
      );
      
      let userString = '';
      let userCounter = 0;

      await newListValueData(clientName, 'DIVISI').then(
        divisiList => {

          for (let i = 0; i < divisiList.length; i++) {
        
            let divisiCounter = 0;
            let userByDivisi = '';
            for (let ii = 0; ii < userRows.length; ii++) {            
                if (divisiList[i] === userRows[ii].get('DIVISI')) {
                  if (userRows[ii].get(clientType) === null || userRows[ii].get(clientType) === undefined ||userRows[ii].get(clientType) === "" ) {
      
                    if (clientType === "RES"){
      
                      userByDivisi = userByDivisi.concat('\n' + userRows[ii].get('TITLE') + ' ' + userRows[ii].get('NAMA'));
                      divisiCounter++;
                      userCounter++;
      
                    } else {
      
                      userByDivisi = userByDivisi.concat('\n'+ userRows[ii].get('NAMA'));
                      divisiCounter++;
                      userCounter++;
                                      
                    }
      
                  }
              }
            }
      
            if(divisiCounter != 0){
              userString = userString.concat('\n\n' + divisiList[i] + ' : ' + divisiCounter + ' User\n' + userByDivisi);
            }
          }

        }
      )

      let userDone = userActive - userCounter;

      let responseData = {
        data: "*" + clientName + "*\n\nInformasi Rekap Data username profile akun " + clientType + " sampai dengan\n\nWaktu Rekap : " + date + "\n\nDengan Rincian Data sbb:\n\nJumlah User : " + userActive + " \nJumlah User Sudah melengkapi: " + userDone + "\nJumlah User Belum melengkapi : " + userCounter + "\n\nRincian Data Username " + clientType + " :" + userString + "\n\n_System Administrator Cicero_",
        state: true,
        code: 200
      };
    
      resolve (responseData);
    
    } catch (error) {
      let responseData = {
        data: error,
        state: false,
        code: 303
      };
      console.log('Return Success');
      reject (responseData);
    }

  })
  
}