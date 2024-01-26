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
} from './drivers'

import {
    getObjects,
    getObjectById,
    getObjectStatus,
    getObjectStatusById,
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
    //objects
    getObjects,
    getObjectById,
    getObjectStatus,
    getObjectStatusById,
}
