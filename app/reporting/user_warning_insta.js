import { client } from '../../app.js';
import { ciceroKey, newRowsData } from '../database/new_query/sheet_query.js';

export async function warningReportInsta(clientValue) {

  //Date Time
  let d = new Date();
  let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
      
  const clientName = clientValue.get('CLIENT_ID');


  let data;

  let userAll = 0;

  let shortcodeList = [];
  let userRows = [];
  let userLikesData = [];
  let UserNotLikes = [];
  let notLikesList = [];
  let instaLikesUsernameData = [];
  
  let shortcodeListString = '';

  return new Promise(
    async (
      resolve, reject
    ) => {
      try {
        
        await newRowsData(
          ciceroKey.dbKey.userDataID, 
          clientName
        ).then( 
          async response => {    
            userRows = await response;                           
            for (let i = 0; i < userRows.length; i++) {
              if (userRows[i].get('STATUS') === 'TRUE' ){
                userAll++;
              }
            } 
          }
        );

        // If Client_ID exist. then get official content
        if (clientValue.get('STATUS')) {   
          await newRowsData(
            ciceroKey.dbKey.instaOfficialID, 
            clientName
          ).then( 
            async response => {    
              
              const officialRows = await response;

              for (let i = 0; i < officialRows.length; i++) {
              
                let itemDate = new Date(officialRows[i].get('TIMESTAMP') * 1000);

                if (itemDate.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"}) === localDate) {
                  if (!shortcodeList.includes(officialRows[i].get('SHORTCODE'))) {
                    shortcodeList.push(officialRows[i].get('SHORTCODE'));
                    if (officialRows[i].get('TYPE') === 'reel') {
                      shortcodeListString = shortcodeListString.concat('\nhttps://instagram.com/reel/' + officialRows[i].get('SHORTCODE'));
                    } else {
                      shortcodeListString = shortcodeListString.concat('\nhttps://instagram.com/p/' + officialRows[i].get('SHORTCODE'));
                    }
                  }
                }
              }

              if (shortcodeList.length >= 1) {    
                await newRowsData(
                  ciceroKey.dbKey.instaLikesUsernameID, 
                  clientName
                ).then( 
                  async response => {    
                    instaLikesUsernameData = await response;                        
                    for (let i = 0; i < shortcodeList.length; i++) {
                      //code on the go
                      for (let ii = 0; ii < instaLikesUsernameData.length; ii++) {
                        if (instaLikesUsernameData[ii].get('SHORTCODE') === shortcodeList[i]) {
                          const fromRows = Object.values(instaLikesUsernameData[ii].toObject());
                
                          for (let iii = 0; iii < fromRows.length; iii++) {
                            if (fromRows[iii] != undefined || fromRows[iii] != null || fromRows[iii] != "") {
                              if (!userLikesData.includes(fromRows[iii])) {
                                userLikesData.push(fromRows[iii]);
                              }
                            }
                          }
                        }
                      }
                    } 
                  }
                );
        
                for (let i = 0; i < userRows.length; i++) {     
                  if (!userLikesData.includes(userRows[i].get('INSTA'))) {
                    if (!UserNotLikes.includes(userRows[i].get('ID_KEY'))) {
                      if (userRows[i].get('STATUS') === 'TRUE' ){
                        if (userRows[i].get('EXCEPTION') === "FALSE"){
                          UserNotLikes.push(userRows[i].get('ID_KEY'));
                          notLikesList.push(userRows[i]);
                        }                
                      }
                    }
                  }          
                }

                for (let i = 0; i<notLikesList.length; i++){
                    if(notLikesList[i].get('WHATSAPP') != ""){
                        setTimeout(async () => {

                            console.log(`Send Warning messages to ${notLikesList[i].get('TITLE')} ${notLikesList[i].get('NAMA')} `);  
                            await client.sendMessage(
                                `${notLikesList[i].get('WHATSAPP')}@c.us`,
                                `Selamat Siang, Bpk/Ibu ${notLikesList[i].get('TITLE')} ${notLikesList[i].get('NAMA')}\n\nSistem kami membaca bahwa Anda belum melaksanakan Likes dan Komentar pada Konten dari AKun Official  berikut :\n\n${shortcodeListString}\n\nSilahkan segera melaksanakan Likes dan Komentar Pada Kesempatan Pertama, Terimakasih.\n\n_Anda Menerima Pesan Otomatis ini karena nomor ini terdaftar sesuai dengan Nama User Tercantum, silahkan Save No WA Bot Pegiat Medsos ini_\n\n_Cicero System_
                                `
                            );
                        }, 4000);
                    }
                }

                data = {
                    data: "Send warning Done",
                    state: true,
                    code: 200
                  };
                  resolve (data);
                
              } else {
                data = {
                  data: "Tidak ada konten data untuk di olah",
                  state: true,
                  code: 201
                };
                reject (data);
              }            
            }
          ).catch (
            error =>{
              data = {
                data: error,
                state: false,
                code: 303
              };
              reject (data);
            }
          );
        } else {
          data = {
            data: 'Your Client ID has Expired, Contacts Developers for more Informations',
            state: true,
            code: 201
          };
          reject (data);
        }
      } catch (error) {
        data = {
          data: error,
          state: false,
          code: 303
        };
        reject (data);
      } 
    }
  );
}