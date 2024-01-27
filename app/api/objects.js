import axios from './instance'

const getObjects = () => axios.get('/objects')
const getObjectById = (id) => axios.get('/objects/' + id, )

const getObjectStatus = () => axios.get('/objectsstatus')

const getObjectStatusById = (id) => axios.get('/objectsstatus/' + id, )

const getObjectIcons = () => axios.get('/objects/icons')

const getTransactions = (dto) => axios.post('/objectsHistory/transactions', dto)

export {
    getObjects,
    getObjectById,
    getObjectStatus,
    getObjectStatusById,
    getObjectIcons,
    getTransactions,
}
