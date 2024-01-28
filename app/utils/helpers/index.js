import {useMemo} from "react";

export const emailValidator = (email) => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email) && email;

export const getItemPointByItemId = (statuses, item) => {
    return statuses.points?.find(p => p.trackerid == item.main.id)
}

export const getItemIoPointsByItemId = (statuses, item) => {
    const engine = item.trends.find(t => t.flags === 'ENGINE')
    return statuses.iopoints?.find(p => p.trendid == engine?.id)
}
