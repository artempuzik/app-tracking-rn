import axios from './instance'

const getFuelReport = (dto) => axios.post('/reports/fuel', dto)

export {
    getFuelReport,
}
