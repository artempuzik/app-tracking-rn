import React, {useMemo} from 'react';
import {View} from 'react-native';
import {LeafletView} from 'react-native-leaflet-view';
import styles from '../styles';
import {useSelector} from "react-redux";

const ObjectsMap = ({objects, icons}) => {
    const baseUrl = useSelector(state => state.app.currentServer)

    const markers = useMemo(() => objects.map( obj => {
        const icon = icons.find((ic) => ic.id === obj.main.iconId)
        if(!icon || !obj) {
            return {}
        }
        return {
        position: {
            lat: obj.main.latitude,
            lng: obj.main.longitude,
        },
        icon: baseUrl + icon.url,
        size: [icon.width, icon.height]
        }
    }
    ), [objects, icons])

    return (
        <View style={styles.container}>
            <LeafletView
                doDebug={false}
                mapMarkers={markers}
                mapCenterPosition={markers[0]?.position}
            />
        </View>
    );
};

export default ObjectsMap;
