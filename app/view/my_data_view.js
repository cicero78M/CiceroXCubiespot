export async function myDataView(dataResponse) {

    let accountState;
    
    if(dataResponse.STATUS === "TRUE"){
        accountState = 'ACTIVE';
    } else {
        accountState = 'DELETED';
    }
        let data = {
        data : `*Profile Anda*\n\nUser : ` +dataResponse.TITLE+` `+dataResponse.NAMA + `\nID Key : ` + dataResponse.ID_KEY + `\nDivisi / Jabatan : `
            + dataResponse.DIVISI + ` / ` + dataResponse.JABATAN + `\nInsta : ` + dataResponse.INSTA + `\nTikTok : ` + dataResponse.TIKTOK
            + `\nAccount Status : ` + accountState,
        state: true,
        code: 200
    }
    
    return data;
}