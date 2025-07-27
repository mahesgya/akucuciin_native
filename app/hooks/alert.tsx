import React, { useState, useRef, useEffect, createContext, ReactNode } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type AlertType = 'success' | 'error' | 'confirm' | 'isClosed';

type ButtonType = {
  text: string;
  onPress?: () => void;
  style?: 'cancel' | 'destructive' | 'default';
};

type AlertDataType = {
  type: AlertType;
  title: string;
  message: string;
  buttons: ButtonType[];
};

type CustomAlertModalProps = {
  isVisible: boolean;
  onHide: () => void;
} & AlertDataType;

type AlertProviderProps = {
  children: ReactNode;
};

type AlertController = {
  showAlert: (type: AlertType, title: string, message: string, buttons: ButtonType[]) => void;
};


const CustomAlertModal: React.FC<CustomAlertModalProps> = ({ isVisible, type, title, message, buttons, onHide }) => {
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        damping: 15,
        stiffness: 100,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return { name: 'checkmark-circle' as const, color: '#28a745' };
      case 'error':
        return { name: 'close-circle' as const, color: '#dc3545' };
      case 'isClosed':
        return { name: 'lock-closed' as const, color: '#ffc107' };
      case 'confirm':
        return { name: 'help-circle' as const, color: '#3674B5' };
      default:
        return { name: 'alert-circle' as const, color: '#6c757d' };
    }
  };

  const icon = getIcon();

  return (
    <Modal transparent visible={isVisible} onRequestClose={onHide} animationType="fade">
      <View style={styles.modalBackdrop}>
        <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleValue }] }]}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon.name} size={60} color={icon.color} />
          </View>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.messageText}>{message}</Text>
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  button.style === 'destructive' && styles.destructiveButton,
                  button.style === 'cancel' && styles.cancelButton,
                  { flex: 1 }, 
                ]}
                onPress={() => {
                  onHide();
                  if (button.onPress) {
                    button.onPress();
                  }
                }}
              >
                <Text style={[
                  styles.buttonText,
                  button.style === 'cancel' && styles.cancelButtonText
                ]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};


export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [alertData, setAlertData] = useState<AlertDataType>({
    type: 'success',
    title: '',
    message: '',
    buttons: [],
  });

  const showAlert = (type: AlertType, title: string, message: string, buttons: ButtonType[]) => {
    setAlertData({ type, title, message, buttons });
    setIsVisible(true);
  };

  const onHide = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    AlertService.setAlert({ showAlert });
    return () => AlertService.setAlert(null); 
  }, []);

  return (
    <>
      {children}
      <CustomAlertModal
        isVisible={isVisible}
        type={alertData.type}
        title={alertData.title}
        message={alertData.message}
        buttons={alertData.buttons}
        onHide={onHide}
      />
    </>
  );
};

const AlertService = {
  _alert: null as AlertController | null,

  setAlert(alert: AlertController | null) {
    this._alert = alert;
  },

  success(title = 'Sukses', message = 'Berhasil melakukan aksi.') {
    this._alert?.showAlert('success', title, message, [{ text: 'Oke' }]);
  },

  error(title = 'Gagal Melakukan Aksi', message = 'Terjadi Kesalahan Coba Lagi.') {
    this._alert?.showAlert('error', title, message, [{ text: 'Coba Lagi', style: 'destructive' }]);
  },

  isClosed(title = 'Laundry Sedang Tutup', message = 'Jika ingin membuka kembali bisa melalui halaman profile.') {
    this._alert?.showAlert('isClosed', title, message, [{ text: 'Oke' , style: 'destructive'}]);
  },

  confirm(title = 'Apakah kamu yakin Melakukan Perubahan?', message = '', onConfirm: () => void = () => {}) {
    this._alert?.showAlert('confirm', title, message, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Ya', onPress: onConfirm },
    ]);
  },
};

export default AlertService;

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  iconContainer: {
    marginBottom: 16,
  },
  titleText: {
    fontSize: 22,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#3674B5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destructiveButton: {
    backgroundColor: '#dc3545',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#333',
  },
});