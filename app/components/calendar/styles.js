import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    filtersMainContainer: {
        flex: 1,
        justifyContent: 'space-between',
        marginTop: 20,
    },
    filtersContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    filterRow: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#a7a7aa',
        padding: 10,
        marginBottom: 20,
    },
    filterRowText: {
        marginLeft: 20,
        opacity: 0.6,
    },
    buttonsDaysBlock: {
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    headerButton: {
        padding: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    screenTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#a7a7aa',
        paddingHorizontal: 20,
    },
});
