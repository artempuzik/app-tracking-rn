import {Dimensions, StyleSheet} from 'react-native';

const { width} = Dimensions.get('window');

export default StyleSheet.create({
    modalWrapper: {
        justifyContent: 'center',
    },
    modalItem: {
        marginLeft: -18,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 5,
        width: width,
        position: 'absolute',
        backgroundColor: 'white',
    },
});
