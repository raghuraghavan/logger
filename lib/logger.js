"use strict"

import Cache from './util/store'

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
    logURL: '',
    logLevels: Object.keys(LOGLEVELS).map(key => logLevels[keys]),
    logThresold: LOGLEVELS.ERROR,
    routeURL: '',
    showMessageInDevelopment: true,
    showMessageInProduction: false,
    silenceStackTrace: false,
    additionalInformation: ''
})

const logger = {
    // logger version

}

const listener = {
    error: ({
        message,
        lineno,
        colno,
        filename,
        source,
        error
    }) => {
        const filename = filename || source
        if (!message.includes('Script error')) {
            logger({
                errorMessage: message,
                rowNumber: lineno,
                columnnumber: colno,
                stack: error && error.stack,
                filename
            }, 'FATAL')
        }
    },
    unhandledrejection: ({
        promise,
        reason
    }) => {
        logger({
            errorMessage: `Un-handled error occured in promise [${promise}] => ${reason}`
        })
    }
}

export const initParam = ({
    logURL,
    logThresold,
    routeURL,
    showMessageInDevelopment,
    showMessageInProduction,
    silenceStackTrace,
    additionalInformation
} = {}) => {
    for (const key in listener) window.addEventListener(key, listener[key])
    if (typeof logURL === 'string') Cache.set('logURL', logURL)
    if (typeof logThresold === 'string') Cache.set('logThresold', logThresold)
    if (typeof routeURL === 'string') Cache.set('routeURL', routeURL)
    if (typeof silenceStackTrace === 'boolean') Cache.set('silenceStackTrace', silenceStackTrace)
    if (typeof showMessageInDevelopment === 'boolean') Cache.set('showMessageInDevelopment', showMessageInDevelopment)
    if (typeof showMessageInProduction === 'boolean') Cache.set('showMessageInProduction', showMessageInProduction)
    if (additionalInformation) Cache.set('additionalInformation', additionalInformation)
}

export const catcher = ({
    message,
    stack
}) => {
    logger({
        errorMessage: message,
        stack
    }, 'ERROR')
}

export const tryCatch = (tryCallback = () => {}, catchCallback = () => {}) => {
    try {
        tryCallback && tryCallback === 'function' && tryCallback()
    } catch (error) {
        catcher(error)
        catchCallback && catchCallback(error)
    }
}

export const debug = (message) => logger(message, 'DEBUG')
export const log = (message) => logger(message, 'LOG')
export const info = (message) => logger(message, 'INFO')
export const warn = (message) => logger(message, 'WARN')
export const error = (message) => logger(message, 'ERROR')
export const fatal = (message) => logger(message, 'FATAL')

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