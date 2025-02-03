//Google Spreadsheet
import { JWT } from 'google-auth-library';

import { google } from 'googleapis';

const googleAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: process.env.client_email,
  key: process.env.private_key,
  scopes: ['https://www.googleapis.com/auth/contacts'],
});

export async function saveGoogleContact(name, phone) {

    new Promise( async(resolve, reject) => {
        const people = google.people({ version: 'v1',  googleAuth});

        const contact = {
            names: [{ givenName: name }],
            phoneNumbers: [{ value: phone }],
            
        }
    
        try {
            const response = await people.people.createContact({
            requestBody: contact,
            });
       
            let data = {
                data: 'Contact created: '+response.data,
                state: true,
                code: 200
            };
  
            resolve (data);   

        } catch (error) {

            let data = {
                data: error,
                message:"Save Google Contact Error",
                state: false,
                code: 303
              };
              reject (data);        
        }
    })


    
}

