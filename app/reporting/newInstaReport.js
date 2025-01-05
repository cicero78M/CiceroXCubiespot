
import { newListValueData } from '../database/new_query/dataList_query.js';
import { ciceroKey, newRowsData } from '../database/new_query/sheet_query.js';

export async function newReportInsta(clientValue) {

    //Date Time
    let d = new Date();
    let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
    let hours = d.toLocaleTimeString("en-US", {timeZone: "Asia/Jakarta"});   
        
    const clientName = clientValue.get('CLIENT_ID');

    let userCounter = 0;
    let divisiCounter = 0;
    let userAll = 0;

    let shortcodeList = [];
    let divisiList = [];
    let userRows =[];
    let userLikesData = [];
    let UserNotLikes = [];
    let notLikesList = [];
    let instaLikesUsernameData =[];
    
    let notLikesName;
    let name;
    let nameUpper;
    let data;
    
    let dataInsta = '';
    let shortcodeListString = '';
    let userByDivisi = '';

    return new Promise(async (resolve, reject) => {
        try {
        
            await newListValueData(clientName, 'DIVISI').then(
                async response =>{
                    divisiList = await response;
                }
            )
        
            await newRowsData(ciceroKey.dbKey.userDataID, clientName).then( 
                async response => {    
                    userRows = await response;                           
                    for (let i = 0; i < userRows.length; i++) {
                        if (userRows[i].get('STATUS') === 'TRUE' ){
                            userAll++;
                        }
                    } 
            });
        
            // If Client_ID exist. then get official content
            if (clientValue.get('STATUS')) {
        
                await newRowsData(ciceroKey.dbKey.instaOfficialID, clientName).then( 
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
                            await newRowsData(ciceroKey.dbKey.instaLikesUsernameID, clientName).then( 
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
                            });
                    
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
                    
                    
                            for (let iii = 0; iii < divisiList.length; iii++) {
                    
                              divisiCounter = 0;
                              userByDivisi = '';
                    
                              for (let iv = 0; iv < notLikesList.length; iv++) {
                    
                                if (divisiList[iii] === notLikesList[iv].get('DIVISI')) {
                                  
                                  if (notLikesList[iv].get('INSTA') === undefined|| notLikesList[iv].get('INSTA') === null || notLikesList[iv].get('INSTA') === ""){
                                    notLikesName = "Belum Input";
                                  } else {
                                    notLikesName = notLikesList[iv].get('INSTA');
                                  }
                    
                                  if (clientValue.get('TYPE')  === "RES") {
                                    userByDivisi = userByDivisi.concat('\n' + notLikesList[iv].get('TITLE') + ' ' + notLikesList[iv].get('NAMA') + ' - ' + notLikesName);
                                    divisiCounter++;
                                    userCounter++;
                                  } else if (clientValue.get('TYPE')  === "COM") {
                                    name = notLikesList[iv].get('NAMA');
                                    nameUpper = name.toUpperCase();
                                    userByDivisi = userByDivisi.concat('\n' + nameUpper + ' - ' + notLikesName);
                                    divisiCounter++;
                                    userCounter++;
                                  }
                                }
                              }
                    
                              if (divisiCounter != 0) {
                                dataInsta = dataInsta.concat('\n\n*' + divisiList[iii] + '* : ' + divisiCounter + ' User\n' + userByDivisi);
                              }
                            }
                    
                            let instaSudah = userAll - notLikesList.length;
                    
                            if (clientValue.get('TYPE')  === 'COM') {
                              data = {
                                data: "*" + clientName + "*\n\nInformasi Rekap Data yang belum melaksanakan likes pada " + shortcodeList.length + " konten Instagram :\n" 
                                  + shortcodeListString + "\n\nWaktu Rekap : " + localDate + "\nJam : " + hours + "\n\nDengan Rincian Data sbb:\n\n_Jumlah User : "
                                  + userAll+ "_\n_Jumlah User Sudah melaksanakan: " + instaSudah + "_\n_Jumlah User Belum melaksanakan : "
                                  + userCounter + "_\n\n*Rincian Yang Belum Melaksanakan :*" + dataInsta + "\n\n_System Administrator Cicero_",
                                state: true,
                                code: 200
                              };
                            } else if (clientValue.get('TYPE')  === "RES") {
                              data = {
                                data: "Mohon Ijin Komandan,\n\nMelaporkan Rekap Pelaksanaan Likes Pada " + shortcodeList.length + " Konten dari akun Resmi Instagram *POLRES " 
                                  + clientName + "* dengan Link konten sbb : \n" + shortcodeListString + "\n\nWaktu Rekap : " + localDate + "\nJam : " + hours 
                                  + "\n\nDengan Rincian Data sbb:\n\n_Jumlah User : "+ userAll + "_\n_Jumlah User Sudah melaksanakan: " 
                                  + instaSudah + "_\n_Jumlah User Belum melaksanakan : "+ userCounter + "_\n\n*Rincian Yang Belum Melaksanakan :*" 
                                  + dataInsta + "\n\n_System Administrator Cicero_",
                                state: true,
                                code: 200
                              };
                            }
                            resolve (data);
                        } else {
                            data = {
                              data: "Tidak ada konten data untuk di olah",
                              state: true,
                              code: 201
                            };
                            reject (data);
                        }

                }).catch (
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
    });
}