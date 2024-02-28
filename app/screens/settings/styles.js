import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#a7a7aa',
        padding: 10,
        marginBottom: 10,
    },
    inputPass: {
        marginBottom: 10,
    },
    settingsContainer: {
        flex: 1,
        padding: 20,
    },
    block: {
        marginVertical: 5,
    },
    inputContainer: {
        flex: 1,
    },
    text: {
        textAlign: 'left',
        opacity: 0.6,
        marginBottom: 10,
    },
    saveBtn: {
        marginTop: 10,
        minWidth: 300,
        backgroundColor: '#2060ae',
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 5,
        alignItems: 'center',
    },
    btnTitle: {
        color: 'white',
    },
    headerButton: {
        width: '30%',
        height: 40,
        alignItems: 'center',
    },
    headerText: {
        color: '#2060ae',
        fontSize: 12,
    },
    headerButtonsBlock: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    line: {
        height: 1,
        backgroundColor: '#a7a7aa',
    },
    error: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
});
