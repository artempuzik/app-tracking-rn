import Modal from "react-native-modal";
import styles from "./styles";
import React, {useCallback} from "react";
import {View} from "react-native";
import CustomButton from "../button/Button";
import i18n from "../../utils/i18";

const AppModal = ({isModalOpen, setIsModalOpen, children, onPress, buttonTitle = 'save'}) => {
    const pressHandler = useCallback(() => {
        if(onPress) {
            onPress()
        }
        setIsModalOpen(false)
    }, [onPress])
    return (
        <Modal
            style={styles.modalWrapper}
            animationInTiming={50}
            animationIn='fadeIn'
            animationOut='fadeOut'
            isVisible={isModalOpen}
            onBackdropPress={() => setIsModalOpen(false)}
        >
            <View style={styles.modalItem}>
                {children}
                <CustomButton title={i18n.t(buttonTitle)} onPress={pressHandler}/>
            </View>
        </Modal>
    )
}

export default AppModal
