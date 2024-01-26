import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    buttons: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    mainMenuBlock: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    mainMenuItem: {
        width: '48%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#a7a7aa',
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginBottom: 10,
    },
    buttonTitle: {
        marginTop: 10,
    },
    footer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        paddingTop: 5,
    },
});
