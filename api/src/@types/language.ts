export enum LANGUAGE {
  ARABIC = 'ar',
  CATALAN = 'ca',
  CZECH = 'cs',
  DANISH = 'da',
  GERMAN = 'de',
  GREEK = 'el',
  ENGLISH = 'en',
  SPANISH = 'es',
  SLOVAKIAN = 'sk',
  FRENCH = 'fr',
  HEBREW = 'he',
  HINDI = 'hi',
  HUNGARIAN = 'hu',
  INDONESIAN = 'id',
  ITALIAN = 'it',
  JAPANESE = 'ja',
  KOREAN = 'ko',
  DUTCH = 'nl',
  BOKMAL = 'nb',
  POLISH = 'pl',
  PORTUGUESE = 'pt',
  RUSSIAN = 'ru',
  SWEDISH = 'sv',
  THAI = 'th',
  TURKISH = 'tr',
  VIETNAMESE = 'vi',
  CHINESE = 'zh',
}

export type I18nText = {
  [language in LANGUAGE as string]?: string;
};
