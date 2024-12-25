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

    try {
    const waContactDoc = new GoogleSpreadsheet(ciceroKey.dbKey.waContact, googleAuth); //Google Auth
    await waContactDoc.loadInfo(); // loads document properties and worksheets

    let whatsappList = ['',];
    let contactData = [];

    let contactResponse = await sheetDoc(ciceroKey.dbKey.waContact, 'CONTACT');
    let contactRows = contactResponse.data;
    let contactList = [];

    for (let i = 0; i < contactRows.length; i++){
        
        if(!contactList.includes(contactRows[i].get('MOBILE PHONE'))){ 
            contactList.push(contactRows[i].get('MOBILE PHONE'));

        }
    }

    let clientResponse = await sheetDoc(ciceroKey.dbKey.clientDataID, 'ClientData');
    let clientRows = clientResponse.data;

    if (clientRows.length >= 1){
        for (let i = 0; i < clientRows.length; i++){
            
            let userResponse = await sheetDoc(ciceroKey.dbKey.userDataID, clientRows[i].get('CLIENT_ID'));
            let userRows = userResponse.data;

            for (let ii = 0; ii < userRows.length; ii++){
                if(userRows[ii].get('WHATSAPP') != clientRows[i].get('OPERATOR') || userRows[ii].get('WHATSAPP') != "" ){
                    
                    if(!whatsappList.includes(userRows[ii].get('WHATSAPP'))){ 
            
                        whatsappList.push(userRows[ii].get('WHATSAPP'));
                        contactData.push({'FIRST NAME': userRows[ii].get('NAMA').toUpperCase(), 'LAST NAME' : '',EMAIL : '', 'MOBILE PHONE': userRows[ii].get('WHATSAPP'), COMPANY:  clientRows[i].get('CLIENT_ID')});
                    }
                }
            }
        }
            const waSheet = waContactDoc.sheetsByTitle['CONTACT'];
            waSheet.addRows(contactData);
    
            return 'SUCCESS!!!!';

        }    
    } catch (error) {
        console.log(error);
    }
}





