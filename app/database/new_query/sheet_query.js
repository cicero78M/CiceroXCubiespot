//Google Spreadsheet
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { readFileSync } from 'fs';

export const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));

export const googleAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: ciceroKey.client_email,
  key: ciceroKey.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export async function newRowsData(
    sheetID, 
    clientName
) {
    return new Promise(
        async (resolve) => {            
        
            await customLoop(
                sheetID, 
                clientName
            );

            async function customLoop( 
                sheetID,
                clientName) {          

                    let dataDoc = new GoogleSpreadsheet(
                        sheetID, 
                        googleAuth
                    );

                    //Google Authentication for client DB
                    await dataDoc.loadInfo(); // loads document properties and worksheets
                
                    let sheetTitle = dataDoc.sheetsByTitle[clientName];
                    
                    console.log(dataDoc)
                    
                    await sheetTitle.getRows()

                    .then( response => {
                        console.log();
                        resolve (response);
            
                    }).catch( async response =>{
                        console.error(response);
                        setTimeout(async () => {
                            console.log("Try-Again");
                        }, 
                            6000
                        );

                        await customLoop(
                            sheetID, 
                            clientName
                        );

                });
            }
        }
    );
}