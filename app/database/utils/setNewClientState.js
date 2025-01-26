// import { decrypted, encrypted } from '../../../json_data_file/crypto.js';
// import { clientData } from '../../../json_data_file/client_data/read_client_data_from_json.js';

// export async function setNewClientState(clientName, newstate) {

//     try {

//         clientData().then(
//             clientRows =>{

//                 let isClient = false;

//                 for (let i = 0; i < clientRows.length; i++) {
//                     if (decrypted(clientRows[i].CLIENT_ID) === clientName) {

//                         isClient = true;


//                         clientRows[i].SECUID = encrypted(newstate);

//                         writeFileSync(`json_data_file/client_data/client_data.json`, JSON.stringify(clientRows));
//                         writeFileSync(`json_data_file/client_data/${clientName}.json`, JSON.stringify(clientRows[i]));

//                         let response = {
//                             message: 'Client State with Client_ID : ' + sheetName + ' set status to : ' + state,
//                             state: true,
//                             code: 200
//                         };
        
//                         console.log('Return Success');
//                         return response;
//                     }
//                 }
        
//                 if (!isClient) {
//                     let responseData = {
//                         message: 'No Data with Client_ID : ' + clientName,
//                         state: true,
//                         code: 200
//                     };
        
//                     console.log('Return Success');
//                     return responseData;
//                 }


//             }
//         )


//     } catch (error) {

//         let responseData = {
//             message: 'Data Error',
//             state: false,
//             code: 303
//         };

//         console.log(error);
//         return responseData;
//     }
// }