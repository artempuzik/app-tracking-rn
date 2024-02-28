import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    auth: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
    },
    background: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    text: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.6,
        marginRight: 10,
    },
    error: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
    links: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    title: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        width: '100%',
    },
    logo: {
        width: '100%',
        marginTop: 55,
        height: 40,
    },
    input: {
        borderWidth: 0,
        marginBottom: 10,
    },
    inputContainer: {
        minWidth: 300,
        marginTop: 20,
        marginBottom: 10,
    },
    authBtn: {
        minWidth: 300,
        backgroundColor: '#FFA500',
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 5,
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
