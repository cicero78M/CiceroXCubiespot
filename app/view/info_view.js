export async function infoView(dataResponse) {

    let data = {
    data : 
    `*Berikut Format Pesan WABOT PEGIAT MEDSOS*
    =================================
    =================================
    *Menampilkan Pesan ini* :

    ${dataResponse}#INFO
    =================================
    *Menampilkan data anda :*
    
    ${dataResponse}#MYDATA#NRP
    
    _Contoh :_ 
    ${dataResponse}#MYDATA#87020990
    =================================
    *Perubahan / Input data IG :*
    
    ${dataResponse}#IG#NRP#link_profile_instagram

    _Contoh :_ 
    ${dataResponse}#IG#87020990#https://www.instagram.com/riezqo_fx
    =================================
    *Perubahan / Input data Tiktok :*
    
    ${dataResponse}#TIKTOK#NRP#link_profile_tiktok
    
    _Contoh :_ 
    ${dataResponse}#TIKTOK#87020990#https://www.tiktok.com/@cicero_dev
    =================================
    *Input No WA Anda :*
    
    ${dataResponse}#WHATSAPP#NRP
    
    _Contoh :_ 
    ${dataResponse}#WHATSAPP#87020990
    =================================

    
    *Merubah Data Pangkat :*
    
    ${dataResponse}#NAMA#NRP#NAMA
    
    _Contoh :_ 
    ${dataResponse}#NAMA#87020990#RIZQA
    =================================

    *Merubah Data Pangkat :*
    
    ${dataResponse}#PANGKAT#NRP#PANGKAT
    
    _Contoh :_ 
    ${dataResponse}#PANGKAT#87020990#BRIPKA
    =================================
    *Merubah Data Nama Satfung :*
    
    ${dataResponse}#SATFUNG#NRP#SATFUNG
    
    _Contoh :_
    ${dataResponse}#SATFUNG#87020990#SI TIK
    =================================
    *Merubah data Jabatan :*

    ${dataResponse}#JABATAN#NRP#JABATAN
    
    _Contoh :_ 
    ${dataResponse}#JABATAN#87020990#BAMIN
    =================================`,
    state: true,
    code: 200
    }

    return data;
}