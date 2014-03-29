//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('CommandProcessor')

//@Require('ArgumentBug')
//@Require('Class')
//@Require('Command')
//@Require('CommandBatch')
//@Require('IList')
//@Require('Obj')
//@Require('Queue')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgumentBug         = bugpack.require('ArgumentBug');
var Class               = bugpack.require('Class');
var Command             = bugpack.require('Command');
var CommandBatch        = bugpack.require('CommandBatch');
var IList               = bugpack.require('IList');
var Obj                 = bugpack.require('Obj');
var Queue               = bugpack.require('Queue');
var TypeUtil            = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CommandProcessor = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @extends {Obj}
     */
    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Queue.<CommandBatch>}
         */
        this.commandBatchQueue      = new Queue();

        /**
         * @private
         * @type {boolean}
         */
        this.processing             = false;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    isProcessing: function() {
        return this.processing;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {(Command | Array.<Command> | List.<Command> | CommandBatch)} commands
     * @param {function(Throwable=)} callback
     */
    processCommands: function(commands, callback) {
        var commandBatch = null;
        if (Class.doesExtend(commands, Command)) {
            commandBatch = this.factoryCommandBatch([commands], callback);
        } else if (Class.doesExtend(commands, CommandBatch)) {
            commandBatch = commands;
        } else if (Class.doesImplement(commands, IList) || TypeUtil.isArray(commands)) {
            commandBatch = this.factoryCommandBatch(commands, callback);
        } else {
            return callback(new ArgumentBug(ArgumentBug.ILLEGAL, "commands", commands, "parameter must be a Command, array of Commands, a List of Commands, or a CommandBatch"));
        }
        this.queueCommandBatch(commandBatch);
        this.processCommandQueue();
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    dequeueAndExecuteCommandBatch: function() {
        if (this.commandBatchQueue.getCount() > 0) {
            var commandBatch = this.commandBatchQueue.dequeue();
            this.executeCommandBatch(commandBatch);
        } else {
            this.processing = false;
        }
    },

    /**
     * @private
     * @param {CommandBatch} commandBatch
     */
    executeCommandBatch: function(commandBatch) {
        var _this = this;
        commandBatch.execute(function() {
            _this.dequeueAndExecuteCommandBatch();
        });
    },

    /**
     * @private
     * @param {(Array.<Command> | List.<Command>)} commands
     * @param {function(Throwable=)} callback
     * @return {CommandBatch}
     */
    factoryCommandBatch: function(commands, callback) {
        return new CommandBatch(commands, callback);
    },

    /**
     * @private
     */
    processCommandQueue: function() {
        if (!this.isProcessing()) {
            this.processing = true;
            this.dequeueAndExecuteCommandBatch();
        }
    },

    /**
     * @private
     * @param {CommandBatch} commandBatch
     */
    queueCommandBatch: function(commandBatch) {
        this.commandBatchQueue.enqueue(commandBatch);
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('CommandProcessor', CommandProcessor);
