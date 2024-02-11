import React from 'react';
import {View, Text} from 'react-native';
const GasStationItemElement = ({item}) => {
    return (
        <View style={styles.gasItemBlock}>
            <View style={{...styles.itemRow, marginBottom: 20}}>
                <Text style={styles.idsBlock}>{item.innerID}</Text>
                <Text style={styles.itemText}>{convertDate(item.time)}</Text>
            </View>
            <View style={styles.itemRow}>
                <Text style={styles.itemText}>{i18n.t('station')}</Text>
                <Text style={styles.itemText}>{item.objectName}</Text>
            </View>
            <View style={styles.itemRow}>
                <Text style={styles.itemText}>{i18n.t('fuel_amount')}</Text>
                <Text style={styles.itemText}>{item.value} l</Text>
            </View>
            <View style={styles.itemRow}>
                <Text style={styles.itemText}>{i18n.t('vehicle')}</Text>
                <Text style={styles.itemText}>{item.keyName}</Text>
            </View>
        </View>
);
};
import styles from '../styles';
import Svg, {Path} from "react-native-svg";
import {PRESSED_COLOR} from "../../../config";
import i18n from "../../../utils/i18";
import {convertDate} from "../../../utils/helpers";

export default GasStationItemElement;
