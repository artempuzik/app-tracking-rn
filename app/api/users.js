import axios from './instance'

const resetPassword = (email) => axios.post('/users/requestpasswordrecover', {email})

const changeSelfPassword = (dto) => axios.post('/users/selfchangepassword', {
    id: dto.id,
    password: dto.password,
    passwordConfirmation: dto.passwordConfirmation,
    oldPassword: dto.oldPassword
})

const getUsers = () => axios.get('/users', )
const getUserById = (id) => axios.get('/users/' + id, )

const changeUser = (dto) => axios.put('/users', dto)


export {
    resetPassword,
    changeSelfPassword,
    getUsers,
    getUserById,
    changeUser,
}
