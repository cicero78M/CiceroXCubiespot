import { decrypted } from '../../module/crypto.js';
import { newListValueData } from '../../module/data_list_query.js';
import { readdirSync, readFileSync } from "fs";
import { logsSave } from '../../view/logs_whatsapp.js';
import { readUser } from '../read_data/read_data_from_dir.js';

export async function newReportInsta(clientValue, todayItems, type) {

  logsSave("Execute Report Insta")

  //Date Time
  let d = new Date();
  let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
  let hours = d.toLocaleTimeString("en-US", {timeZone: "Asia/Jakarta"});   
      
  const clientName = decrypted(clientValue.CLIENT_ID);
  logsSave(clientName);
  let notLikesName;
  let name;
  let nameUpper;
  let data;

  let userCounter = 0;
  let divisiCounter = 0;
  let userAll = 0;

  let shortcodeList = [];
  let divisiList = [];
  let userRows = [];
  let userLikesData = [];
  let UserNotLikes = [];
  let notLikesList = [];
  
  let dataInsta = '';
  let shortcodeListString = '';
  let userByDivisi = '';

  return new Promise(
    async (resolve, reject) => {
      try {

        logsSave("Execute")
        
        await newListValueData(
          clientName, 
          'DIVISI'
        ).then(
          async response =>{
            divisiList = await response.data;
          }
        ).catch(
          error => reject(error)
        )

        await readUser(
          clientName
        ).then( 
          async response => {    
            userRows = await response.data;                           
            for (let i = 0; i < userRows.length; i++) {
              if (userRows[i].STATUS === 'TRUE' ){
                userAll++;
              }
            } 
          }
        ).catch( error => reject (error));

        // If Client_ID exist. then get Insta content

        if (decrypted(clientValue.STATUS)) {   

          let instaContentDir = readdirSync(`json_data_file/insta_data/insta_content/${clientName}`);

          for (let i = 0; i < instaContentDir.length; i++) {

            try {

              let contentItems = JSON.parse(readFileSync(`json_data_file/insta_data/insta_content/${clientName}/${instaContentDir[i]}`));

              if(todayItems.includes(decrypted(contentItems.SHORTCODE))){
  
                if (!shortcodeList.includes(decrypted(contentItems.SHORTCODE))) {
  
                  shortcodeList.push(decrypted(contentItems.SHORTCODE));
                  
                  if (decrypted(contentItems.TYPE) === 'reel') {
                    shortcodeListString = shortcodeListString.concat('\nhttps://instagram.com/reel/' + decrypted(contentItems.SHORTCODE));
                  } else {
                    shortcodeListString = shortcodeListString.concat('\nhttps://instagram.com/p/' + decrypted(contentItems.SHORTCODE));
                  }
                }
              }
              
            } catch (error) {
              console.log(error);
            }

  
          }

          if (shortcodeList.length >= 1) {              
            //Collect Likes Data
            for (let i = 0; i < shortcodeList.length; i++) {
              try {
                let likesItems = JSON.parse(readFileSync(`json_data_file/insta_data/insta_likes/${clientName}/${shortcodeList[i]}.json`));
                for (let ii = 0; ii < likesItems.length; ii++) {
                  if (!userLikesData.includes(decrypted(likesItems[ii]))) {
                    userLikesData.push(decrypted(likesItems[ii]));
                  }
                }                
              } catch (error) {
                console.log(error);
              }

            } 

            for (let i = 0; i < userRows.length; i++) {     

              if (userRows[i].INSTA === undefined
              || userRows[i].INSTA === null 
              || userRows[i].INSTA === ""){

                logsSave("Null Data Exist");
                UserNotLikes.push(userRows[i].ID_KEY);
                notLikesList.push(userRows[i]);

              } else {
                if (!userLikesData.includes(userRows[i].INSTA)) {
                  if (!UserNotLikes.includes(userRows[i].ID_KEY)) {
                    if (userRows[i].STATUS === 'TRUE' ){
                      if (userRows[i].EXCEPTION === "FALSE"){
                        
                        UserNotLikes.push(userRows[i].ID_KEY);
                        notLikesList.push(userRows[i]);
                      }                
                    }
                  }
                } 
              }
     
            }
    
            for (let iii = 0; iii < divisiList.length; iii++) {
    
              divisiCounter = 0;
              userByDivisi = '';
    
              for (let iv = 0; iv < notLikesList.length; iv++) {
    
                if (divisiList[iii] === notLikesList[iv].DIVISI) {
                  
                  if (notLikesList[iv].INSTA === undefined
                  || notLikesList[iv].INSTA === null 
                  || notLikesList[iv].INSTA === ""){
                    notLikesName = "Belum Input";
                  } else {
                    notLikesName = notLikesList[iv].INSTA;
                  }
    
                  if (decrypted(clientValue.TYPE)  === "RES") {
                  
                    userByDivisi = userByDivisi.concat('\n' + notLikesList[iv].TITLE + ' ' + notLikesList[iv].NAMA + ' - ' + notLikesName);
                    divisiCounter++;
                    userCounter++;
                  
                  } else if (decrypted(clientValue.TYPE)  === "COM") {
                  
                    name = notLikesList[iv].NAMA;
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
    
            if (decrypted(clientValue.TYPE)  === 'COM') {
              data = {
                data: "*" + clientName + "*\n\nInformasi Rekap Data yang belum melaksanakan likes pada " + shortcodeList.length + " konten Instagram :\n" 
                  + shortcodeListString + "\n\nWaktu Rekap : " + localDate + "\nJam : " + hours + "\n\nDengan Rincian Data sbb:\n\n_Jumlah User : "
                  + userAll+ "_\n_Jumlah User Sudah melaksanakan: " + instaSudah + "_\n_Jumlah User Belum melaksanakan : "
                  + userCounter + "_\n\n*Rincian Yang Belum Melaksanakan :*" + dataInsta + "\n\n_System Administrator Cicero_",
                state: true,
                code: 200
              };
            } else if (decrypted(clientValue.TYPE)  === "RES") {

              if(type === "official"){
                  
                data = {
                  data: "Mohon Ijin Komandan,\n\nMelaporkan Rekap Pelaksanaan Likes Pada " + shortcodeList.length + " Konten dari akun Resmi Instagram *POLRES " 
                    + clientName + "* dengan Link konten sbb : \n" + shortcodeListString + "\n\nWaktu Rekap : " + localDate + "\nJam : " + hours 
                    + "\n\nDengan Rincian Data sbb:\n\n_Jumlah User : "+ userAll + "_\n_Jumlah User Sudah melaksanakan: " 
                    + instaSudah + "_\n_Jumlah User Belum melaksanakan : "+ userCounter + "_\n\n*Rincian Yang Belum Melaksanakan :*" 
                    + dataInsta + "\n\n_System Administrator Cicero_",
                  state: true,
                  code: 200
                };

              } else if(type === "secondary"){

                data = {
                  data: "Mohon Ijin Komandan,\n\nMelaporkan Rekap Pelaksanaan Likes Pada " + shortcodeList.length + " Konten dari akun Resmi Instagram *BHAYANGKARI POLRES " 
                    + clientName + "* dengan Link konten sbb : \n" + shortcodeListString + "\n\nWaktu Rekap : " + localDate + "\nJam : " + hours 
                    + "\n\nDengan Rincian Data sbb:\n\n_Jumlah User : "+ userAll + "_\n_Jumlah User Sudah melaksanakan: " 
                    + instaSudah + "_\n_Jumlah User Belum melaksanakan : "+ userCounter + "_\n\n*Rincian Yang Belum Melaksanakan :*" 
                    + dataInsta + "\n\n_System Administrator Cicero_",
                  state: true,
                  code: 200
                };

              }
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

        } else {
          data = {
            data: 'Your Client ID has Expired, Contacts Developers for more Informations',
            state: true,
            code: 201
          };
          reject (data);
        }
      } catch (error) {
        console.log(error)
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