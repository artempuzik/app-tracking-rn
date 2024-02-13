import React, {useMemo} from 'react';
import {View, Text} from 'react-native';
import Svg, {Path} from "react-native-svg";
import styles from '../styles';
import {convertDate} from "../../../utils/helpers";
import {Image} from "expo-image";
import {useSelector} from "react-redux";
const EventItemElement = ({item, icons, profile}) => {
    const baseUrl = useSelector(state => state.app.currentServer)
    const statusColor = useMemo(() => {
        switch (item.status) {
            case '0': return "#ee0505"
            default: return "transparent"
        }
    }, [item])

    const car = useMemo(() => {
        return profile?.objects.find(object => object.id === item.trackerid)
    }, [item, profile])

    const icon = useMemo(() => {
        return icons?.find(icon => car?.iconid == icon.id)
    }, [car, icons])

    return (
        <View style={styles.eventItemBlock}>
            <View style={styles.mainRow}>
                <View>
                    <Image
                        style={styles.image}
                        height={icon?.height}
                        width={icon?.width}
                        source={baseUrl + icon?.url}
                        contentFit="fill"
                    />
                </View>
                <View>
                    <Text style={styles.idsBlock}>{car.name}</Text>
                    <Text style={styles.itemText}>{convertDate(item.time)}</Text>
                </View>
            </View>
            <View style={styles.subRow}>
                <View style={{padding: 10, marginRight: 10, backgroundColor: statusColor}}>
                    <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 352.8 341.8"
                    >
                        <Path d="M0 341.8h352.8L176.4 0 0 341.8zm32.8-20L176.4 43.6 320 321.8H32.8z"
                              fill={"#a7a7aa"}/>
                        <Path d="M161.7 258.6h29.5v33.2h-29.5z"
                              fill={"#a7a7aa"}/>
                        <Path d="M161.7 134.1h29.5v99h-29.5z"
                              fill={"#a7a7aa"}/>
                    </Svg>
                </View>
                <Text style={styles.itemText}>{item.text}</Text>
            </View>
        </View>
    );
};

export default EventItemElement;
