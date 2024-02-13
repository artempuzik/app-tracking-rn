import axios from './instance'

const getGeozones = () => axios.get('/geozones')
const getGeozoneById = (id) => axios.get('/geozones/' + id)

export {
    getGeozones,
    getGeozoneById
}
