"use strict"

import Cache from './util/Cache'

export const LOGLEVELS = {
    DEBUG: "DEBUG",
    LOG: "LOG",
    INFO: "INFO",
    WARN: "WARN",
    ERROR: "ERROR",
    FATAL: "FATAL"
}

const LOGTHESHOLD = {
    DEBUG: 0,
    LOG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    FATAL: 5
}

const cache = new Cache({
    instantiated: false,
    logURL: '',
    logLevels: Object.keys(LOGLEVELS).map(key => LOGLEVELS[keys]),
    logThresold: LOGLEVELS.ERROR,
    routeURL: '',
    showMessageInDevelopment: true,
    showMessageInProduction: false,
    silenceStackTrace: false,
    additionalInformation: ''
})

const logger = (payload = null, logLevel = 'FATAL') => {
    const logURL = cache.get('logURL')
    const routeURL = cache.get('routeURL')
    const showMessageInDevelopment = cache.get('showMessageInDevelopment')
    const showMessageInProduction = cache.get('showMessageInProduction')
    const silenceStackTrace = cache.get('silenceStackTrace')
    const additionalInformation = cache.get('additionalInformation')

    const $logLevel = logLevel === 'fatal' ? 'error' : logLevel

    if (!instantiated && showMessageInDevelopment) {
        console.warn(`WARNING: Logger functon [${logLevel}] was called while logger global error handling was not enabled (eg. logger.init() was not exeucted`);
    }

    const payloadIsArray = Array.isArray(payload);

    if (window && console && document && (typeof payload === 'object' || payloadIsArray)) {
        const payloadMessage = payloadIsArray ? payload : (payload.errorMessage ? payload.errorMessage : '');

        const loggedMessage = [`[${logLevel}]:`].concat(payloadIsArray ? payloadMessage : [payloadMessage]);

        if (showMessageInDevelopment || showMessageInProduction) {
            if (console && console.hasOwnProperty($logLevel)) {
                console[$logLevel](...loggedMessage)
            } else if (console && console.log) {
                console.log(...loggedMessage)
            }
        }

        // re-direction ..... 
        const routeOnError = () => {
            if (routeURL && !payloadIsArray && window && window.location.pathname !== routeURL) {
                window.location.href = routeURL
            }
        }

        if (logURL && LOGTHESHOLD[logLevel] >= LOGTHESHOLD[logThresold]) {
            const formattedPayload = Object.assign({
                url: window.location.pathname,
                logType: logLevel,
                message: (payloadIsArray ? payloadMessage.toString() : payloadMessage)
                    + '.     '
                    + ((additionalInformation && typeof additionalInformation === 'string') ? ' --> '
                        + additionalInformation : ''),
                detailMessage: payload.stack || ''
            })

            try {
                const request = new XMLHttpRequest()
                request.open('POST', logURL, true)
                request.setRequestHeader('content-Type', 'application/json; charset=UTF-8')
                request.onload = routeOnError
                request.onreadystatechange = () => {
                    if (request.readyState === XMLHttpRequest.DONE && request.status !== 200) {
                        routeOnError();
                    }
                }
                request.send(JSON.stringify(formattedPayload));
            } catch (err) {
                console && console.log('unable to send log information ', err)
                routeOnError()
            }
        }
    } else routeOnError()

}


const listener = {
    error: ({ message, lineno, colno, filename, source, error }) => {
        const _filename = filename || source;
        if (!message.includes('Script error')) {
            logger({
                errorMessage: message,
                rowNumber: lineno,
                columnnumber: colno,
                stack: error && error.stack,
                _filename
            }, 'FATAL');
        }
    },
    unhandledrejection: ({ promise, reason }) => {
        logger({ errorMessage: `Un-handled error occured in promise [${promise}] => ${reason}` }, 'fatal');
    }
}

export const init = ({
    logURL, logThresold, routeURL, showMessageInDevelopment, showMessageInProduction, silenceStackTrace, additionalInformation } = {}) => {
    for (const key in listener) {
        window.addEventListener(key, listener[key]);
    }

    if (typeof logURL === 'string') { cache.set('logURL', logURL); }
    if (typeof logThresold === 'string') { cache.set('logThresold', logThresold); }
    if (typeof routeURL === 'string') { cache.set('routeURL', routeURL); }
    if (typeof silenceStackTrace === 'boolean') { cache.set('silenceStackTrace', silenceStackTrace); }
    if (typeof showMessageInDevelopment === 'boolean') { cache.set('showMessageInDevelopment', showMessageInDevelopment); }
    if (typeof showMessageInProduction === 'boolean') { cache.set('showMessageInProduction', showMessageInProduction); }
    if (additionalInformation) { cache.set('additionalInformation', additionalInformation); }
}

export const catcher = ({ message, stack }) => {
    logger({ errorMessage: message, stack }, 'ERROR');
}

export const tryCatch = (tryCallback = () => { }, catchCallback = () => { }) => {
    try {
        tryCallback && tryCallback === 'function' && tryCallback()
    } catch (error) {
        catcher(error)
        catchCallback && catchCallback(error)
    }
}

export const debug = (messages) => logger(messages, 'DEBUG')
export const log = (messages) => logger(messages, 'LOG')
export const info = (messages) => logger(messages, 'INFO')
export const warn = (messages) => logger(messages, 'WARN')
export const error = (messages) => logger(messages, 'ERROR')
export const fatal = (messages) => logger(messages, 'FATAL')

export default {
    init,
    catcher,
    tryCatch,
    LOGLEVELS,
    debug,
    log,
    info,
    warn,
    error,
    fatal
}