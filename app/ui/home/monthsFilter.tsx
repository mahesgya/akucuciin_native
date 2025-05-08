import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors } from '../../constants/colors';

interface MonthOption {
  label: string;
  value: number;
}

interface MonthFilterProps {
  options: MonthOption[];
  selectedMonth: number | null;
  onSelectMonth: (month: number | null) => void;
}

const MonthFilter: React.FC<MonthFilterProps> = ({
  options,
  selectedMonth,
  onSelectMonth,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedMonth === null && styles.activeFilterButton,
          ]}
          onPress={() => onSelectMonth(null)} 
        >
          <Text
            style={[
              styles.filterText,
              selectedMonth === null && styles.activeFilterText,
            ]}
          >
            Semua
          </Text>
        </TouchableOpacity>

        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.filterButton,
              selectedMonth === option.value && styles.activeFilterButton,
            ]}
            onPress={() => {
              if (selectedMonth === option.value) {
                onSelectMonth(null); 
              } else {
                onSelectMonth(option.value); 
              }
            }}
          >
            <Text
              style={[
                styles.filterText,
                selectedMonth === option.value && styles.activeFilterText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  scrollContent: {
    paddingRight: 10,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: colors.gray,
    marginRight: 8,
  },
  activeFilterButton: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    color: colors.black_70,
    fontFamily: "Montserrat",
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default MonthFilter;
