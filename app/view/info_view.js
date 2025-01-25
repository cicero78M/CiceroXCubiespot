export async function infoView(dataResponse) {

    let data = {
    data : 
    `*Berikut Format Pesan WABOT PEGIAT MEDSOS*
    =================================
    =================================
    *Menampilkan Pesan ini* :

    ${dataResponse}#INFO
    =================================
    *Format Pesan untuk menampilkan data anda :*
    
    ${dataResponse}#MYDATA#NRP
    
    _Contoh :_ 
    ${dataResponse}#MYDATA#87020990
    =================================
    *Format Pesan WA Untuk Penambahan / Perubahan data IG :*
    
    ${dataResponse}#IG#NRP#link_profile_instagram

    _Contoh :_ 
    ${dataResponse}#IG#87020990#https://www.instagram.com/riezqo_fx
    =================================
    *Format WA Pesan Untuk Perubahan data Tiktok :*
    
    ${dataResponse}#TIKTOK#NRP#link_profile_tiktok
    
    _Contoh :_ 
    ${dataResponse}#TIKTOK#87020990#https://www.tiktok.com/@cicero_dev
    =================================
    *Format Pesan WA untuk input No WA Anda :*
    
    ${dataResponse}#WHATSAPP#NRP
    
    _Contoh :_ 
    ${dataResponse}#WHATSAPP#87020990
    =================================
    *Format Wa Untuk merubah Data Pangkat :*
    
    ${dataResponse}#PANGKAT#NRP#PANGKAT
    
    _Contoh :_ 
    ${dataResponse}#PANGKAT#87020990#BRIPKA
    =================================
    *Format Pesan WA untuk merubah Data Nama Satfung :*
    
    ${dataResponse}#SATFUNG#NRP#SATFUNG
    
    _Contoh :_
    ${dataResponse}#SATFUNG#87020990#TIK
    =================================
    *Format Pesan WA untuk merubah data Jabatan :*

    ${dataResponse}#JABATAN#NRP#JABATAN
    
    _Contoh :_ 
    ${dataResponse}#JABATAN#87020990#BAMIN
    =================================`,
    state: true,
    code: 200
    }

    return data;
}