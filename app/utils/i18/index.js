import {I18n} from "i18n-js";


const translations = {
  'en-us': {
    user: "User",

  },
  'ru-ru': {
    user: "Пользователь"
  }
}


const i18n = new I18n(translations);
i18n.locale = "en-us";
export default i18n
