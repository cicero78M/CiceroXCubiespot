//Google Spreadsheet
import { google } from 'googleapis';
import { googleAuth } from './sheet_query';

export function saveGoogleContact(name, groups, phone) {

    new Promise( (resolve, reject) => {
    
        try {

            const people = google.people('v1', googleAuth);
            const contact = {
                names: [{ givenName: name }],
                phoneNumbers: [{ value: phone }],
                groups: [{value: groups}]
            }

            const response = people.people.createContact({
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
    });
}

