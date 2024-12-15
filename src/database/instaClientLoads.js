const fs = require('fs');

//Google Spreadsheet
const { GoogleSpreadsheet } = require ('google-spreadsheet');
const { JWT } = require ('google-auth-library');

const googleCreds = JSON.parse (fs.readFileSync('ciceroKey.json'));
const dbKey = JSON.parse (fs.readFileSync('dbKey.json'));

const instaReload = require('../scrapper/instalikesreload');
const instaReport = require('../reporting/instalikesreport');

const userDataBase = dbKey.databaseID;;
const clientDataBase = dbKey.clientDataID;
const instaOfficialDataBase = dbKey.instaOfficialID;
const instaLikesUsernameDataBase = dbKey.instaLikesUsernameID;

const googleAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: googleCreds.client_email,
  key: googleCreds.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

module.exports = { 
    instaLoadClient: async function instaLoadClient(clientID){

        const clientDoc = new GoogleSpreadsheet(clientID, googleAuth);//Google Authentication for client DB        
        await clientDoc.loadInfo(); // loads document properties and worksheets

        console.log('Load Client Functions');

        const clientDataSheet = clientDoc.sheetsByTitle['ClientData'];
        const rowsClientData = await clientDataSheet.getRows();

        let responseList = [];

        for (let i = 0; i < rowsClientData.length; i++){

            if(rowsClientData[i].get('STATUS')  === "TRUE" && rowsClientData[i].get('INSTA_STATE') === "TRUE"){

                console.log(rowsClientData[i].get('CLIENT_ID')+' Client Loaded');

                let response = await instaReload.reloadInstaLikes(rowsClientData[i].get('CLIENT_ID'), userDataBase, clientDataBase, 
                instaOfficialDataBase, instaLikesUsernameDataBase);

                responseList.push(response);

                let responsereport = await instaReport.reportInstaLikes(rowsClientData[i].get('CLIENT_ID'), userDataBase, clientDataBase, 
                instaOfficialDataBase, instaLikesUsernameDataBase);

                responseList.push(responsereport);

            } 
        }

        await clientDoc.delete();
        return responseList;
    }
}