import React, {useMemo} from 'react';
import {View, Text} from 'react-native';
import Svg, {Path} from "react-native-svg";
import styles from '../styles';
import {Image} from "expo-image";
import {useSelector} from "react-redux";
import {convertDate} from "../../../utils/helpers";
const ServiceItemElement = ({item, icons}) => {
    const baseUrl = useSelector(state => state.app.currentServer)

    const statusColor = useMemo(() => {
        switch (item?.service.status) {
            case 1: return "#ea832e"
            case 2: return "#ee0505"
            default: return "transparent"
        }
    }, [item])

    const icon = useMemo(() => {
        return icons.find(i => i.id === item?.main.iconId)
    }, [item, icons])

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
                    <Text style={styles.idsBlock}>{item.main.name}</Text>
                    <Text style={styles.itemText}>{convertDate(item.service.installedAt)}</Text>
                </View>
            </View>
            <View style={styles.subRow}>
                <View style={{padding: 10, marginRight: 10, backgroundColor: statusColor}}>
                    <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 612 612"
                    >
                        <Path d="M587.572 186.881c-32.266-75.225-87.096-129.934-162.949-162.285C386.711 8.427 346.992.168 305.497.168c-41.488 0-80.914 8.181-118.784 24.428-75.225 32.265-130.298 86.939-162.621 162.285C7.895 224.629 0 264.176 0 305.664c0 41.496 7.895 81.371 24.092 119.127 32.323 75.346 87.403 130.348 162.621 162.621 37.877 16.247 77.295 24.42 118.784 24.42 41.489 0 81.214-8.259 119.12-24.42C500.47 555.06 555.3 500.009 587.573 424.791 603.819 386.914 612 347.16 612 305.664c0-41.488-8.174-80.907-24.428-118.783zm-48.848 253.972c-24.021 41.195-56.929 73.876-98.375 98.039-41.195 24.021-86.332 36.135-134.845 36.135-36.47 0-71.27-7.024-104.4-21.415-33.129-14.384-61.733-33.294-85.661-57.215-23.928-23.928-42.973-52.811-57.214-85.997-14.199-33.065-21.08-68.258-21.08-104.735 0-48.52 11.921-93.428 35.807-134.509 23.971-41.231 56.886-73.947 98.039-98.04 41.146-24.092 85.99-36.142 134.502-36.142 48.52 0 93.649 12.121 134.845 36.142 41.446 24.164 74.283 56.879 98.375 98.039 24.092 41.153 36.135 85.99 36.135 134.509 0 48.521-11.964 93.735-36.128 135.189z"
                              fill={"#a7a7aa"}/>
                        <Path d="M324.906 302.988V129.659c0-10.372-9.037-18.738-19.41-18.738-9.701 0-18.403 8.366-18.403 18.738v176.005c0 .336.671 1.678.671 2.678-.671 6.024 1.007 11.043 5.019 15.062L392.836 423.45c6.695 6.695 19.073 6.695 25.763 0 7.694-7.695 7.188-18.86 0-26.099l-93.693-94.363z"
                              fill={"#a7a7aa"}/>
                    </Svg>
                </View>
                <Text style={styles.itemText}>{item?.service.comment}</Text>
            </View>
        </View>
);
};

export default ServiceItemElement;
