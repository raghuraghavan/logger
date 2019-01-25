# Client side logger 
## API
### Table of contents
*[setup](#setup)
*[Commands](#commands)
*[JS Example](#js_example)
*[Json Example](#json_example)

### <a id="setup></a>Setup

Usage of logger is very simple by using provided methods like init, debug, log, error and fatal. 
Note: init method is the entry point for configuring logger to send data to backend for further analysis.

### How to set it up in Node

``` javascript
//es5
const logger = require('clientside-Logger');
logger.init()

//es6
import logger from 'clientside-logger';
logger.init()
```

### How to setup in server side pages / plain javascript
```HTML
<script src="clientside-Logger.js"></script>
<script>
    logger.init({
        logURL : 'url to report the client side error',
        logThreshold : logger.logLevels.ERROR,
        routeURL : 'where to route when error occures',
        silenceStackTrace : true,
        showMessageInDevelopment : true,
        showMessageInProduction : false,
        additionalMessage : {
            //custom information that can be passed with the error object.
        }
    })
    logger.log('hello world') // this data will not be sent to backend.
    logger.error('error occured when process dom object') // this data will be sent to back server using the logURL provided, if the routeURL is provided, application will be re-routed to that page.
    </script>
```

### <a id="js_example"></a> Javascript example

### How to configure the logger via Init()

```javascript
logger.init({
    // url path, where backend service is hosted
    logURL : <<url>>
    //console methods will trigger a post to backend
    logThresold: logger.logLevels.ERROR // default is fatal
    //url path for the application to re route when an unhandled expection occurs
    routeURL: <url>
    // stack trace of the error occured, we have set to false as they will long and can occupy alot of space.
    silenceStackTrace: false // default is false
    // logging outputs aer enabled in development / testing but may optionally enable them when you choose
    showMessagesInDevelopment:true //default
    // logging outputs are disabled in production but may optionally enable them when you choose
    showMessagesInProduction:false //default
    //when developer what to provide additional infomraiton, they can make use of this property to send
    additionalPostInformation : undefined //default
})
```

