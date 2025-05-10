import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import colors from '../../constants/colors';

interface StatusOption {
  label: string;
  value: string;
  color: string;
}

interface StatusFilterProps {
  options: StatusOption[];
  selectedStatus: string | null;
  onSelectStatus: (status: string | null) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  options,
  selectedStatus,
  onSelectStatus,
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
            selectedStatus === null && styles.activeFilterButton,
          ]}
          onPress={() => onSelectStatus(null)}
        >
          <Text
            style={[
              styles.filterText,
              selectedStatus === null && styles.activeFilterText,
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
              selectedStatus === option.value && styles.activeFilterButton,
              { backgroundColor: colors.gray },
              selectedStatus === option.value && { backgroundColor: colors.primary },
            ]}
            onPress={() => {
              if (selectedStatus === option.value) {
                onSelectStatus(null);
              } else {
                onSelectStatus(option.value);
              }
            }}
          >
            <Text
              style={[
                styles.filterText,
                { color: colors.black_70 },
                selectedStatus === option.value && styles.activeFilterText,
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

export default StatusFilter;