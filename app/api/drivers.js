import axios from './instance'

const getDrivers = () => axios.get('/drivers')
const getDriverById = (id) => axios.get('/drivers/' + id, )

const getDriverGroups = () => axios.get('/drivers/groups', )
const getDriverGroupById = (id) => axios.get('/drivers/groups/' + id)

const getDriverSessionById = (dto) => axios.post('/drivers/sessions', dto)

const changeDriver = (dto) => axios.put('/drivers', dto)


export {
    getDrivers,
    getDriverById,
    getDriverGroups,
    getDriverGroupById,
    getDriverSessionById,
    changeDriver,
}
