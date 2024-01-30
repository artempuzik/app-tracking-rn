import React, {useEffect, useState} from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, {Path} from "react-native-svg";
import i18n from "../../utils/i18"

const SearchInput = ({onChange}) => {
    const [value, setValue] = useState('')

    useEffect(() =>{
        onChange(value)
    }, [value])
    return (
        <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
                <View style={styles.searchInputContainer}>
                    <TextInput
                        style={styles.searchInput}
                        onChangeText={setValue}
                        value={value}
                        placeholder={i18n.t('search')}
                        placeholderTextColor="#999"
                    />
                </View>
                <TouchableOpacity style={styles.searchIconContainer}>
                    <Svg
                        width={30}
                        height={30}
                        viewBox="0 0 25 25"
                    >
                        <Path d="M6.702 0a6.685 6.685 0 0 0-5.499 2.864 6.696 6.696 0 0 0 3.812 10.31 6.685 6.685 0 0 0 6.037-1.406l.281.292v.81L16.471 18 18 16.47l-5.127-5.152h-.809l-.292-.282a6.686 6.686 0 0 0-1.465-9.98A6.674 6.674 0 0 0 6.702 0zm0 11.318a4.63 4.63 0 0 1-4.28-2.862 4.638 4.638 0 0 1 3.376-6.32 4.629 4.629 0 0 1 4.755 1.971 4.64 4.64 0 0 1 .78 2.576 4.627 4.627 0 0 1-2.857 4.285 4.618 4.618 0 0 1-1.774.35z"
                        fill="#a7a7aa"/>
                    </Svg>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flex: 1,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        paddingVertical: 5,
    },
    searchInputContainer: {
        flex: 1,
    },
    searchInput: {
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#333',
    },
    searchIconContainer: {
        padding: 5,
    },
    searchIcon: {
        width: 20,
        height: 20,
        tintColor: '#666',
    },
});

export default SearchInput;
