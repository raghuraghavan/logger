# logger

## CLIENT-SIDE LOGGER

### DESCRIPTION
LOGGER is a javascript utility designed to extend functionality related to common logging methods in a browser environment related specifically to the "console" object exposed by the javascript run-time engine (v8 engine). Logger can be configured to handle posting specific log messages and / or unhandled expections to a backend service. 

Logger specifically tracks errors that propogates to the window event handling system and include: 'Unhandledrejection' & 'error' events, which are supported by and in-spec with the w3c Document Object Model (DOM) Events Specifications.

### [API]
_npm install logger --save

### Support

- Node 
- Browser (tested in IE 11, Chrome 30, Safari 8, FireFox 34)