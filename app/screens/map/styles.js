import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    pageHeader: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    headerButton: {
        padding: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerItemButton: {
        paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flexDirection: 'row'
    },
    footerElement: {
        flex: 1,
        backgroundColor: '#d8d8d9',
        marginHorizontal: 2,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    main: {
        width: '100%',
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    image: {
        marginLeft: 10,
        backgroundColor: 'transparent',
    },
    mainInfo: {
        marginLeft: 10,
        opacity: 0.6,
    },
    modalWrapper: {
        marginLeft: 0,
        height: '100%',
        width: '100%',
        justifyContent: 'flex-start',
    },
    searchModal: {
        width: '100%',
        maxHeight: 200,
        backgroundColor: 'white',
    },
    searchElement: {
        padding: 10,
        height: 50,
        borderBottomColor: '#d8d8d9',
        borderBottomWidth: 1,
    },
    locationPoint: {
        width: 80,
        height: 50,
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
});
