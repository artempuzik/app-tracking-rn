import React, {useMemo} from 'react';
import { Image } from 'expo-image';
import {View, Text} from 'react-native';
import i18n from '../../../utils/i18'

const ObjectItemElement = ({item, icons, statuses}) => {
    const baseUrl = useSelector(state => state.app.currentServer)

    const icon = useMemo(() => {
        return icons.find(i => i.id === item.main.iconId)
    }, [item, icons])

    const point = useMemo(() => getItemPointByItemId(statuses, item), [item, statuses.points])

    const iopoint = useMemo(() => getItemIoPointsByItemId(statuses, item), [item, statuses])

    return (
        <View>
                <View style={styles.main}>
                    <View style={styles.leftBlock}>
                        <Image
                            style={styles.image}
                            height={icon?.height}
                            width={icon?.width}
                            source={baseUrl + icon?.url}
                            contentFit="fill"
                        />
                        <View style={styles.mainInfo}>
                            <Text style={styles.objectItemTitle}>{item.main.name}</Text>
                            <Text style={styles.subText}>{convertDate(point?.time)}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.footer}>
                    <View style={styles.footerElement}>
                        <Svg
                            style={{marginTop: 5}}
                            width={25}
                            height={25}
                            viewBox="0 0 25 25"
                        >
                            <Path d="M12.336 0C9.204 0 7.2 2.868 7.2 6c0 .672-.396.996-.204 1.668L0 14.664V18h3.6v-2.4H6v-1.2l1.332-.396 3-3c.6.204.936-.204 1.668-.204 3.132 0 6-2.004 6-5.136A5.664 5.664 0 0 0 12.336 0zm.164 7.8a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8z"
                                  fill={!!Number(iopoint?.value) ? "#2060ae" : "#a7a7aa"}/>
                        </Svg>
                        <Text>{!!Number(iopoint?.value) ? i18n.t('on') : i18n.t('off')}</Text>
                    </View>
                    <View style={styles.footerElement}>
                        {
                           !Boolean(+point?.speed) && !Number(iopoint?.value) ? (
                                <Svg
                                    width={25}
                                    height={25}
                                    viewBox="0 0 25 25"
                                >
                                    <Path d="M14.4 17.7H7.8c-.4 0-.7.5-.7 1 0 .6.3 1 .7 1h6.6c.4 0 .7-.5.7-1 .1-.5-.3-1-.7-1z" fill="#a7a7aa"/>
                                    <Path d="M18.2 16.3L16.6 15c1.7-2.1 2-5 .9-7.5-.5-1.1-1.5-2.1-2.6-2.8-1.1-.7-2.5-1.1-3.8-1.1-1.3 0-2.6.4-3.8 1.1-1.1.7-2 1.7-2.6 2.9-1.1 2.4-.8 5.4.9 7.5L4 16.3c-2.2-2.7-2.6-6.5-1.1-9.6.8-1.5 1.9-2.8 3.4-3.7 1.5-.9 3.1-1.4 4.8-1.4 1.7 0 3.4.5 4.9 1.4 1.4.9 2.6 2.2 3.3 3.8 1.5 3.1 1.1 6.8-1.1 9.5zm-6.4-5l-1.4-1.4 4-4 1.4 1.4-4 4z" fill="#a7a7aa"/>
                                    <Path d="M0 3.4L3.4 0 22 18.6 18.6 22 0 3.4z" fill="#a7a7aa"/>
                                    <Path d="M1 2.4L2.4 1 21 19.6 19.6 21 1 2.4z" fill="#a7a7aa"/>
                                </Svg>
                                ) : (
                                    <Svg
                                        style={{marginTop: 5}}
                                        width={25}
                                        height={25}
                                        viewBox="0 0 25 25"
                                    >
                                        <Path className="st0" d="M12.3 16H5.7c-.4 0-.7.5-.7 1s.3 1 .7 1h6.5c.4 0 .7-.5.7-1s-.2-1-.6-1z" fill="#2060ae"/>
                                        <Path className="st0" d="M16 14.6l-1.6-1.3c1.7-2.1 2-5 .9-7.4-.6-1.2-1.5-2.2-2.6-2.9-1.1-.6-2.4-1-3.7-1-1.3 0-2.6.4-3.7 1.1-1.2.7-2 1.7-2.6 2.9-1.2 2.4-.8 5.3.9 7.4L2 14.6C-.2 12-.6 8.2.9 5.1c.7-1.5 1.9-2.8 3.3-3.7C5.6.5 7.3 0 9 0c1.7 0 3.4.5 4.8 1.4 1.4.9 2.6 2.2 3.3 3.7 1.5 3.1 1.1 6.9-1.1 9.5zM9.7 9.7L8.3 8.3l4-4 1.4 1.4-4 4z" fill="#2060ae"/>
                                    </Svg>
                                )
                        }
                        <Text>{Number(point?.speed)} {i18n.t('speed_text')}</Text>
                    </View>
                    <View style={styles.footerElement}>
                        <Svg
                            style={{marginTop: 5}}
                            width={25}
                            height={25}
                            viewBox="0 0 25 25"
                        >
                            <Path d="M8.7 17c-2.1 0-4.2-.8-5.9-2.4-.6-.7-.6-1.7 0-2.4l9.4-9.5c.4-.3.8-.5 1.2-.5.4 0 .8.2 1.1.5 3.2 3.2 3.2 8.5 0 11.8-1.6 1.7-3.7 2.5-5.8 2.5zm-4.2-3.6c2.5 2.2 6.3 2.1 8.7-.2 2.3-2.4 2.4-6.2.2-8.7l-8.9 8.9z"
                                  fill={!!point?.online ? "#31a903" : "#a7a7aa"}/>
                            <Path d="M.1 6.9c0-.1-.4-2.8 1.3-4.8C2.5.7 4.4 0 6.8 0v2C5 2 3.7 2.5 2.9 3.4 1.8 4.7 2 6.6 2 6.6l-1.9.3zm5.4-.1h-2C3.5 5 5 3.5 6.8 3.5v2c-.7 0-1.3.6-1.3 1.3z"
                                  fill={!!point?.online ? "#31a903" : "#a7a7aa"}/>
                        </Svg>
                        {
                            !!point?.online ? <Text>{i18n.t('online')}</Text> : <Text>{i18n.t('offline')}</Text>
                        }
                    </View>
                </View>
        </View>
);
};
import styles from '../styles';
import Svg, {Path} from "react-native-svg";
import {PRESSED_COLOR} from "../../../config";
import {useSelector} from "react-redux";
import {convertDate, getItemIoPointsByItemId, getItemPointByItemId} from "../../../utils/helpers";

export default ObjectItemElement;
