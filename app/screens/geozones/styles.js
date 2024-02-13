import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    mapContainer: {
        width: '100%',
        height: '25%',
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
    filtersMainContainer: {
        flex: 1,
        justifyContent: 'space-between',
        marginTop: 10,
        paddingHorizontal: 20,
    },
    headerItemButton: {
        paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightBlock: {
        flexDirection: 'row',
    },
    error: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
    headerItemIcon: {
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerRightButton: {
        paddingTop: 10,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    main: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#a7a7aa'
    },
    leftBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        opacity: 0.6,
        paddingHorizontal: 20,
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
    },
    screenTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#a7a7aa',
    },
    iconTitle: {
        textAlign: 'center',
        color: '#2060ae',
    },
    mainInfo: {
        marginLeft: 10,
        justifyContent: 'center',
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
        borderColor: '#2060ae',
        borderWidth: 2,
        margin: 20,
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
        marginVertical: 5,
    },
    filtersContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    selectContainer: {
        marginVertical: 20,
        height: 50,
    },
    radioButtonsContainer: {
        marginTop: 10,
    },
    radioButtons: {
        marginVertical: 10,
    },
    resetButton: {
        borderColor: '#a7a7aa',
        borderWidth: 1,
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
    saveFiltersButton: {
        padding: 15,
        marginBottom: 10,
    },
    mainInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#ceced0',
        padding: 5,
        marginVertical: 5,
        opacity: 0.6,
    },
    subInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        opacity: 0.6,
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
    infoPropRow: {
        paddingVertical: 10,
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        opacity: 0.6,
        borderBottomColor: '#a7a7aa',
        borderBottomWidth: 1,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paragraph: {
        marginLeft: 10,
        fontSize: 15,
        opacity: 0.6,
    },
});
