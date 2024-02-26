export default () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DEBUG_MODE: process.env.DEBUG_MODE,
  MIGRATION_DIR_PATH: process.env.MIGRATION_DIR_PATH,
  URL: process.env.URL,
  CORS: {
    ENABLED_ORIGINS: process.env.CORS_ENABLED_ORIGINS,
    ENABLED_METHODS: process.env.CORS_ENABLED_METHODS,
  },
  MONGO: {
    SCHEME: process.env.MONGO_SCHEME,
    DOMAIN: process.env.MONGO_DOMAIN,
    PORT: process.env.MONGO_PORT,
    DATABASE_NAME: process.env.MONGO_DATABASE_NAME,
  },
  REDIS: {
    HOST: process.env.REDIS_HOST,
    PORT: process.env.REDIS_PORT,
  },
  JWT_SECRET: process.env.JWT_SECRET,
  SENDGRID: {
    HOST: process.env.SENDGRID_HOST,
    PORT_TLS: process.env.SENDGRID_PORT_TLS,
    PORT_SSL: process.env.SENDGRID_PORT_SSL,
    USERNAME: process.env.SENDGRID_USERNAME,
    PASSWORD: process.env.SENDGRID_PASSWORD,
    SENDER: process.env.SENDGRID_SENDER,
  },
  APP: {
    PUBLIC_URL: process.env.APP_PUBLIC_URL,
  },
  STORAGE: {
    UPLOADS_DIR_PATH: process.env.UPLOADS_DIR_PATH,
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
  },
});
