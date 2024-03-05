import i18n from "../utils/i18";

export const REFRESH_INTERVAL = 15000 // milliseconds
export const BASE_URL = 'https://geotek.pro'

export const PRESSED_COLOR = 'rgb(210, 230, 255)'

export const LANGUAGE_LIST = [
    {'en': 'English'},
    {'ru': 'Russian'},
    {'az': "Azəricə"},
    {'tr': 'Türkçe'}
]

export const METRICS_LIST = [
    {'metric': 'Metric'},
    {'non-metric': 'Non-metric'},
]

export const REPORTS_LIST = [
    {'general': i18n.t('general_report')},
    {'fuel': i18n.t('fuel_report')},
]

export const CODE_LIST = [
    {'geotek': 'Geotek'},
    {'google': 'Google'},
]

export const WITH_IGNITION_OPTIONS = [
    { label: i18n.t('on'), value: true },
    { label: i18n.t('off'), value: false },
];

export const MOVE_OPTIONS = [
    { label: i18n.t('in_move'), value: true },
    { label: i18n.t('parked'), value: false },
];

export const STATUS_OPTIONS = [
    { label: i18n.t('online'), value: true },
    { label: i18n.t('offline'), value: false },
];

export const DRIVERS_OPTIONS = [
    { label: 'All drivers', value: true },
    { label: 'Only with mileage in the last 24 hours', value: false },
];

export const PARKING_OPTIONS = [
    { label: 'Show all parkings', value: 0 },
    { label: 'Only inside geozones', value: 1 },
    { label: 'Only outside geozones', value: 2 },
];
