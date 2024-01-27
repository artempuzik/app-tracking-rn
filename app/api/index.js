import {
    getUserToken,
    getServerList,
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
} from './objects'

import {
    getProfile,
} from './profile'


export default {
    //token
    getUserToken,
    getServerList,
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
}
