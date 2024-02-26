import { EMAIL_REGEX, URL_REGEX } from 'src/@types/constants';

export class Validators {
  static url(url: string) {
    return !!url.match(URL_REGEX);
  }

  static email(email: string) {
    return !!email.match(EMAIL_REGEX);
  }
}
