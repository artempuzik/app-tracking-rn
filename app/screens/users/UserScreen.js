import styles from "./styles";
import AppHeader from "../../components/header/AppHeader";
import React, {useCallback, useMemo, useState} from "react";
import {FlatList, Pressable, RefreshControl, SafeAreaView, Text, View} from "react-native";
import SearchInput from "../../components/search/SearchInput";
import {useDispatch, useSelector} from "react-redux";
import {PRESSED_COLOR} from "../../config";
import UserItemElement from "./components/UserItemElement";
import {setCurrent} from "../../store/user/usersActions";
import i18n from "../../utils/i18";

const UserScreen = ({navigation}) => {
    const [query, setQuery] = useState('')

    const users = useSelector(state => state.user.users)
    const currentUser = useSelector(state => state.user.currentUser)
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch()

    const filteredUserArray = useMemo(() => users.filter(u => u.name.toLowerCase().includes(query.toLowerCase())), [users, query])

    const selectCurrentUserHandler = useCallback(async (user) => {
        setIsLoading(true)
        await dispatch(setCurrent(user)).then(() => setTimeout(() => {
            setIsLoading(false)
            navigation.navigate('Objects')
            }, 1000))
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader canGoBack={true} />
            <View style={styles.pageHeader}>
                <SearchInput onChange={setQuery}/>
            </View>
            <FlatList
                data={filteredUserArray}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={<Text style={styles.emptyList}>{i18n.t('empty_list')}</Text>}
                ListFooterComponent={() => (<View style={{height: 130}}></View>)}
                enableEmptySections={true}
                renderItem={({item}) => (
                    <Pressable
                        key={item.id}
                        style={({pressed}) => [
                            {
                                backgroundColor: pressed ? PRESSED_COLOR : 'transparent',
                            },
                            styles.objectsItem,
                        ]}
                        onPress={() => selectCurrentUserHandler(item)}
                    >
                        <UserItemElement user={item} isCurrent={currentUser && currentUser.id === item.id}/>
                    </Pressable>
                )}
                refreshControl={
                    <RefreshControl refreshing={isLoading} />
                }
            />
        </SafeAreaView>
    )
}

export default UserScreen
