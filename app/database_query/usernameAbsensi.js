import { newListValueData } from '../database/new_query/data_list_query.js';
import { readUser } from '../../json_data_file/user_data/read_data_from_dir.js';

let date = new Date();

export async function usernameAbsensi(clientName, clientType) {
  
  return new Promise(async (resolve, reject) => {
  
    try {
      
      let userActive = 0;
      let userRows = [];

      await readUser(clientName).then(
        data =>{
              userRows = data;
              for (let i = 0; i < data.length; i++) {            
                if (data[i].STATUS === 'TRUE'){
                  userActive++;
                }
              }
            }
      )
      
      let userString = '';
      let userCounter = 0;

      await newListValueData(clientName, 'DIVISI').then(
        divisiList => {

          for (let i = 0; i < divisiList.length; i++) {
        
            let divisiCounter = 0;
            let userByDivisi = '';

            for (let ii = 0; ii < userRows.length; ii++) {            
              if (divisiList[i] === userRows[ii].DIVISI) {
                if(userRows[ii].STATUS === "TRUE"){
                  if (userRows[ii][clientType] === null || userRows[ii][clientType] === undefined || userRows[ii][clientType] === "" ) {
                    if (clientType === "RES"){
                      userByDivisi = userByDivisi.concat('\n' + userRows[ii].TITLE + ' ' + userRows[ii].NAMA);
                      divisiCounter++;
                      userCounter++;
                    } else {
                      userByDivisi = userByDivisi.concat('\n'+ userRows[ii].NAMA);
                      divisiCounter++;
                      userCounter++;          
                    }
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
        message: "Absensi Fail No Data",
        state: false,
        code: 303
      };
      reject (responseData);
    }
  });
}