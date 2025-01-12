import { readFileSync } from 'fs';
const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { newRowsData } from '../new_query/sheet_query.js';

const googleAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: ciceroKey.client_email,
  key: ciceroKey.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});


export async function saveContacts() {

    try {

        let whatsappList = ['',];
        let contactData = [];
        let contactList = [];

        await newRowsData(ciceroKey.dbKey.waContact, 'CONTACT').then(
            contactRows =>{
                for (let i = 0; i < contactRows.length; i++){                    
                    if(!contactList.includes(contactRows[i].get('MOBILE PHONE'))){ 
                        contactList.push(contactRows[i].get('MOBILE PHONE'));
                    }
                }
            }
        )


        await newRowsData(ciceroKey.dbKey.clientDataID, 'ClientData').then(
            
            async clientRows =>{
                if (clientRows.length >= 1){
                    
                    for (let i = 0; i < clientRows.length; i++){
                        console.log(clientRows[i].get('CLIENT_ID'));
        
                        await newRowsData(ciceroKey.dbKey.userDataID, clientRows[i].get('CLIENT_ID')).then(
                            async userRows => {

                                for (let ii = 0; ii < userRows.length; ii++){
                                    clientRows[i].get('OPERATOR')
                                    if(userRows[ii].get('WHATSAPP') != clientRows[i].get('OPERATOR') 
                                        || Number(userRows[ii].get('WHATSAPP')) != NaN ){
                                        if(!whatsappList.includes(userRows[ii].get('WHATSAPP') )){ 
                                            whatsappList.push(userRows[ii].get('WHATSAPP'));
                                            contactData.push({'FIRST NAME': userRows[ii].get('NAMA').toUpperCase(), 'LAST NAME' : '',EMAIL : '', 'MOBILE PHONE': userRows[ii].get('WHATSAPP'), COMPANY:  clientRows[i].get('CLIENT_ID')});
                                        }
                                    }
                                }
                            }
                        )                
                    }

                    const waContactDoc = new GoogleSpreadsheet(
                        ciceroKey.dbKey.waContact, 
                        googleAuth
                    ); //Google Auth
                    
                    await waContactDoc.loadInfo(); 
                    const waSheet = waContactDoc.sheetsByTitle['CONTACT'];
                    waSheet.addRows(contactData);
            
                    return 'SUCCESS!!!!';

                }    
            }
        )


    } catch (error) {
        console.log(error);
    }
}