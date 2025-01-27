export async function oprInfoView(dataResponse) {

    let data = {
    data : 
`*Operator Request Format WABOT PEGIAT MEDSOS*
=================================
=================================
*Menampilkan Pesan ini* :

${dataResponse}#OPRINFO
=================================
*Menambahkan Data User Baru :*

${dataResponse}#ADDNEWUSER#NRP#NAMA#SATFUNG#JABATAN#PANGKAT

=================================
*Hapus Data User :*

${dataResponse}#DELETEUSER#NRP

=================================
*Absensi User Belum Input Data Instagram:*

${dataResponse}#INSTACHECK
=================================
*Absensi User Belum Input Data TIKTOK:*

${dataResponse}#TIKTOKCHECK
=================================
    `,
    state: true,
    code: 200
    }

    return data;
}