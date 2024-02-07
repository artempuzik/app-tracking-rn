export const emailValidator = (email) => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email) && email;

export const getItemPointByItemId = (statuses, item) => {
    return statuses.points?.find(p => p.trackerid == item.main.id)
}

export const getItemIoPointsByItemId = (statuses, item) => {
    const engine = item.trends.find(t => t.flags === 'ENGINE')
    return statuses.iopoints?.find(p => p.trendid == engine?.id)
}

export const getDuration = (start, end) => {
    const milliseconds = end - start;
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export const parsePointString = (str) => {
    if(!str) return
    const array = str.split(' ');
    const parsed = [];
    while(array.length) {
        const element = []
        for (let i = 0; i < 7; i++) {
            element.push(array.pop())
        }
        parsed.push(element.reverse())
    }
    return parsed.map(el => ({
        time: el[0],
        lat: el[1],
        lng: el[2],
    }))
}
