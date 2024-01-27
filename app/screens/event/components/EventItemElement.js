import React, {useMemo} from 'react';
import {View, Text} from 'react-native';
import Svg, {Path} from "react-native-svg";
import styles from '../styles';
const EventItemElement = ({item}) => {

    const statusColor = useMemo(() => {
        switch (item.status) {
            case '1': return "#ea832e"
            case '2': return "#ee0505"
            default: return "transparent"
        }
    }, [item])

    return (
        <View style={styles.eventItemBlock}>
            <View style={styles.mainRow}>
                <View>
                    <Svg
                        width={30}
                        height={30}
                        viewBox="0 0 313 512.52"
                    >
                        <Path d="M42.3 110.94c2.22 24.11 2.48 51.07 1.93 79.75-13.76.05-24.14 1.44-32.95 6.69-4.96 2.96-8.38 6.28-10.42 12.15-1.37 4.3-.36 7.41 2.31 8.48 4.52 1.83 22.63-.27 28.42-1.54 2.47-.54 4.53-1.28 5.44-2.33.55-.63 1-1.4 1.35-2.31 1.49-3.93.23-8.44 3.22-12.08.73-.88 1.55-1.37 2.47-1.61-1.46 62.21-6.21 131.9-2.88 197.88 0 43.41 1 71.27 43.48 97.95 41.46 26.04 117.93 25.22 155.25-8.41 32.44-29.23 30.38-50.72 30.38-89.54 5.44-70.36 1.21-134.54-.79-197.69.69.28 1.32.73 1.89 1.42 2.99 3.64 1.73 8.15 3.22 12.08.35.91.8 1.68 1.35 2.31.91 1.05 2.97 1.79 5.44 2.33 5.79 1.27 23.9 3.37 28.42 1.54 2.67-1.07 3.68-4.18 2.31-8.48-2.04-5.87-5.46-9.19-10.42-12.15-8.7-5.18-18.93-6.6-32.44-6.69-.75-25.99-1.02-51.83-.01-77.89C275.52-48.32 29.74-25.45 42.3 110.94zm69.63-90.88C83.52 30.68 62.75 48.67 54.36 77.59c21.05-15.81 47.13-39.73 57.57-57.53zm89.14-4.18c28.41 10.62 49.19 28.61 57.57 57.53-21.05-15.81-47.13-39.73-57.57-57.53zM71.29 388.22l8.44-24.14c53.79 8.36 109.74 7.72 154.36-.15l7.61 22.8c-60.18 28.95-107.37 32.1-170.41 1.49zm185.26-34.13c5.86-34.1 4.8-86.58-1.99-120.61-12.64 47.63-9.76 74.51 1.99 120.61zM70.18 238.83l-10.34-47.2c45.37-57.48 148.38-53.51 193.32 0l-12.93 47.2c-57.58-14.37-114.19-13.21-170.05 0zM56.45 354.09c-5.86-34.1-4.8-86.58 1.99-120.61 12.63 47.63 9.76 74.51-1.99 120.61z"
                              fill={"#a7a7aa"}/>
                    </Svg>
                </View>
                <View>
                    <Text style={styles.idsBlock}>{item.trackerid}</Text>
                    <Text style={styles.itemText}>{new Date(item.time).toLocaleString()}</Text>
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
