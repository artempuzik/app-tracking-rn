import axios from './instance'

const getUserToken = (dto) => axios.post('/token', dto)

const refreshToken = (dto) => axios.post('/token/refresh', dto)

const getServerList = () => axios.get('/config')


export {
    getUserToken,
    getServerList,
    refreshToken,
}
