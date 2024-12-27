export async function infoView(dataResponse) {

    let data = {
    data : `*Berikut Format Pesan WABOT PEGIAT MEDSOS*\n\n=================================\n\n*Menampilkan Pesan ini* :\n\n${dataResponse}#INFO\n\n=================================\n\n*Format Pesan untuk menampilkan data anda :*\n\n${dataResponse}#MYDATA#NRP\n\n_Contoh :_\n\n${dataResponse}#MYDATA#87020990\n\n=================================\n\n*Format Pesan WA Untuk Penambahan / Perubahan data IG :*\n\n${dataResponse}#IG#NRP#link_profile_instagram\n\n_Contoh :_\n\n${dataResponse}#IG#87020990#https://www.instagram.com/riezqo_fx\n\n=================================\n\n=================================\n\n*Format WA Pesan Untuk Perubahan data Tiktok :*\n\n${dataResponse} #TIKTOK#NRP#link_profile_tiktok\n\n_Contoh :_\n\n${dataResponse}#TIKTOK#87020990#https://www.tiktok.com/@cicero_dev\n\n=================================\n\n*Format Pesan WA untuk input No WA Anda :*\n\n${dataResponse}#WHATSAPP#NRP\n\n_Contoh :_\n\n${dataResponse}#WHATSAPP#87020990\n\n=================================\n\n*Format Wa Untuk merubah Data Pangkat :*\n\n${dataResponse}#EDITPANGKAT#NRP#PANGKATBARU\n\n_Contoh :_\n\n${dataResponse}#EDITPANGKAT#87020990#BRIPKA\n\n=================================\n\n*Format Pesan WA untuk merubah Data Nama Satfung :*\n\n${dataResponse}#EDITSATFUNG#NRP#NAMA SATFUNG\n\n_Contoh :_\n\n${dataResponse}#EDITSATFUNG#87020990#SI TIK\n\n=================================\n\n*Format Pesan WA untuk merubah data Jabatan :*\n\n${dataResponse}#EDITJABATAN#NRP#NAMA JABATAN\n\n_Contoh :_\n\n${dataResponse}#EDITJABATAN#87020990#BAMIN TEKINFO\n\n=================================`,
    state: true,
    code: 200
    }

    return data;
}
