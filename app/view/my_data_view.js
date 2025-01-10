export async function myDataView(dataResponse) {

    let accountState;
    
    if(dataResponse.get('STATUS') === "TRUE"){
        accountState = 'ACTIVE';
    } else {
        accountState = 'DELETED';
    }
    let data = {
    data : `*Profile Anda*\n\nUser : ` +dataResponse.get('TITLE')+` `+dataResponse.get('NAMA') + `\nID Key : ` + dataResponse.get('ID_KEY') + `\nDivisi / Jabatan : `
        + dataResponse.get('DIVISI') + ` / ` + dataResponse.get('JABATAN') + `\nInsta : ` + dataResponse.get('INSTA') + `\nTikTok : ` + dataResponse.get('TIKTOK')
        + `\nAccount Status : ` + accountState,
    state: true,
    code: 200
    }
    
    return data;
}