import {Dimensions, Platform, StyleSheet} from 'react-native';

const { width, height } = Dimensions.get('window');

const isAndroid = Platform.OS === 'android'

export default StyleSheet.create({
    headerInner: {
        width: '100%',
        height: 60,
        backgroundColor: '#2060ae',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    headerLogo: {
        height: 30,
    },
    logo: {
        height: 30,
    },
    headerButton: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalWrapper: {
        top: isAndroid ? 45 : 90,
        paddingHorizontal: 0,
        justifyContent: 'flex-start'
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
    text: {
        color: 'black',
        opacity: 0.6,
        marginVertical: 5,
    },
    block: {
        marginVertical: 5,
    },
    profile: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    balance: {
        color: 'green'
    },
    line: {
       height: 1,
       backgroundColor: '#a7a7aa',
       marginTop: 20,
       marginBottom: 10,
    },
    logout: {
        padding: 10,
        flexDirection: 'row',
    }
});
