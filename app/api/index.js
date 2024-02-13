import {
    getUserToken,
    getServerList,
    refreshToken,
} from './token'

import {
    resetPassword,
    changeSelfPassword,
    getUsers,
    getUserById,
    changeUser,
} from './users'

import {
    getDrivers,
    getDriverById,
    getDriverGroups,
    getDriverGroupById,
    getDriverSessionById,
    changeDriver,
} from './drivers'

import {
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
} from './objects'

import {
    getProfile,
} from './profile'

import {
    getGeozones,
    getGeozoneById
} from './geozones'

import {
    getFuelReport
} from './reports'


export default {
    //token
    getUserToken,
    getServerList,
    refreshToken,
    //users
    resetPassword,
    changeSelfPassword,
    getUsers,
    getUserById,
    changeUser,
    //profile
    getProfile,
    //drivers
    getDrivers,
    getDriverById,
    getDriverGroups,
    getDriverGroupById,
    getDriverSessionById,
    changeDriver,
    //objects
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
    //reports
    getFuelReport,
    //geozones
    getGeozones,
    getGeozoneById,
}
