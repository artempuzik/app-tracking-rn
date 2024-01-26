import axios from './instance'

const getUserToken = (dto) => axios.post('/token', dto)

const getServerList = () => axios.get('/config')


export {
    getUserToken,
    getServerList,
}
