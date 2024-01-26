import axios from './instance'

const getProfile = () => axios.get('/profile')


export {
    getProfile,
}
