import Modal from "react-native-modal";
import styles from "./styles";
import React from "react";
import {View} from "react-native";
import CustomButton from "../button/Button";

const AppModal = ({isModalOpen, setIsModalOpen, children}) => {
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
                <CustomButton title={'Сохранить'} onPress={() => setIsModalOpen(false)}/>
            </View>
        </Modal>
    )
}

export default AppModal
