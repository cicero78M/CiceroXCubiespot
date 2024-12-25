import { readFileSync } from 'fs';
const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));

import { sheetDoc } from "../queryData/sheetDoc.js";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const googleAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: ciceroKey.client_email,
  key: ciceroKey.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});


export async function saveContacts() {
    const waContactDoc = new GoogleSpreadsheet(ciceroKey.dbKey.waContact, googleAuth); //Google Auth
    await waContactDoc.loadInfo(); // loads document properties and worksheets

    let whatsappList = [];
    let contactData = [];

    let clientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
    let clientRows = clientResponse.data;
    if (clientRows.length >= 1){
        for (let i = 0; i < clientRows.length; i++){
            if (clientRows[i].get('STATUS') === "TRUE") { 
                
                let userResponse = await sheetDoc(ciceroKey.dbKey.userDataID, clientRows[i].get('CLIENT_ID'));
                let userRows = userResponse.data;

                for (let ii = 0; ii < userRows.length; ii++){
                    if(userRows[ii].get('WHATSAPP') != clientRows[i].get('OPERATOR') || userRows[ii].get('WHATSAPP') != null|| userRows[ii].get('WHATSAPP') != undefined || userRows[ii].get('WHATSAPP') != "" ){
                        
                        if(!whatsappList.includes(userRows[ii].get('WHATSAPP'))){ 
                            whatsappList.push(userRows[ii].get('WHATSAPP'));
                            console.log('+'+userRows[ii].get('WHATSAPP'));
                            contactData.push({'FIRST NAME': userRows[ii].get('NAMA'), 'LAST NAME' : '',EMAIL : '', 'MOBILE PHONE': '+'+userRows[ii].get('WHATSAPP'), COMPANY:  clientRows[i].get('CLIENT_ID')});
                    
                        }
                    }
                }
            }
        }
        try {
            const waSheet = waContactDoc.sheetsByTitle['CONTACT'];
            waSheet.addRow(contactData);
    
            return 'SUCCESS!!!!';
        } catch (error) {
            console.log(error);
        }

    }    
}





