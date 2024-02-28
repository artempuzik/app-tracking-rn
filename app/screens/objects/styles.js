import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    mapContainer: {
        width: '100%',
        height: '30%',
    },
    pageHeader: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    pageItemHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#d8d8d9',
    },
    rightBlock: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filtersMainContainer: {
        flex: 1,
        justifyContent: 'space-between',
        marginTop: 10,
    },
    pageIconsBlock: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#d8d8d9',
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
    headerRightButton: {
        paddingTop: 10,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerItemIcon: {
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    objectsItem: {
        paddingHorizontal: 20,
    },
    parkingItem: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        width: '100%',
    },
    total: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    parkingRowBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 5,
        width: '90%',
    },
    parkingNumber: {
        backgroundColor: '#2060ae',
        width: 23,
        height: 23,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 2,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingVertical: 10,
    },
    leftBlock: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#a7a7aa',
    },
    subText: {
        opacity: 0.6
    },
    objectItemTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    screenTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#a7a7aa',
        paddingHorizontal: 20,
    },
    iconTitle: {
        textAlign: 'center',
        color: '#2060ae',
    },
    mainInfo: {
        marginLeft: 10,
    },
    line: {
        height: 1,
        backgroundColor: '#a7a7aa',
        marginTop: 20,
        marginBottom: 10,
    },
    emptyList: {
        width: '100%',
        textAlign: 'center',
        padding: 30,
        opacity: 0.6,
    },
    sendCommentButton: {
        width: '100%',
        borderColor: '#2060ae',
        borderWidth: 2,
        marginVertical: 20,
        padding: 10,
    },
    commentText: {
        fontWeight: 'bold',
        color: '#2060ae',
        textAlign: 'center',
    },
    input: {
        borderColor: '#a7a7aa',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
    },
    textContainer: {
        flex: 1,
        padding: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    label: {
        margin: 8,
    },
    checkbox: {
        alignSelf: 'center',
    },
    filtersContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    selectContainer: {
        marginVertical: 10,
        height: 50,
    },
    radioButtonsContainer: {
        marginVertical: 10,
    },
    radioButtons: {
        marginVertical: 10,
        width: '90%',
        justifyContent: 'space-between',
    },
    resetButton: {
        borderColor: '#a7a7aa',
        borderWidth: 1,
        padding: 15,
        marginBottom: 10,
    },
    saveFiltersButton: {
        padding: 15,
        marginBottom: 10,
    },
    resetButtonText: {
        fontWeight: 'bold',
        textAlign: 'center',
        opacity: 0.7,
        fontSize: 12,
    },
    saveButtonText: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        fontSize: 12,
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
    infoPropRow: {
        paddingVertical: 10,
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        opacity: 0.6,
        borderBottomColor: '#a7a7aa',
        borderBottomWidth: 1,
    },
    sendBtnContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 20
    },
    mainStatRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#ceced0',
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
        opacity: 0.6,
    },
    rowLine: {
        backgroundColor: '#ceced0',
        paddingVertical: 5,
        paddingHorizontal: 2,
        marginTop: 15,
    },
    subStatRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 3,
        paddingHorizontal: 10,
        marginVertical: 2,
        opacity: 0.6,
    },
    image: {
        marginLeft: 10,
        backgroundColor: 'transparent',
    },
});
