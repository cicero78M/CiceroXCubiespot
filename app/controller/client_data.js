import { readFileSync } from 'fs';
import { sheetDoc } from './sheetDoc.js';

const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));

export async function clientData(clientName) {

  try {
    let isClientID = false;
    let isStatus;
    let tiktokAccount;
    let isClientType;
    let instaAccount;
    let supervisor;
    let operator;
    let group;

    const clientDoc =  await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
    const clientRows = await clientDoc.data;
        
    for (let i = 0; i < clientRows.length; i++){
      if (clientRows[i].get('CLIENT_ID') === clientName){
        isClientID = true;
        isStatus = clientRows[i].get('STATUS');
        isClientType = clientRows[i].get('TYPE');
        tiktokAccount = clientRows[i].get('TIKTOK');
        instaAccount = clientRows[i].get('INSTAGRAM');
        supervisor = clientRows[i].get('SUPERVISOR');
        operator = clientRows[i].get('OPERATOR');
        group = clientRows[i].get('GROUP');

        let responseData = {
            data : {isClientID : isClientID, isStatus : isStatus, isClientType : isClientType, tiktokAccount : tiktokAccount, instaAccount : instaAccount, 
              supervisor : supervisor, operator : operator, group : group },
            state : true,
            code : 200
          }

          return responseData;
      }
    } 

    if (!isClientID){
      let responseData = {
          data : 'No Data',
          state : true,
          code : 201
      }
      console.log(responseData.data);
      return responseData;
    }
  } catch (error) {

    let responseData = {
      data : error,
      state : true,
      code : 303
    }
    console.log(responseData.data);

    return responseData;

  }
}