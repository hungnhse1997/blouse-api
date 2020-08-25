import fs from 'fs';
import path from 'path';

export default {
    HOST: process.env.HOST,
    PORT: parseInt(process.env.PORT || '3001', 10),
    MYSQL_HOST: process.env.MYSQL_HOSTNAME,
    MYSQL_PORT: parseInt(process.env.MYSQL_PORT || '3306', 10),
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    AZURE_MYSQL_SSL: fs.readFileSync(path.resolve('./src/config/ssl-certificate/BaltimoreCyberTrustRoot.crt.pem')),

    JWT_SECRET: process.env.JWT_SECRET,

    PARTNER_CODE: process.env.PARTNER_CODE,
    ACCESS_KEY: process.env.ACCESS_KEY,
    SECRET_KEY: process.env.SECRET_KEY,
    API_ENDPOINT: process.env.API_ENDPOINT,
    MOMO_HOSTNAME: process.env.MOMO_HOSTNAME,
    MOMO_PATH: process.env.MOMO_PATH,
};