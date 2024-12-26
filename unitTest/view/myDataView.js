
export async function myDataView(dataResponse) {

    let data ;

    switch (dataResponse.code){ 

    case 200:

        let accountState;

        if(dataResponse.data.get('STATUS') === "TRUE"){
        accountState = 'ACTIVE';
        } else {
        accountState = 'DELETED';
        }

        data = {
        data : `*Profile Anda*\n\nUser : ` +dataResponse.data.get('TITLE')+` `+dataResponse.data.get('NAMA') + `\nID Key : ` + dataResponse.data.get('ID_KEY') + `\nDivisi / Jabatan : `
            + dataResponse.data.get('DIVISI') + ` / ` + dataResponse.data.get('JABATAN') + `\nInsta : ` + dataResponse.data.get('INSTA') + `\nTikTok : ` + dataResponse.data.get('TIKTOK')
            + `\nAccount Status : ` + accountState,
        state: true,
        code: 200
        }
        
        break;
    case 201:

            data = {
            data : dataResponse.data,
            state: true,
            code: 201
        }
        break;        
    case 303:

        data = {
            data : dataResponse.data,
            state: true,
            code: 303
        }
        break;        
    }    
    
    return data;
}
