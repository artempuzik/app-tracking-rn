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
    object_counter: "Object counter",
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
    object: "Object",
    send_command_by_sms: "Send command by SMS",
    custom_command: "Custom command",
    typed_command: "Typed command",
    from: 'From',
    to: 'To',
    total: 'Total',
    summary_report: "Summary report",
    fuel_report: "Fuel report",
    fuel_consumption: "Fuel consumption",
    level_at_the_beginning: "Level at the beginning",
    level_at_the_ending: "Level at the ending",
    consumption_for_100_km: "Consumption for 100 km",
    consumption_for_one_hour: "Consumption for 1 hour",
    idle_consumption: "Idle consumption",
    consumption_on_the_move: "Consumption on the move",
    total_refills: "Total refills",
    total_drains: "Total drains",
    fuel: "Fuel",
    time: "Time",
    idle: "Idle",
    drive: "Drive",
    fueling: "Fueling",
    drain: "Drain",
    volume: "Volume",
    report_interval: "Report interval",
    general: "General",
    max_speed: "Max speed",
    average_speed: "Average speed",
    speed: "Speed",
    l: "l",
    number_of_violations: "Number of violations",
    fines: "Fines",
    only_important: "Only important",
    all: "All",
    in_groups: "In groups",
    available_speed: "Available speed",
    zone_type: "Zone type",
    yes: "Yes",
    no: "No",
    only_current_type: "Only current type",
    polygon: "Polygon",
    polyline: "Polyline",
    point: "Point"
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
    object_counter: "Колличество объектов",
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
    object: "Объект",
    send_command_by_sms: "Отправлять команды СМС сообщениями",
    custom_command: "Своя команда",
    typed_command: "Введите команду",
    from: 'От',
    to: 'До',
    total: "Итого",
    summary_report: "Суммарный отчет",
    fuel_report: "Отчет по топливу",
    fuel_consumption: "Расход топлива",
    level_at_the_beginning: "Уровень в начале",
    level_at_the_ending: "Уровень в конце",
    consumption_for_100_km: "Расход на 100 км",
    consumption_for_one_hour: "Расход на 1 час",
    idle_consumption: "Расход в простое",
    consumption_on_the_move: "Расход в движении",
    total_refills: "Всего заправок",
    total_drains: "Всего сливов",
    fuel: "Топливо",
    time: "Время",
    idle: "Холостой",
    drive: "Воджение",
    fueling: "Заправка",
    drain: "Слив",
    volume: "Объем",
    report_interval: "Отчет за период",
    general: "Основное",
    max_speed: "Максимальная скорость",
    average_speed: "Средняя скорость",
    speed: "Средняя",
    l: "л",
    number_of_violations: "Количество нарушений",
    fines: "Штрафы",
    only_important: "Только важные",
    all: "Все",
    in_groups: "В группах",
    available_speed: "Допустимая скорость",
    zone_type: "Тип зоны",
    yes: "Да",
    no: "Нет",
    only_current_type: "Только выбранный тип",
    polygon: "Многоугольник",
    polyline: "Линия",
    point: "Точка"
  }
}


const i18n = new I18n(translations);
i18n.defaultLocale = "en-us"
i18n.enableFallback = true;

export default i18n
