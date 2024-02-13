import React, {useMemo} from 'react';
import {View, Text, Pressable} from 'react-native';
import styles from '../styles';
import Svg, {Path} from "react-native-svg";
import i18n from "../../../utils/i18";
import {circleArea, getPolylineLength, polygonArea} from "../../../utils/helpers";
const GeozoneItemElement = ({item}) => {
    const points = useMemo(() => {
        const mapPoints = []
        item?.points.split(' ').forEach(point => {
            if(!mapPoints.length) {
                mapPoints.push({lat: point})
            } else {
                const lastPoint = mapPoints[mapPoints.length - 1]
                if(lastPoint.lng) {
                    mapPoints.push({lat: point})
                } else {
                    lastPoint.lng = point
                }
            }
        })

        switch (item?.style.type) {
            case 'point':
                return {
                    radius: item.radius,
                }
            case 'polygon':
                return {
                    positions: mapPoints,
                }
            case 'polyline':
                return {
                    positions: mapPoints,
                }
            default: return null
        }
    }, [item]);

    const total = useMemo(() => {
        if(!points) {
            return
        }
        switch (item?.style.type) {
            case 'point':
                return `S=${circleArea(points.radius)} km2`
            case 'polygon':
                return `S=${polygonArea(points.positions)} km2`
            case 'polyline':
                return `L=${getPolylineLength(points.positions)} km`
            default: return null
        }
    }, [points]);
    const image = useMemo(() => {
        switch (item?.style.type) {
            case 'polygon':
                return (
                    <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 16 16"
                    >
                        <Path className="st0" d="M15 15H1V1h14v14zM3 13h10V3H3v10z"
                              fill="#a7a7aa"/>
                        <Path className="st0" d="M0 0h4v4H0z"
                              fill="#a7a7aa"/>
                        <Path className="st0" d="M12 0h4v4h-4z"
                              fill="#a7a7aa"/>
                        <Path className="st0" d="M12 12h4v4h-4z"
                              fill="#a7a7aa"/>
                        <Path class="st0" d="M0 12h4v4H0z"
                              fill="#a7a7aa"/>
                    </Svg>
                )
            case 'polyline':
                return (
                    <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 16 16"
                    >
                        <Path d="M14 8l.447.894a1 1 0 0 0 0-1.788L14 8zM2.447 14.894l12-6-.894-1.788-12 6 .894 1.788zm12-7.788l-12-6-.894 1.788 12 6 .894-1.788z"
                              fill="#a7a7aa"/>
                        <Path d="M0 0h4v4H0zm12 6h4v4h-4zM0 12h4v4H0z"
                              fill="#a7a7aa"/>
                    </Svg>
                )
            case 'point':
                return (
                    <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 16 16"
                    >
                        <Path className="st0" d="M8 16c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zM8 2C4.7 2 2 4.7 2 8s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z"
                              fill="#a7a7aa"/>
                    </Svg>
                )
            default: return null
        }

    }, [item])
    const lengthIcon = useMemo(() => {
        switch (item?.style.type) {
            case 'point':
            case 'polygon':
                return (
                    <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 16 16"
                    >
                        <Path class="st0" d="M1.4 5.4L0 3.9 4 .1 7.8 4 6.3 5.4 4 2.9z" fill="#a7a7aa"/>
                        <Path class="st0" d="M13 17l-1.4-1.5 2.5-2.4-2.5-2.5L13 9.2l3.9 3.9z" fill="#a7a7aa"/>
                        <Path class="st0" d="M2.8 2.5h2.1v11.6H2.8z" fill="#a7a7aa"/>
                        <Path class="st0" d="M2.8 12h11.6v2.1H2.8z" fill="#a7a7aa"/>
                    </Svg>
                )
            case 'polyline':
                return (
                    <Svg
                        width={20}
                        height={20}
                        viewBox="0 0 13 13"
                    >
                        <Path d="M12 8v4H8" strokeWidth="2" fill="#a7a7aa"/>
                        <Path d="M1 5V1h4" strokeWidth="2" fill="#a7a7aa"/>
                        <Path d="M12.042 10.628l-1.414 1.415L1 2.414 2.414 1z" fill="#a7a7aa"/>
                    </Svg>
                )
            default: return null
        }

    }, [item])
    return (
            <View style={styles.main}>
                <View style={styles.leftBlock}>
                {image}
                <View style={styles.mainInfo}>
                    <Text style={styles.objectItemTitle}>{item.name}</Text>
                    <Text style={styles.subText}>{item.comment}</Text>
                </View>
            </View>
            <View style={{...styles.footer, marginTop: 10, paddingHorizontal: 20}}>
                <View style={styles.footerElement}>
                    {lengthIcon}
                    <Text>{total}</Text>
                </View>
                <View style={styles.footerElement}>
                    {
                        !Boolean(+item?.maxSpeed) ? (
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
                    <Text>{Number(+item?.maxSpeed).toFixed(1)} {i18n.t('speed_text')}</Text>
                </View>
            </View>
        </View>
    );
};

export default GeozoneItemElement;
