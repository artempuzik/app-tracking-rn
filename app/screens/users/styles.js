import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    objectsItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#d8d8d9',
    },
    itemBlock: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 20,
        justifyContent: 'space-between'
    },
    mainItemBlock: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pageHeader: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    emptyList: {
        width: '100%',
        textAlign: 'center',
        padding: 30,
        opacity: 0.6,
    },
});
