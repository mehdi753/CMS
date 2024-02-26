export enum MAIL_ACTION {
  VERIFY = 'VERIFY',
  RECOVER = 'RECOVER',
  PASSWORD_RESET = 'PASSWORD_RESET',
  USER_VERIFIED = 'USER_VERIFIED',
}

export const MAIL = {
  [MAIL_ACTION.VERIFY]: {
    subject: 'Account verification',
    templateName: 'verify-user',
  },
  [MAIL_ACTION.RECOVER]: {
    subject: 'Recover account',
    templateName: 'recover-user',
  },
  [MAIL_ACTION.PASSWORD_RESET]: {
    subject: 'Password has been reset',
    templateName: 'password-reset',
  },
  [MAIL_ACTION.USER_VERIFIED]: {
    subject: 'Account verified',
    templateName: 'account-verified',
  },
};
