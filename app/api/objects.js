import axios from './instance'

const getObjects = () => axios.get('/objects')
const getObjectById = (id) => axios.get('/objects/' + id, )

const getObjectStatus = () => axios.get('/objectsstatus')

const getObjectStatusById = (id) => axios.get('/objectsstatus/' + id, )


export {
    getObjects,
    getObjectById,
    getObjectStatus,
    getObjectStatusById,
}
