import {ActivityIndicator, View} from "react-native";
import React from "react";

const Loading = ({isLoading}) => {
    if(!isLoading) {
        return null
    }
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" />
        </View>
    )
}

export default Loading
