import {I18n} from "i18n-js";


const translations = {
  'en-us': {
    auth_title: "Sign In",
    user: "User",
    sign_in: "Sign in",
    password: "Password",
    new_password: "New Password",
    confirm_password: "Confirm Password",
    interface_language: "Interface language",
    geozones: "Geozones",
    objects: "Objects",
    drivers: "Drivers",
    map: "Map",
    events: "Events",
    gas: "Gas",
    services: "Services",
    settings: "Settings",
    home_footer: "Full version",
    profile: "Profile",
    user_counter: "Users counter",
    user_list: "Users list",
    log_out: "Log out",
    search: "Search",
    security: "Security",
    company_name: "Company name",
    phone_number: "Phone number",
    email_address: "Email address",
    contacts: "Contacts",
    address: "Address",
    save: "Save",
    default_map: "Default Map",
    measuring_system: "Measure system",
    only_with_engines: "Only objects with the engine on:",
    only_objects: "Only objects:",
    only_with_states: "Only objects with status:",
    filters: "Filters",
    reset_filters: "Reset filters",
    empty_list: "Empty list",
    on: "On",
    off: "Off",
    online: "Online",
    offline: "Offline",
    speed_text: "km/h",
    info: "Info",
    roads: "Roads",
    parking: "Parking",
    report: "Report",
    photo: "Photo",
    power: "Power",
    engine: "Engine",
    mileage: "Mileage",
    engine_hours: "Engine hours",
    km: "km",
    hours: "hours",
    send_command: "Send command",
    create_command: "Create command",
    select_interval: "Select interval",
    today: "Today",
    yesterday: "Yesterday",
    this_week: "This week",
    this_month: "This month",
    previous_month: "Previous month",
    date: "Date",
    duration: "Duration",
    station: "Station",
    pump: "Pump",
    fuel_amount: "Fuel amount",
    vehicle: "Vehicle",
    limit: "Limit",
  },
  'ru-ru': {
    auth_title: "Авторизация",
    user: "Пользователь",
    sign_in: "Войти",
    password: "Пароль",
    new_password: "Новый пароль",
    confirm_password: "Подтверждение пароля",
    interface_language: "Язык интерфейса",
    geozones: "Геозоны",
    objects: "Объекты",
    drivers: "Водители",
    map: "Карта",
    events: "События",
    gas: "АЗС",
    services: "Сервисы",
    settings: "Настройки",
    home_footer: "Полная версия",
    profile: "Профиль",
    user_counter: "Колличество пользователей",
    user_list: "Список пользователей",
    log_out: "Выйти",
    search: "Поиск",
    security: "Security",
    company_name: "Название фирмы",
    phone_number: "Номер телефона",
    email_address: "Электронная почта",
    contacts: "Контакт",
    address: "Адрес",
    save: "Сохранить",
    default_map: "Карта по умолчанию",
    measuring_system: "Система измерения",
    only_with_engines: "Только объекты с включенным двигателем:",
    only_objects: "Отобразить только объекты:",
    only_with_states: "Отобразить только объекты со статусом:",
    filters: "Фильтры",
    reset_filters: "Сбросить фильтры",
    empty_list: "Пустой список",
    on: "Вкл",
    off: "Выкл",
    online: "В сети",
    offline: "Не в сети",
    speed_text: "км/ч",
    info: "Инфо",
    roads: "Дороги",
    parking: "Парковка",
    report: "Отчет",
    photo: "Фото",
    power: "Мощность",
    engine: "Двигатель",
    mileage: "Пробег",
    engine_hours: "Моточасы",
    km: "км",
    hours: "часов",
    send_command: "Отпр. команду",
    create_command: "Создать задачу",
    select_interval: "Выберите интервал",
    today: "Сегодня",
    yesterday: "Вчера",
    this_week: "На этой неделе",
    this_month: "В этом месяце",
    previous_month: "В прошлом месяце",
    date: "Дата",
    duration: "Продолжительность",
    station: "Станция",
    pump: "Насос",
    fuel_amount: "Количество топлива",
    vehicle: "Транспортное средство",
    limit: "Лимит",
  }
}


const i18n = new I18n(translations);
i18n.defaultLocale = "en-us"
i18n.enableFallback = true;

export default i18n
