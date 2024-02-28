import React, {useEffect, useMemo, useState} from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { View, StyleSheet } from 'react-native';
import i18n from "../../utils/i18";

const SelectList = ({items = [], value = null, onChange}) => {
  const [selectedValue, setSelectedValue] = useState(value);

    const formatArray = useMemo(() => {
        return items.map(item => ({
            label: Object.values(item)[0], value: Object.keys(item)[0]
        }))
    }, [items])

      useEffect(() =>{
          onChange(selectedValue)
      }, [selectedValue])

  return (
      <View style={styles.container}>
        <RNPickerSelect
            onValueChange={(itemValue) => setSelectedValue(itemValue)}
            items={formatArray}
            style={pickerSelectStyles}
            value={selectedValue || null}
            placeholder={{value: 'select_item', label: i18n.t('select_item')}}
        />
      </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowIcon: {
        marginTop: 8,
        marginRight: 8,
    },
    arrowText: {
        marginTop: 5,
        fontSize: 13,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#a7a7aa',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        backgroundColor: 'transparent',
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: '#a7a7aa',
        borderRadius: 8,
        paddingRight: 30,
        backgroundColor: 'transparent',
    },
});

export default SelectList;
