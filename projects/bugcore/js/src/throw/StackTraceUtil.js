//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('StackTraceUtil')

//@Require('StringUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var StringUtil      = bugpack.require('StringUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var StackTraceUtil = {};


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------


/**
 * Open source code taken from http://www.eriwen.com/javascript/js-stack-trace/
 * @return {string}
 */
StackTraceUtil.generateStackTrace = function() {
    var callstack = [];
    var isCallstackPopulated = false;

    //NOTE BRN: See more info about this line https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    Error.stackTraceLimit = Infinity;

    var error = new Error();
    if (error.stack) { //Firefox & nodejs
        callstack = error.stack.split('\n');
        callstack.shift();
        isCallstackPopulated = true;
    } else if (window.opera && error.message) { //Opera
        var lines = error.message.split('\n');
        for (var i = 0, len = lines.length; i < len; i++) {
            if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
                var entry = lines[i];
                //Append next line also since it has the file info
                if (lines[i+1]) {
                    entry += ' at ' + lines[i+1];
                    i++;
                }
                callstack.push(entry);
            }
        }
        //Remove call to printStackTrace()
        callstack.shift();
        isCallstackPopulated = true;
    } else {
        var exception = StackTraceUtil.createException();
        if (exception.stack) {
            callstack = exception.stack.split('\n');
            callstack.shift();
            callstack.shift();
            isCallstackPopulated = true;
        }
    }
    if (!isCallstackPopulated) { //IE
        callstack = StackTraceUtil.generateStackFromCaller();
    }
    return callstack.join("\n");
};

/**
 * @private
 * @return {Array.<string>}
 */
StackTraceUtil.generateStackFromCaller = function() {
    var callstack = [];
    try {
        var currentFunction = arguments.callee.caller;
        while (currentFunction) {
            var fn = currentFunction.toString();
            var fname = fn.substring(0, fn.indexOf("{")) || 'anonymous';
            fname = StringUtil.trim(fname);
            callstack.push(fname);
            currentFunction = currentFunction.caller;
        }
    } catch(error) {
        //TODO BRN: Verify this error is from strict mode
        console.log("Cannot create stack trace in strict mode");
    }
    return callstack;
};

/**
 * @private
 * @return {*}
 */
StackTraceUtil.createException = function() {
    try {
        this.undef();
    } catch (e) {
        return e;
    }
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('StackTraceUtil', StackTraceUtil);
