import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {LeafletView} from 'react-native-leaflet-view';
import styles from './styles';
import AppHeader from "../../components/header/AppHeader";
import {useDispatch, useSelector} from "react-redux";
import {getObjects, getObjectIcons} from "../../store/objects/objectsActions";

const ObjectsMapScreen = ({navigation}) => {
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)


    const [errorMsg, setErrorMsg] = useState(null);

    const [objects, setObjects] = useState([])
    const [icons, setIcons] = useState([]);

    const baseUrl = useSelector(state => state.app.currentServer)

    const fetchData = async () => {
        try {
            setIsLoading(true)
            await dispatch(getObjects()).then(async (data) => {
                if (data.response) {
                    setObjects(data.response)
                    await dispatch(getObjectIcons()).then((data) => {
                        if (data.response) {
                            setIcons(data.response)
                        }
                    })
                }
            })
        } catch (err) {
            setErrorMsg(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData().catch(() => {})
    }, []);

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
        animation: {
            type: 'spin',
            duration: icon.rotate ? 5 : 10000,
        },
        icon: baseUrl + icon.url,
        size: [icon.width, icon.height]
        }
    }
    ), [objects, icons])

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader canGoBack={true} />
            {
                errorMsg && <Text>{errorMsg}</Text>
            }
            {
                isLoading ? <ActivityIndicator style={{marginTop: 50}} size="large" color="#2060ae" /> : (
                    <View style={styles.container}>
                        <LeafletView
                            doDebug={false}
                            mapMarkers={markers}
                            mapCenterPosition={markers[0]?.position}
                        />
                    </View>
                )
            }
        </SafeAreaView>
    );
};

export default ObjectsMapScreen;
