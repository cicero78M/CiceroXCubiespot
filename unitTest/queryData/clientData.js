import { readFileSync } from 'fs';
import { sheetDoc } from './sheetDoc.js';

const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));


export async function clientData(clientName) {

    let isClientID = false;
    let isStatus;
    let tiktokAccount;
    let isClientType;
    let instaAccount;

    const clientDoc =  await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData', clientName);
    const clientRows = clientDoc.data;

    for (let i = 0; i < clientRows.length; i++){
      if (clientRows[i].get('CLIENT_ID') === clientName){
        isClientID = true;
        isStatus = clientRows[i].get('STATUS');
        isClientType = clientRows[i].get('TYPE');
        tiktokAccount = clientRows[i].get('TIKTOK');
        instaAccount = clientRows[i].get('INSTA');

        let response = {
            data : {isClientID:isClientID, isStatus:isStatus, isClientType:isClientType, tiktokAccount:tiktokAccount, instaAccount:instaAccount},
            state : true,
            code : 200
          }

          return response;
      }
    } 

    if (!isClientID){

        let response = {
            data : null,
            state : false,
            code : 404
          }

          return response;

    }
    
}


