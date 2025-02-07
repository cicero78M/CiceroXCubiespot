export async function myDataView(params) {

    return new Promise((resolve, reject) => {

        let data;

        try {

            let accountState;
    
            if(params.STATUS === "TRUE"){
                accountState = 'ACTIVE';
            } else {
                accountState = 'DELETED';
            }


            
            data = {
                data : `*Profile Anda*\n\nUser : ` +params.TITLE+` `+params.NAMA + `\nID Key : ` + params.ID_KEY + `\nDivisi / Jabatan : `
                    + params.DIVISI + ` / ` + params.JABATAN + `\nInsta : ` + params.INSTA + `\nTikTok : ` + params.TIKTOK
                    + `\nAccount Status : ` + accountState,
                state: true,
                code: 200
            }
            
            resolve (data);
            
        } catch (error) {

            data = {
                data: error,
                message : "My Data View Error",
                state: false,
                code: 303
            };
          
            reject (data);
            
        } 
    });


}