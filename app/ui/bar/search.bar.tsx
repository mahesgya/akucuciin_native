import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import colors  from '../../constants/colors';

type SearchBarProps = {
    value: string;
    onChangeText: (text: string) => void;
    onSubmit: () => void;
  }
  
const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, onSubmit }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search"
        placeholderTextColor={colors.primary_40}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
      />
      {value ? (
        <TouchableOpacity onPress={() => onChangeText('')}>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginVertical: 10,
    marginHorizontal: 10,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.primary_65,

  },
});

export default SearchBar;