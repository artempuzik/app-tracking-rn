import styles from "./styles";
import AppHeader from "../../components/header/AppHeader";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Pressable, SafeAreaView, ScrollView, Text, View} from "react-native";
import SearchInput from "../../components/search/SearchInput";
import {useDispatch, useSelector} from "react-redux";
import {PRESSED_COLOR} from "../../config";
import UserItemElement from "./components/UserItemElement";
import {setCurrent} from "../../store/user/usersActions";

const UserScreen = ({navigation}) => {
    const [query, setQuery] = useState('')

    const users = useSelector(state => state.user.users)
    const currentUser = useSelector(state => state.user.currentUser)

    const dispatch = useDispatch()

    const filteredUserArray = useMemo(() => users.filter(u => u.name.includes(query)), [users, query])

    const selectCurrentUserHandler = useCallback((user) => {
        dispatch(setCurrent(user)).then(() =>{
            navigation.navigate('Objects')
        })
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader canGoBack={true} />
            <View style={styles.pageHeader}>
                <SearchInput onChange={setQuery}/>
            </View>
            <ScrollView style={{flex: 1}}>
                {
                    filteredUserArray.length ? filteredUserArray.map(user => (
                        <Pressable
                            key={user.id}
                            style={({pressed}) => [
                                {
                                    backgroundColor: pressed ? PRESSED_COLOR : 'transparent',
                                },
                                styles.objectsItem,
                            ]}
                            onPress={() => selectCurrentUserHandler(user)}
                        >
                            <UserItemElement user={user} isCurrent={currentUser && currentUser.id === user.id}/>
                        </Pressable>
                    )) : <Text style={styles.emptyList}>Empty list</Text>
                }
            </ScrollView>
        </SafeAreaView>
    )
}

export default UserScreen
