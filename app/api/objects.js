import axios from './instance'

const getObjects = () => axios.get('/objects')
const getObjectById = (id) => axios.get('/objects/' + id, )

const getObjectStatus = () => axios.get('/objectsstatus')

const getObjectStatusById = (id) => axios.get('/objectsstatus/' + id, )

const getObjectIcons = () => axios.get('/objects/icons')

const getTransactions = (dto) => axios.post('/objectsHistory/transactions', dto)

const getObjectHistory = (dto) => axios.post('/objectsHistory', dto)

const getObjectHistoryDriversSession = (dto) => axios.post('/objectsHistory/DriverSessions', dto)

const getObjectEvents = () => axios.get('/objectevents')

const sendCustomCommand = (dto) => axios.post('/objects/commands', dto)

export {
    getObjects,
    getObjectById,
    getObjectStatus,
    getObjectStatusById,
    getObjectIcons,
    getTransactions,
    getObjectEvents,
    sendCustomCommand,
    getObjectHistory,
    getObjectHistoryDriversSession,
}
