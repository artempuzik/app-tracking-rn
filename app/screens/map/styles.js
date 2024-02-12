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
});
