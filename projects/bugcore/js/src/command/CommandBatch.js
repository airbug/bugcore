//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('CommandBatch')

//@Require('ArgUtil')
//@Require('Bug')
//@Require('Class')
//@Require('List')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgUtil     = bugpack.require('ArgUtil');
var Bug         = bugpack.require('Bug');
var Class       = bugpack.require('Class');
var List        = bugpack.require('List');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Command}
 */
var CommandBatch = Class.extend(Obj, /** @lends {CommandBatch.prototype} */{

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {(Array.<Command> | List.<Command>)} commands
     * @param {function(Throwable=)} batchCallback
     */
    _constructor: function(commands, batchCallback) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {function(Throwable, Array.<Array.<*>>=)}
         */
        this.batchCallback      = batchCallback;

        /**
         * @private
         * @type {IIterator}
         */
        this.commandIterator    = null;

        /**
         * @private
         * @type {List.<Command>}
         */
        this.commandList        = new List(commands);

        /**
         * @private
         * @type {Array.<Array.<*>>}
         */
        this.commmandResults    = [];

        /**
         * @private
         * @type {function(Throwable=)}
         */
        this.executeCallback    = null;

        /**
         * @private
         * @type {boolean}
         */
        this.executed           = false;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {function(Throwable=)}
     */
    getBatchCallback: function() {
        return this.batchCallback;
    },

    /**
     * @return {List.<Command>}
     */
    getCommandList: function() {
        return this.commandList;
    },

    /**
     * @return {boolean}
     */
    isExecuted: function() {
        return this.executed;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    execute: function(callback) {
        if (!this.isExecuted()) {
            this.executed = true;
            this.executeCallback = callback;
            this.executeBatch();
        } else {
            callback(new Bug("IllegalState", {}, "CommandBatch has already been executed"));
        }
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     */
    executeBatch: function() {
        this.commandIterator    = this.commandList.iterator();
        this.nextCommand();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Throwable=} throwable
     */
    completeBatch: function(throwable) {
        if (!throwable) {
            this.batchCallback(null, this.commmandResults);
        } else {
            this.batchCallback(throwable);
        }
        this.executeCallback();
    },

    /**
     * @private
     * @param {Command} command
     */
    executeCommand: function(command) {

        //NOTE BRN: Prevent stack overflows

        var _this = this;
        setTimeout(function() {
            try {
                command.execute(function() {
                    var args        = ArgUtil.toArray(arguments);
                    var throwable   = args.shift();
                    _this.commmandResults.push(args);
                    if (!throwable) {
                        _this.nextCommand();
                    } else {
                        _this.completeBatch(throwable);
                    }
                });
            } catch(throwable) {
                _this.completeBatch(throwable);
            }
        }, 0);
    },

    /**
     * @private
     */
    nextCommand: function() {
        if (this.commandIterator.hasNext()) {
            var nextCommand = this.commandIterator.next();
            this.executeCommand(nextCommand);
        } else {
            this.completeBatch();
        }
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('CommandBatch', CommandBatch);
