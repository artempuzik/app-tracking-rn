export const emailValidator = (email) => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email) && email;

export const getItemPointByItemId = (statuses, item) => {
    return statuses.points?.find(p => p.trackerid == item.main.id)
}

export const getItemIoPointsByItemId = (statuses, item) => {
    const engine = item.trends.find(t => t.flags === 'POINTBYEVT ENGINE' || t.flags === 'ENGINE')
    return statuses.iopoints?.find(p => p.trendid == engine?.id)
}

export const getDuration = (start, end) => {
    const milliseconds = +end - +start;
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

export const calculateDistance = (trip) => {
    let mileage = 0
    const resultArray = parsePointString(trip.points)
    for (let i = 1; i < resultArray.length - 1; i++) {
        mileage += haversine(
            resultArray[i-1].lat,
            resultArray[i-1].lng,
            resultArray[i].lat,
            resultArray[i].lng,
        )
    }
    return (Math.round(mileage * 100))/100
}

export const haversine = (lat1, lon1, lat2, lon2)=> {
    function toRad(x) {
        return x * Math.PI / 180;
    }

    const R = 6371; // km

    const x1 = lat2 - lat1;
    const dLat = toRad(x1);
    const x2 = lon2 - lon1;
    const dLon = toRad(x2)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return d;
}

export const getMileage = (mileage) => {
    return Math.round(mileage/100)/10
}

export const convertDate = (timestamp) => {
    const date = new Date(+timestamp);

    // Extract date components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    // Extract time components
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Concatenate date and time components
    return `${day}.${month}.${year} ${hours}:${minutes}`;
};
//
// import * as FileSystem from 'expo-file-system';
// export const convertImageToBase64 = async (imageUrl) => {
//     try {
//         const directory = `${FileSystem.cacheDirectory}images`;
//         await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
//         const fileName = imageUrl.split('/').pop();
//         const localUri = `${directory}/${fileName}`;
//
//         await FileSystem.downloadAsync(imageUrl, localUri);
//         if (!(await FileSystem.getInfoAsync(localUri)).exists) {
//             console.error(`File ${localUri} does not exist`);
//             return
//         }
//         const base64String = await FileSystem.readAsStringAsync(localUri, { encoding: 'base64' });
//         return `data:image/png;base64,${base64String}`
//     } catch (error) {
//         console.error('Error:', error);
//         return imageUrl
//     }
// };

export const polygonArea = (vertices) => {
    let area = 0;
    for (let i = 0; i < vertices.length; i++) {
        let j = (i + 1) % vertices.length;
        area += haversine(vertices[i].lat, vertices[i].lng, vertices[j].lat, vertices[j].lng);
    }
    area = Math.abs(area) / 2;
    return (Math.round(area*1000)/10000).toFixed(3);
}

export const circleArea = (radius) => {
    return Math.round(Math.PI * radius * radius / 1000)/1000;
}

export const getPolylineLength = (points) => {
    let mileage = 0
    for (let i = 1; i < points.length - 1; i++) {
        mileage += haversine(
            points[i-1].lat,
            points[i-1].lng,
            points[i].lat,
            points[i].lng,
        )
    }
    return (Math.round(mileage * 100))/100
}

