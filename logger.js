const winston = require('winston');
const WinstonCloudWatch = require('winston-cloudwatch');
require('dotenv').config();

// Crear una función para obtener el nombre del stream
const getLogStreamName = (prefix = 'app') => {
    const date = new Date().toISOString().split('T')[0];
    const emailToken = 'gestor-api';
    return `${emailToken}-${prefix}-${date}`;
};

// Crear el logger con opciones configurables
const createCloudWatchLogger = (options = {}) => {
    const {
        logGroupName = 'api-gestor-chatbot',
        prefix = 'app',
        region = process.env.AWS_REGION || 'us-east-1',
        // Permitir configuraciones adicionales
        additionalOptions = {}
    } = options;

    return winston.createLogger({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        transports: [
            // Mantener logs en consola para desarrollo
            new winston.transports.Console({
                format: winston.format.simple()
            }),
            // Configurar CloudWatch
            new WinstonCloudWatch({
                logGroupName,
                logStreamName: getLogStreamName(prefix),
                awsRegion: region,
                messageFormatter: ({ level, message, timestamp, ...additionalInfo }) => {
                    return JSON.stringify({
                        timestamp,
                        level,
                        message,
                        ...additionalInfo
                    });
                },
                ...additionalOptions
            })
        ]
    });
};

// Crear una instancia por defecto
const defaultLogger = createCloudWatchLogger();

module.exports = {
    createCloudWatchLogger,
    defaultLogger
};