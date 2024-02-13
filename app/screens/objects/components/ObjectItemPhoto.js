import React, {useMemo, useState} from 'react';
import {View, Text, Pressable, ScrollView} from 'react-native';
import Svg, {Path} from "react-native-svg";
import {useNavigation} from "@react-navigation/native";
import styles from '../styles';
import AppCalendarFilter from "../../../components/calendar/AppCalendarFilter";
import {useSelector} from "react-redux";
import {Image} from "expo-image";

const ObjectItemPhoto = ({object}) => {
    const navigation = useNavigation();

    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const icons = useSelector(state => state.objects.icons)
    const baseUrl = useSelector(state => state.app.currentServer)

    const icon = useMemo(() => {
        return icons.find((ic) => ic.id === object?.main.iconId)
    }, [object, icons])

    const pageBlock = useMemo(() => (
        <View stylw={{flex: 1}}>
            <View style={styles.pageItemHeader}>
                <View style={styles.rightBlock}>
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                            },
                            styles.headerItemButton,
                        ]}
                        onPress={() => navigation.goBack()}
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
                        <Image
                            style={styles.image}
                            height={icon?.height}
                            width={icon?.width}
                            source={baseUrl + icon?.url}
                            contentFit="fill"
                        />
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
            {/*<ScrollView>*/}
            {/*    {*/}
            {/*        icons.map(icon => (*/}
            {/*            <View>*/}
            {/*                <Image*/}
            {/*                    style={styles.image}*/}
            {/*                    height={icon?.height}*/}
            {/*                    width={icon?.width}*/}
            {/*                    source={{uri: icon.base64String}}*/}
            {/*                    contentFit="fill"*/}
            {/*                />*/}
            {/*                <Text>*/}
            {/*                    {icon.id}*/}
            {/*                    {icon.url}*/}
            {/*                </Text>*/}
            {/*            </View>*/}
            {/*        ))*/}
            {/*    }*/}
            {/*</ScrollView>*/}
        </View>
), [])

    return (
        <View style={styles.container}>
            <AppCalendarFilter isCalendarOpen={isCalendarOpen} setIsCalendarOpen={setIsCalendarOpen} setCalendarProperties={(data) => console.log(data)}/>
            {
                !isCalendarOpen ? pageBlock : null
            }
        </View>
    );
};

export default ObjectItemPhoto;
