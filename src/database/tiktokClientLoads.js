const fs = require('fs');

//Google Spreadsheet
const { GoogleSpreadsheet } = require ('google-spreadsheet');
const { JWT } = require ('google-auth-library');

const googleCreds = JSON.parse (fs.readFileSync('ciceroKey.json'));

const tiktokReload = require('../scrapper/tiktocommentreload');
const tiktokReport = require('../reporting/tiktokcommentsreport');


const userDataBase = googleCreds.dbKey.databaseID;;
const clientDataBase = googleCreds.dbKey.clientDataID;
const tiktokOfficialDataBase = googleCreds.dbKey.tiktokOfficialID;
const tiktokCommentUsernameDataBase = googleCreds.dbKey.tiktokCommentUsernameID;

const googleAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: googleCreds.client_email,
  key: googleCreds.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

module.exports = { 
    tiktokLoadClient: async function tiktokLoadClient(clientID){

        const clientDoc = new GoogleSpreadsheet(clientID, googleAuth);//Google Authentication for client DB        

        await clientDoc.loadInfo(); // loads document properties and worksheets

        console.log('Load Client Functions');

        const clientDataSheet = clientDoc.sheetsByTitle['ClientData'];
        const rowsClientData = await clientDataSheet.getRows();

        let responseList = [];

        for (let i = 0; i < rowsClientData.length; i++){

            if(rowsClientData[i].get('STATUS') === "TRUE" && rowsClientData[i].get('TIKTOK_STATE') === "TRUE"){

                console.log(rowsClientData[i].get('CLIENT_ID')+' Client Loaded');

                let responseData = await tiktokReload.reloadTiktokComments(rowsClientData[i].get('CLIENT_ID'), userDataBase, clientDataBase, 
                tiktokOfficialDataBase, tiktokCommentUsernameDataBase);

                responseList.push(responseData);
            
                let responseReport = await tiktokReport.reportTiktokComments(rowsClientData[i].get('CLIENT_ID'), userDataBase, clientDataBase, 
                tiktokOfficialDataBase, tiktokCommentUsernameDataBase);
               
                responseList.push(responseReport);

            }
        }

        clientDoc.delete;      

        console.log('Return Success');

        return responseList;
    }
}