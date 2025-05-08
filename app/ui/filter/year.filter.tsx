import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../constants/colors";

interface YearFilterProps {
  selectedYear: number;
  onSelectYear: (year: number) => void;
  startYear?: number;
  endYear?: number;
}

const YearFilter: React.FC<YearFilterProps> = ({ selectedYear, onSelectYear, startYear = 2024, endYear = new Date().getFullYear() }) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const years = React.useMemo(() => {
    const yearList = [];
    for (let year = endYear; year >= startYear; year--) {
      yearList.push(year);
    }
    return yearList;
  }, [startYear, endYear]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleYearSelect = (year: number) => {
    onSelectYear(year);
    toggleModal();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleModal}>
        <Text style={styles.dropdownButtonText}>{selectedYear}</Text>
        <Feather name="chevron-down" size={18} color={colors.black_60} />
      </TouchableOpacity>

      <Modal transparent={true} visible={modalVisible} animationType="fade" onRequestClose={toggleModal}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={toggleModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pilih Tahun</Text>
            <FlatList
              data={years}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={[styles.yearItem, selectedYear === item && styles.selectedYearItem]} onPress={() => handleYearSelect(item)}>
                  <Text style={[styles.yearItemText, selectedYear === item && styles.selectedYearItemText]}>{item}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={true}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dropdownButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.black,
    marginRight: 8,
    fontFamily: "Montserrat",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    width: "80%",
    maxHeight: "60%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 16,
    color: colors.primary,
    textAlign: "center",
    fontFamily: "Montserrat",
  },
  yearItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  selectedYearItem: {
    backgroundColor: colors.background_thin,
    borderRadius: 10,
  },
  yearItemText: {
    fontSize: 14,
    color: colors.black,
    fontFamily: "Montserrat",
  },
  selectedYearItemText: {
    color: colors.primary,
    fontWeight: "bold",
    fontFamily: "Montserrat",
  },
});

export default YearFilter;
