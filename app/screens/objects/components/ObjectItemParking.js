import React, {useCallback, useMemo, useState} from 'react';
import {View, Text, Pressable, TextInput} from 'react-native';
import Svg, {Path} from "react-native-svg";
import {useNavigation} from "@react-navigation/native";
import styles from '../styles';
import AppModal from "../../../components/modal/AppModal";
import DateTimePicker from "react-native-ui-datepicker";
import Button from "../../../components/button/Button";
import RadioForm from "react-native-simple-radio-button";
import {PARKING_OPTIONS} from "../../../config";
import AppCalendarFilter from "../../../components/calendar/AppCalendarFilter";

const initialFilters = {
    minParking: '',
    showParkingOptions: null,
}
const ObjectItemParking = ({object}) => {
    const navigation = useNavigation();

    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const [minParking, setMinParking] = useState(initialFilters.minParking)

    const [showParkingOptions, setShowParkingOptions] = useState(initialFilters.showParkingOptions);

    const saveFilters = useCallback(() => {
        setIsFiltersOpen(false)
    }, [minParking])

    const resetFilters = useCallback(() => {
        setMinParking('')
    },[])

    const pageBlock = useMemo(() => (
        <View style={styles.pageItemHeader}>
            <View style={styles.rightBlock}>
                <Pressable
                    style={({pressed}) => [
                        {
                            backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                        },
                        styles.headerItemButton,
                    ]}
                    onPress={() => navigation.navigate('Objects')}
                >
                    <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 15 15"
                    >
                        <Path d="M10 4H3l4-4H5L0 5l5 5h2L3 6h7V4z" fill="#a7a7aa"/>
                        <Path d="M0-54v36" fill="#a7a7aa"/>
                        <Path d="M-54 0h36" fill="#a7a7aa"/>
                        <Path d="M-54 10h36" fill="#a7a7aa"/>
                        <Path d="M0 64V28" fill="#a7a7aa"/>
                        <Path d="M12-54v36" fill="#a7a7aa"/>
                        <Path d="M66 0H30" fill="#a7a7aa"/>
                        <Path d="M66 10H30" fill="#a7a7aa"/>
                        <Path d="M12 64V28" fill="#a7a7aa"/>
                    </Svg>
                </Pressable>
                <View style={styles.leftBlock}>
                    <Svg
                        width={30}
                        height={30}
                        viewBox="0 0 313 512.52"
                    >
                        <Path d="M42.3 110.94c2.22 24.11 2.48 51.07 1.93 79.75-13.76.05-24.14 1.44-32.95 6.69-4.96 2.96-8.38 6.28-10.42 12.15-1.37 4.3-.36 7.41 2.31 8.48 4.52 1.83 22.63-.27 28.42-1.54 2.47-.54 4.53-1.28 5.44-2.33.55-.63 1-1.4 1.35-2.31 1.49-3.93.23-8.44 3.22-12.08.73-.88 1.55-1.37 2.47-1.61-1.46 62.21-6.21 131.9-2.88 197.88 0 43.41 1 71.27 43.48 97.95 41.46 26.04 117.93 25.22 155.25-8.41 32.44-29.23 30.38-50.72 30.38-89.54 5.44-70.36 1.21-134.54-.79-197.69.69.28 1.32.73 1.89 1.42 2.99 3.64 1.73 8.15 3.22 12.08.35.91.8 1.68 1.35 2.31.91 1.05 2.97 1.79 5.44 2.33 5.79 1.27 23.9 3.37 28.42 1.54 2.67-1.07 3.68-4.18 2.31-8.48-2.04-5.87-5.46-9.19-10.42-12.15-8.7-5.18-18.93-6.6-32.44-6.69-.75-25.99-1.02-51.83-.01-77.89C275.52-48.32 29.74-25.45 42.3 110.94zm69.63-90.88C83.52 30.68 62.75 48.67 54.36 77.59c21.05-15.81 47.13-39.73 57.57-57.53zm89.14-4.18c28.41 10.62 49.19 28.61 57.57 57.53-21.05-15.81-47.13-39.73-57.57-57.53zM71.29 388.22l8.44-24.14c53.79 8.36 109.74 7.72 154.36-.15l7.61 22.8c-60.18 28.95-107.37 32.1-170.41 1.49zm185.26-34.13c5.86-34.1 4.8-86.58-1.99-120.61-12.64 47.63-9.76 74.51 1.99 120.61zM70.18 238.83l-10.34-47.2c45.37-57.48 148.38-53.51 193.32 0l-12.93 47.2c-57.58-14.37-114.19-13.21-170.05 0zM56.45 354.09c-5.86-34.1-4.8-86.58 1.99-120.61 12.63 47.63 9.76 74.51-1.99 120.61z"
                              fill={object?.main.color || "#a7a7aa"}/>
                    </Svg>
                    <View style={styles.mainInfo}>
                        <Text style={{...styles.objectItemTitle, fontWeight: 'normal', fontSize: 12}}>{object?.main.name}</Text>
                        <Text style={{...styles.subText, fontSize: 12}}>{object?.main.comment}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.rightBlock}>
                <Pressable
                    style={({pressed}) => [
                        {
                            backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                        },
                        styles.headerRightButton,
                    ]}
                    onPress={() => setIsFiltersOpen(true)}
                >
                    <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                    >
                        <Path d="M7.527 9.45c.21.23.325.527.325.836v9.095c0 .547.66.825 1.052.44l2.537-2.907c.34-.408.526-.61.526-1.013v-5.613c0-.308.118-.607.325-.835l7.28-7.9C20.118.962 19.698 0 18.892 0H.927a.926.926 0 0 0-.681 1.554l7.28 7.897z"
                              fill="#a7a7aa"/>
                    </Svg>
                </Pressable>
                <Pressable
                    style={({pressed}) => [
                        {
                            backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                        },
                        styles.headerRightButton,
                    ]}
                    onPress={() => setIsCalendarOpen(true)}
                >
                    <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 19 14"
                    >
                        <Path d="M5 0h4v4H5zm5 0h4v4h-4zm5 0h4v4h-4zM5 5h4v4H5zM0 5h4v4H0zm10 0h4v4h-4zm-5 5h4v4H5zm-5 0h4v4H0zm10 0h4v4h-4zm5-5h4v4h-4z"
                              fill="#2060ae"/>
                    </Svg>
                </Pressable>
            </View>
        </View>
    ), [])

    const filtersBlock = useMemo(() => (
        <View style={{...styles.filtersContainer, display: isFiltersOpen ? 'flex' : 'none'}}>
            <View style={styles.screenTitle}>
                <Text>Фильтры</Text>
                <Pressable
                    style={styles.headerButton}
                    onPress={() => setIsFiltersOpen(false)}
                >
                    <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                    >
                        <Path d="M12.6 14L8.4 9.8l1.4-1.4 4.2 4.2-1.4 1.4zM1.4 14L0 12.6 12.6 0 14 1.4 1.4 14zm2.8-8.4L0 1.4 1.4 0l4.2 4.2-1.4 1.4z"
                              fill="#a7a7aa" />
                    </Svg>
                </Pressable>
            </View>
            <View style={styles.filtersMainContainer}>
                <View style={{paddingHorizontal: 20}}>
                    <View>
                        <TextInput
                            style={styles.input}
                            onChangeText={setMinParking}
                            value={minParking}
                            autoCorrect={false}
                            autoCapitalize='none'
                            placeholder="Minimum drive / km"
                        />
                    </View>
                    <View style={styles.radioButtonsContainer}>
                        <RadioForm
                            style={styles.radioButtons}
                            radio_props={PARKING_OPTIONS}
                            onPress={(value) => {
                                setShowParkingOptions(value);
                            }}
                            formHorizontal={false}
                            labelHorizontal={true}
                            initial={showParkingOptions}
                            selectedButtonColor={showParkingOptions !== null ? '#f8642f' : '#a7a7aa'}
                            buttonColor={'#a7a7aa'}
                            buttonSize={15}
                            animation={true}
                        />
                    </View>
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                            },
                            styles.resetButton,
                        ]}
                        onPress={resetFilters}
                    >
                        <Text style={styles.resetButtonText}>Сбросить фильтры</Text>
                    </Pressable>
                </View>
                <Pressable
                    style={({pressed}) => [
                        {
                            backgroundColor: pressed ? '#c7c7c9' : '#2060ae',
                        },
                        styles.saveFiltersButton,
                        {marginHorizontal: 20}
                    ]}
                    onPress={saveFilters}
                >
                    <Text style={styles.saveButtonText}>Сохранить</Text>
                </Pressable>
            </View>
        </View>
    ), [minParking, showParkingOptions, isFiltersOpen])

    return (
        <View style={styles.container}>
            {filtersBlock}
            <AppCalendarFilter isCalendarOpen={isCalendarOpen} setIsCalendarOpen={setIsCalendarOpen} setCalendarProperties={(data) => console.log(data)}/>
            {
                !isFiltersOpen && !isCalendarOpen ? pageBlock : null
            }
        </View>
    );
};

export default ObjectItemParking;
