//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('Document')

//@Require('ArgUtil')
//@Require('Bug')
//@Require('Class')
//@Require('IClone')
//@Require('IDocument')
//@Require('IMap')
//@Require('IList')
//@Require('IObjectable')
//@Require('ISet')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgUtil             = bugpack.require('ArgUtil');
var Bug                 = bugpack.require('Bug');
var Class               = bugpack.require('Class');
var IClone              = bugpack.require('IClone');
var IDocument           = bugpack.require('IDocument');
var IMap                = bugpack.require('IMap');
var IList               = bugpack.require('IList');
var IObjectable         = bugpack.require('IObjectable');
var ISet                = bugpack.require('ISet');
var Obj                 = bugpack.require('Obj');
var TypeUtil            = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 * @implements {IDocument}
 */
var Document = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {*} data
     */
    _constructor: function(data) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.data = data;
    },


    //-------------------------------------------------------------------------------
    // Obj Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean} deep
     * @return {*}
     */
    clone: function(deep) {
        return new Document(Obj.clone(this.getData(), deep));
    },


    //-------------------------------------------------------------------------------
    // IDocument Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    getData: function() {
        return this.data;
    },

    /**
     * @param {*} data
     */
    mergeData: function(data) {
        //TODO
    },

    /**
     * @param {*} data
     */
    setData: function(data) {
        this.data = data;
    },

    /**
     * @param {string} path
     * @return {*}
     */
    getPath: function(path) {
        var args = ArgUtil.process(arguments, [
            {name: "path", optional: false, type: "string"}
        ]);
        path  = args.path;
        var pathParts = path.split(".");
        var target = undefined;
        var currentData = this.data;
        for (var i = 0, size = pathParts.length; i < size; i++ ) {
            var pathPart = pathParts[i];
            if (pathPart === "") {
                target = currentData;
            } else {
                if (Class.doesImplement(currentData, IMap)) {
                    target      = currentData.get(pathPart);
                    currentData = currentData.get(pathPart);
                } else if (TypeUtil.isObject(currentData)) {
                    target      = currentData[pathPart];
                    currentData = currentData[pathPart];
                } else {
                    return undefined;
                }
            }

            //TODO BRN: implement support for "[somevalue]"
        }
        return target;
    },

    /**
     * @param {string} path
     * @param {*} value
     */
    setPath: function(path, value) {
        if (path === "") {
            this.data = value;
        } else {
            if (!TypeUtil.isObject(this.data) && !TypeUtil.isArray(this.data)) {
                this.data = {};
            }
            var pathParts   = path.split(".");
            var currentData = this.data;
            var nextData    = null;

            for (var i = 0, size = pathParts.length; i < size; i++ ) {
                var pathPart = pathParts[i];
                if (i === size - 1) {
                    if (Class.doesImplement(currentData, IMap)) {
                        currentData.put(pathPart, value);
                    } else if (Class.doesImplement(currentData, IList)) {

                        //TODO BRN: implement support for "[someValue]"

                        throw new Bug("UnsupportedType", {}, "Unsupported List in path");
                    } else if (Class.doesImplement(currentData, ISet)) {

                        //TODO BRN: Figure out how to support Set

                        throw new Bug("UnsupportedType", {}, "Unsupported Set in path");
                    } else if (TypeUtil.isObject(currentData)) {
                        currentData[pathPart] = value;
                    } else if (TypeUtil.isArray(currentData)) {

                        //TODO BRN: implement support for "[someValue]"

                        throw new Bug("UnsupportedType", {}, "Unsupported array in path");
                    } else {
                        throw new Bug("UnsupportedType", {}, "Unsupported type in path");
                    }
                } else {

                    if (Class.doesImplement(currentData, IMap)) {
                        nextData = currentData.get(pathPart);
                    } else if (Class.doesImplement(currentData, ISet)) {

                        //TODO BRN: Figure out how to support Set

                        throw new Bug("UnsupportedType", {}, "Unsupported Set in path");
                    } else if (Class.doesImplement(currentData, IList)) {

                        //TODO BRN: implement support for "[someValue]"

                        throw new Bug("UnsupportedType", {}, "Unsupported List in path");
                    } else if (TypeUtil.isObject(currentData)) {
                        nextData = currentData[pathPart];
                    } else if (TypeUtil.isArray(currentData)) {

                        //TODO BRN: implement support for "[someValue]"

                        throw new Bug("UnsupportedType", {}, "Unsupported array in path");
                    } else {
                        throw new Bug("UnsupportedType", {}, "Unsupported type in path");
                    }

                    if (!TypeUtil.isObject(nextData)) {
                        currentData[pathPart] = {};
                        nextData = currentData[pathPart];
                    }
                    currentData = nextData;
                    nextData = null;
                }
            }
        }
    },


    //-------------------------------------------------------------------------------
    // IObjectable Implementation
    //-------------------------------------------------------------------------------

    /**
     * @returns {Object}
     */
    toObject: function() {
        return this.data;
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(Document, IDocument);
Class.implement(Document, IObjectable);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('Document', Document);
