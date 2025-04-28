import { Alert } from 'react-native';

const AlertService = {
  success: (title = 'Sukses', message = 'Berhasil melakukan aksi.') => {
    Alert.alert(title, message, [{ text: 'Oke' }], { cancelable: true });
  },

  error: (title = 'Gagal Melakukan Aksi', message = 'Terjadi Kesalahan Coba Lagi.') => {
    Alert.alert(title, message, [{ text: 'Coba Lagi', style: 'destructive' }], { cancelable: true });
  },

  confirm: (title = 'Apakah kamu yakin Melakukan Perubahan?', message = '', onConfirm = () => {}) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Ya', onPress: onConfirm }
      ],
      { cancelable: true }
    );
  }
};

export default AlertService;
