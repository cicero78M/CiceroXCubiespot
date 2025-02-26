import { logsUserSend } from "./logs_whatsapp.js";

export async function notifView(userData, shortcodeList) {

    return new Promise(async (resolve, reject) => {

        try {

            let i = 0;

            (function loop() {
                console.log(userData[i].NAMA)
                if (++i < userData.length) {

                    if(userData[i].WHATSAPP !== ""){

                        if (process.env.APP_CLIENT_TYPE === "RES"){

                            logsUserSend(
                                `${userData[i].WHATSAPP}@c.us`,     
`Pesan Notifikasi, Bpk/Ibu ${userData[i].TITLE} ${userData[i].NAMA}

Sistem kami membaca bahwa Anda belum melaksanakan Likes dan Komentar pada Konten dari Akun Official  berikut :

${shortcodeList}

Silahkan segera melaksanakan Likes dan Komentar Pada Kesempatan Pertama, Terimakasih.

_Anda Menerima Pesan Otomatis ini karena nomor ini terdaftar sesuai dengan Nama User Tercantum, silahkan Save No WA Bot Pegiat Medsos ini_

_Cicero System_`
                            );
                                  
                          } else {
                            logsUserSend(
                                `${userData[i].WHATSAPP}@c.us`,
`Pesan Notifikasi, Bpk/Ibu ${userData[i].NAMA}

Sistem kami membaca bahwa Anda belum melaksanakan Likes dan Komentar pada Konten dari Akun Official  berikut :

${shortcodeList}

Silahkan segera melaksanakan Likes dan Komentar Pada Kesempatan Pertama, Terimakasih.

_Anda Menerima Pesan Otomatis ini karena nomor ini terdaftar sesuai dengan Nama User Tercantum, silahkan Save No WA Bot Pegiat Medsos ini_

_Cicero System_`
                            );
                          }
                        }
                    setTimeout(loop, 3000);  
                }
            })();
            
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
