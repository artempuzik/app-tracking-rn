import React, {useEffect, useMemo, useState} from "react";
import {Pressable, Text, View} from "react-native";
import styles from "../styles";
import Svg, {Path} from "react-native-svg";
import AppModal from "../../../components/modal/AppModal";
import DateTimePicker from "react-native-ui-datepicker";
import {convertDate} from "../../../utils/helpers";

const CalendarFilter = ({setCalendarProperties}) => {
    const [date, setDate] = useState(null)

    const [isOpenDateModal, setIsOpenDateModal] = useState(false)

    const formatedDate = useMemo(() => {
        return date ? convertDate(new Date(date)) : convertDate(new Date())
    }, [date])

    useEffect(() => {
        setCalendarProperties(+new Date(date))
    }, [date])

    return (
                <View style={{paddingHorizontal: 20}}>
                    <Pressable
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? '#c7c7c9' : 'transparent',
                            },
                            styles.filterRow,
                        ]}
                        onPress={() => setIsOpenDateModal(true)}
                    >
                        <Svg
                            width={20}
                            height={20}
                            viewBox="0 0 19 14"
                        >
                            <Path d="M5 0h4v4H5zm5 0h4v4h-4zm5 0h4v4h-4zM5 5h4v4H5zM0 5h4v4H0zm10 0h4v4h-4zm-5 5h4v4H5zm-5 0h4v4H0zm10 0h4v4h-4zm5-5h4v4h-4z"
                                  fill="#a7a7aa"/>
                        </Svg>
                        <Text style={styles.filterRowText}>{formatedDate}</Text>
                        <AppModal isModalOpen={isOpenDateModal} setIsModalOpen={setIsOpenDateModal}>
                            <DateTimePicker
                                mode="datetime"
                                onValueChange={setDate}
                            />
                        </AppModal>
                    </Pressable>
                </View>
    )
}

export default CalendarFilter
