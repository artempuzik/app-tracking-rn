import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, Pressable, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import Svg, {Circle, Path} from "react-native-svg";
import {useDispatch, useSelector} from "react-redux";
import i18n from '../../utils/i18';
import ObjectItemInfo from "./components/ObjectItemInfo";
import AppHeader from "../../components/header/AppHeader";
import styles from './styles';
import ObjectItemRoutes from "./components/ObjectItemRoutes";
import ObjectItemParking from "./components/ObjectItemParking";
import ObjectItemPhoto from "./components/ObjectItemPhoto";
import ObjectItemStatistics from "./components/ObjectItemStatistics";
import {getObjectById, getObjectStatusById} from "../../store/objects/objectsActions";

const ObjectItemScreen = ({navigation}) => {
    const route = useRoute();
    const dispatch = useDispatch()
    const refreshInterval = useSelector(state => state.user.refreshInterval)
    const interval = useRef(null)

    const [object, setObject] = useState(null)
    const [status, setStatus] = useState(null)

    const [isLoading, setIsLoading] = useState(false)

    const [icon, setIcon] = useState(0)

    const getObjectsData = useCallback(async () => {
        await dispatch(getObjectById(route.params.id)).then(async (data) =>{
            if(data.response) {
                setObject(data.response)
            }
        })
    }, [route.params.id])

    const getObjectStatusData = useCallback(async () => {
        await dispatch(getObjectStatusById(route.params.id)).then(async (data) =>{
            if(data.response) {
                setStatus(data.response)
            }
        })
    }, [route.params.id])
    const fetchData = async () => {
        try {
            setIsLoading(true)
            await getObjectsData()
            await getObjectStatusData()
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData().catch(() => {})
    }, []);

    useEffect(() => {
        interval.current = setInterval(async () => await getObjectStatusData(), refreshInterval)
        return () => {
            console.log('CLOSE OBJECT ID SCREEN')
            clearInterval(interval.current)
            interval.current = null
        }
    })

    const pages = useMemo(() => {
        return (<View style={{flex: 1}}>
            <ObjectItemRoutes object={object} style={{display: icon===1 ? 'flex' : 'none'}}/>
            <ObjectItemParking object={object} style={{display: icon===2 ? 'flex' : 'none'}}/>
            <ObjectItemStatistics object={object} style={{display: icon===3 ? 'flex' : 'none'}}/>
            <ObjectItemPhoto object={object} style={{display: icon===4 ? 'flex' : 'none'}}/>
            <ObjectItemInfo object={object} status={status} style={{display: icon===0 ? 'flex' : 'none'}}/>
        </View>)
    }, [icon, object, status])

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader canGoBack={true} />
            <View style={styles.pageIconsBlock}>
                <Pressable
                    style={({pressed}) => [
                        {
                            backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                        },
                        styles.headerItemIcon,
                    ]}
                    onPress={() => setIcon(0)}
                >
                    <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 510 510"
                    >
                        <Path d="M255 0C114.8 0 0 114.8 0 255s114.8 255 255 255 255-114.8 255-255S395.3 0 255 0zm25.5 408h-51V204h51v204zm0-255h-51v-51h51v51z"
                              fill={icon === 0 ? "#2060ae" : "#a7a7aa"}/>
                    </Svg>
                    {
                        icon === 0 ? <Text style={styles.iconTitle}>{i18n.t('info')}</Text> : <Text></Text>
                    }
                </Pressable>
                <Pressable
                    style={({pressed}) => [
                        {
                            backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                        },
                        styles.headerItemIcon,
                    ]}
                    onPress={() => setIcon(1)}
                >
                    <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                    >
                        <Path fillRule="evenodd" d="M9 0H4L0 20h7l.4-4h5.2l.4 4h7L16 0h-5l.4 4H8.6L9 0zm3.3 13l-.7-7H8.4l-.7 7h4.6z" clipRule="evenodd"
                              fill={icon === 1 ? "#2060ae" : "#a7a7aa"}/>
                    </Svg>
                    {
                        icon === 1 ? <Text style={styles.iconTitle}>{i18n.t('roads')}</Text> : <Text></Text>
                    }
                </Pressable>
                <Pressable
                    style={({pressed}) => [
                        {
                            backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                        },
                        styles.headerItemIcon,
                    ]}
                    onPress={() => setIcon(2)}
                >
                    <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                    >
                        <Path fillRule="evenodd" d="M2.225 0h15.55A2.224 2.224 0 0 1 20 2.216v15.487c0 .588-.234 1.152-.652 1.567a2.23 2.23 0 0 1-1.573.65H2.225a2.23 2.23 0 0 1-1.573-.65A2.211 2.211 0 0 1 0 17.703V2.216C0 1.628.234 1.065.652.649A2.23 2.23 0 0 1 2.225 0zm9.568 4.15c.484.186.927.497 1.299.91.314.346.56.774.715 1.25.156.476.219.989.184 1.499.03.51-.035 1.02-.19 1.496a3.528 3.528 0 0 1-.71 1.252c-.793.74-1.891 1.098-2.796 1.098H8v4.28H6V3.985h4.468c.548-.002.886-.004 1.325.165zm-.845 5.69c.24-.102.461-.265.645-.478.325-.423.504-.978.5-1.553a2.437 2.437 0 0 0-.5-1.434c-.183-.255-.384-.384-.645-.51-.26-.124-.668-.235-.948-.202H8V9.96h2.195c.255.024.512-.016.753-.12z" clipRule="evenodd"
                              fill={icon === 2 ? "#2060ae" : "#a7a7aa"}/>
                    </Svg>
                    {
                        icon === 2 ? <Text style={styles.iconTitle}>{i18n.t('parking')}</Text> : <Text></Text>
                    }
                </Pressable>
                <Pressable
                    style={({pressed}) => [
                    {
                        backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                    },
                    styles.headerItemIcon,
                    ]}
                    onPress={() => setIcon(3)}
                    >
                    <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 16 20"
                    >
                        <Path d="M0 11h4v9H0zM6 0h4v20H6zm6 8h4v12h-4z"
                              fill={icon === 3 ? "#2060ae" : "#a7a7aa"}/>
                    </Svg>
                    {
                        icon === 3 ? <Text style={styles.iconTitle}>{i18n.t('report')}</Text> : <Text></Text>
                    }
                </Pressable>
                <Pressable
                    style={({pressed}) => [
                        {
                            backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                        },
                        styles.headerItemIcon,
                    ]}
                    onPress={() => setIcon(4)}
                >
                    <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 20 17"
                    >
                        <Path fillRule="evenodd" d="M17.045 3c.74 0 1.944 0 2.455.5.501.492.5.972.5 1.652v9.232c0 .722-.26 1.339-.781 1.85a2.6 2.6 0 0 1-1.886.766H2.667a2.595 2.595 0 0 1-1.886-.767 2.495 2.495 0 0 1-.78-1.849V5.151C-.002 4.47-.002 3.99.5 3.5 1.01 3 2.214 3 2.954 3H5l.531-1.774c.132-.334.373-.621.724-.863S6.965 0 7.333 0h5.334c.368 0 .727.121 1.078.363.35.242.592.53.724.863L15 3h2.046zM6.467 6.467C7.445 5.49 8.623 5 10 5c1.377 0 2.555.489 3.533 1.467C14.51 7.445 15 8.623 15 10c0 1.377-.49 2.555-1.467 3.533C12.555 14.511 11.377 15 10 15c-1.377 0-2.555-.49-3.533-1.467C5.49 12.555 5 11.377 5 10c0-1.377.49-2.555 1.467-3.533z" clipRule="evenodd"
                              fill={icon === 4 ? "#2060ae" : "#a7a7aa"}/>
                        <Circle cx="10" cy="10" r="3"
                                fill={icon === 4 ? "#2060ae" : "#a7a7aa"}/>
                    </Svg>
                    {
                        icon === 4 ? <Text style={styles.iconTitle}>{i18n.t('photo')}</Text> : <Text></Text>
                    }
                </Pressable>
            </View>
            <View style={{flex: 1}}>
                {
                    isLoading ? <ActivityIndicator style={{marginTop: 50}} size="large" color="#2060ae" /> : pages
                }
            </View>
        </SafeAreaView>
    );
};

export default ObjectItemScreen;
