import {Text, View} from "react-native";
import Svg, {Path} from "react-native-svg";
import React from "react";
import styles from "../styles";

const UserItemElement = ({ user, isCurrent }) => {
    return (
        <View style={styles.itemBlock}>
            <View style={styles.mainItemBlock}>
                <Svg
                    width={20}
                    height={20}
                    viewBox="0 0 16 18"
                >
                    <Path d="M8 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" fill="#a7a7aa"/>
                    <Path d="M8 10a8 8 0 0 1 8 8H0a8 8 0 0 1 8-8z" fill="#a7a7aa"/>
                </Svg>
                <Text style={{marginLeft: 10}}>{user.name || user.email}</Text>
            </View>
            {
                isCurrent && (
                    <Svg
                        width={13}
                        height={13}
                        viewBox="0 0 16 18"
                    >
                        <Path d="M6.3 13L0 8.4l1.2-1.6 4.7 3.4L12.8 0l1.6 1.1z" fill="#2471be"/>
                    </Svg>
                )
            }
        </View>
    )
}

export default UserItemElement
