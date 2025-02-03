import { logsUserSend } from "./logs_whatsapp.js";

export async function notifView(userData, shortcodeList) {

    return new Promise(async (resolve, reject) => {

        try {

            for (let i = 0; i < userData.length; i++){
                if(userData[i].WHATSAPP !== ""){
                              
                  setTimeout(() => {
                    logsUserSend(

                        `${userData[i].WHATSAPP}@c.us`,
                        
`Pesan Notifikasi, Bpk/Ibu ${userData[i].TITLE} ${userData[i].NAMA}

Sistem kami membaca bahwa Anda belum melaksanakan Likes dan Komentar pada Konten dari Akun Official  berikut :

${shortcodeList}

Silahkan segera melaksanakan Likes dan Komentar Pada Kesempatan Pertama, Terimakasih.

_Anda Menerima Pesan Otomatis ini karena nomor ini terdaftar sesuai dengan Nama User Tercantum, silahkan Save No WA Bot Pegiat Medsos ini_

_Cicero System_`
                    );
                  }, 30*1000);
                }
            }
            
            let data ={
                data :"Send Notif Done",
                state: true,
                code: 200
            };
            
            resolve (data);
            
        } catch (error) {

            let data ={
                data :error,
                message: "Error On Send Notification to User",
                state: true,
                code: 303
            };
            
            reject (data);            
        }
    });
}
