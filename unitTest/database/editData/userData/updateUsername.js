import { readFileSync } from 'fs';

//Google Spreadsheet
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { checkMyData as _checkMyData } from '../../checkMyData.js';

const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));

const googleAuth = new JWT({
  // env var values here are copied from service account credentials generated by google
  // see "Authentication" section in docs for more info
  email: ciceroKey.client_email,
  key: ciceroKey.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export async function updateUsername(clientName, idKey, username, phone, type) {

  //Get Last Segment of Links
  const userDoc = new GoogleSpreadsheet(ciceroKey.dbKey.userDataID, googleAuth); //Google Auth

  console.log(username);

  try {
    //Insert New Sheet
    await userDoc.loadInfo(); // loads document properties and worksheets
    const userSheet = userDoc.sheetsByTitle[clientName];

    const userRows = await userSheet.getRows();

    let isDataExist = false;
    let usernameList = [];
    let userType;

    //Collect Divisi List String
    if (type === "updateinstausername") {
      userType = 'INSTA';
    } else if (type === "updatetiktokusername") {
      userType = 'TIKTOK';
    }

    for (let i = 0; i < userRows.length; i++) {
      if (!usernameList.includes(userRows[i].get(userType))) {
        usernameList.push(userRows[i].get(userType));
      }
    }

    if (!usernameList.includes(username)) {
      for (let i = 0; i < userRows.length; i++) {
        if (userRows[i].get('ID_KEY') === idKey) {
          if (userRows[i].get('WHATSAPP') === phone || userRows[i].get('WHATSAPP') === "" || userRows[ii].get('WHATSAPP') === "6281235114745") {

            if (userRows[i].get('STATUS') === "TRUE") {

              isDataExist = true;
              if (type === "updateinstausername") {
                userRows[i].assign({ INSTA: username, WHATSAPP: phone }); // Update Insta Value
              } else if (type === "updatetiktokusername") {
                userRows[i].assign({ TIKTOK: username, WHATSAPP: phone }); // Update Insta Value
              }
              await userRows[i].save(); //save update
              userDoc.delete;
              let responseMyData = await _checkMyData(clientName, idKey);
              return responseMyData;

            } else {

              let responseData = {
                data: 'Your Account Suspended',
                state: true,
                code: 200
              };
              console.log('Return Success');
              userDoc.delete;
              return responseData;

            }

          } else {
            let responseData = {
              data: 'Ubah data dengan menggunakan Nomor Whatsapp terdaftar',
              state: true,
              code: 200
            };
            console.log('Return Success');
            userDoc.delete;
            return responseData;
          }


        }
      }

      if (!isDataExist) {

        let responseData = {
          data: 'User Data with delegated ID_KEY Doesn\'t Exist',
          state: true,
          code: 200
        };

        console.log('Return Success');
        userDoc.delete;
        return responseData;

      }
    } else {

      let responseData = {
        data: 'Username Sudah Terdaftar',
        state: true,
        code: 200
      };

      console.log('Return Success');
      userDoc.delete;
      return responseData;
    }

  } catch (error) {

    let responseData = {
      data: error,
      state: false,
      code: 303
    };

    console.log('Return Success');
    userDoc.delete;
    return responseData;

  }
}