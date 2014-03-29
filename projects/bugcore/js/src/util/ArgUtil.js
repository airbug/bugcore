//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('ArgUtil')

//@Require('ArgumentBug')
//@Require('Bug')
//@Require('Class')
//@Require('Obj')
//@Require('TypeUtil')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgumentBug     = bugpack.require('ArgumentBug');
var Bug             = bugpack.require('Bug');
var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var TypeUtil        = bugpack.require('TypeUtil');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 */
var ArgUtil = Class.extend(Obj, {});


//-------------------------------------------------------------------------------
// Public Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @param {*} rawArgs
 * @param {Array.<{
 *      name: string,
 *      type: string=,
 *      optional: boolean=,
 *      default: *=
 * }>=} descriptions
 * @return {Object}
 */
ArgUtil.process = function(rawArgs, descriptions) {
    var args                = ArgUtil.processArgs(rawArgs);
    var argsObject          = {};
    var descriptionResults  = ArgUtil.processDescriptions(args, descriptions);
    var descriptionArgMap   = descriptionResults.descriptionArgMap;
    var unusedDescriptions  = descriptionResults.unusedDescriptions;

    ArgUtil.processDescriptionArgMap(args, argsObject, descriptionArgMap);
    ArgUtil.processUnusedDescriptions(args, argsObject, unusedDescriptions);
    return argsObject;
};

/**
 * @private
 * @param {*} rawArgs
 * @return {Array.<*>}
 */
ArgUtil.processArgs = function(rawArgs) {
    var args = ArgUtil.toArray(rawArgs);
    while (TypeUtil.isUndefined(args[args.length - 1]) && args.length > 0) {
        args.pop();
    }
    return args;
};

/**
 * @static
 * @param {Array.<*>} args
 * @param {Array.<{
 *      name: string,
 *      type: string=,
 *      optional: boolean=,
 *      default: *=
 * }>} descriptions
 * @return {{
 *      usedDescriptions: Array.<{
 *          name: string,
 *          type: string=,
 *          optional: boolean=,
 *          default: *=
 *      }>,
 *      unusedDescriptions: Array.<{
 *          name: string,
 *          type: string=,
 *          optional: boolean=,
 *          default: *=
 *      }>
 * }}
 */
ArgUtil.processDescriptions = function(args, descriptions) {
    ArgUtil.validateDescriptions(descriptions, args.length);

    var argsCopy                = ([]).concat(args);
    var descriptionsCopy        = ([]).concat(descriptions);
    var descriptionArgMap       = {};
    var unusedDescriptions      = [];
    var notFoundDescriptions    = [];
    while (descriptionsCopy.length > 0) {
        var description = descriptionsCopy.shift();
        if (descriptionsCopy.length > argsCopy.length - 1) {
            if (description.optional) {
                unusedDescriptions.push(description);
            } else {
                if (argsCopy.length > 0) {
                    descriptionArgMap[description.name] = {
                        arg: argsCopy.shift(),
                        description: description
                    };
                } else {
                    notFoundDescriptions.push(description);
                }
            }
        } else {
            if (argsCopy.length > 0) {
                descriptionArgMap[description.name] = {
                    arg: argsCopy.shift(),
                    description: description
                };
            } else {
                notFoundDescriptions.push(description);
            }
        }
    }

    if (notFoundDescriptions.length > 0) {
        var throwable = null;
        if (notFoundDescriptions.length === 1) {
            throwable = new ArgumentBug(ArgumentBug.ILLEGAL, notFoundDescriptions[0].name, undefined, "Argument missing");
        } else {
            var missingThrowables = [];
            notFoundDescriptions.forEach(function(notFoundDescription) {
                missingThrowables.push(new ArgumentBug(ArgumentBug.ILLEGAL, notFoundDescription.name, undefined, "argument missing"));
            });
            throwable = new Bug("MultipleIllegalArguments", {}, "Multiple arguments missing", missingThrowables);
        }
        throw throwable;
    }
    /*if (args.length === descriptions.length) {
        usedDescriptions = usedDescriptions.concat(descriptions);
    } else {

        var neededDescriptions      = [];
        for (var i = descriptions.length - 1; i >= 0; i--) {
            var description = descriptions[i];

            //This arg is not present
            if (i >= args.length) {
                if (!description.optional) {
                    neededDescriptions.push(description);
                } else {
                    unusedDescriptions.unshift(description);
                }
            } else {
                var arg = args[i];
                if (neededDescriptions.length > 0) {
                    var found = false;
                    while (neededDescriptions.length > 0 && !found) {
                        var neededDescription = neededDescriptions.shift();
                        if (ArgUtil.checkTypeMatch(arg, neededDescription)) {
                            found = true;
                            usedDescriptions.unshift(neededDescription);
                            if (!description.optional) {
                                neededDescriptions.push(description);
                            }  else {
                                unusedDescriptions.unshift(description);
                            }
                        }
                    }
                } else {
                    usedDescriptions.unshift(description);
                }
            }
        }

    }*/
    return {
        descriptionArgMap: descriptionArgMap,
        unusedDescriptions: unusedDescriptions
    };
};

/**
 * @static
 * @param {*} rawArgs
 * @return {Array.<*>}
 */
ArgUtil.toArray = function(rawArgs) {
    return Array.prototype.slice.call(rawArgs, 0);
};


//-------------------------------------------------------------------------------
// Private Static Methods
//-------------------------------------------------------------------------------

/**
 * @static
 * @private
 * @param {*} arg
 * @param {{
 *      name: string,
 *      type: string=,
 *      optional: boolean=,
 *      default: *=
 * }} description
 * @return {boolean}
 */
ArgUtil.checkTypeMatch = function(arg, description) {
    var validType   = true;
    if (description.type) {
        var type        = TypeUtil.toType(arg);
        if (TypeUtil.isArray(description.type)) {
            validType = (description.type.indexOf(type) >= 0);
        } else {
            validType = (type === description.type);
        }
    }
    return validType;
};

/**
 * @static
 * @private
 * @param {Array.<*>} args
 * @param {Object} argsObject
 * @param {Array.<{
 *      name: string,
 *      type: string=,
 *      optional: boolean=,
 *      default: *=
 * }>} unusedDescriptions
 */
ArgUtil.processUnusedDescriptions = function(args, argsObject, unusedDescriptions) {
    for (var i = unusedDescriptions.length - 1; i >= 0; i--) {
        var unusedDescription   = unusedDescriptions[i];
        if (unusedDescription.default) {
            argsObject[unusedDescription.name] = unusedDescription.default;
        } else {
            argsObject[unusedDescription.name] = undefined;
        }
    }
};

/**
 * @static
 * @private
 * @param {Array.<*>} args
 * @param {Object} argsObject
 * @param {Array.<{
 *      name: string,
 *      type: string=,
 *      optional: boolean=,
 *      default: *=
 * }>} descriptionArgMap
 */
ArgUtil.processDescriptionArgMap = function(args, argsObject, descriptionArgMap) {
    Obj.forIn(descriptionArgMap, function(name, value) {
        ArgUtil.setArgOnArgsObject(value.arg, argsObject, value.description);
    });




    /*
     var neededDescriptions      = [];

     for (var i = usedDescriptions.length - 1; i >= 0; i--) {
        var arg             = args[i];
        if (TypeUtil.isUndefined(arg)) {

        }
    }

    for (var i = usedDescriptions.length - 1; i >= 0; i--) {
        var arg = args[i];
        var usedDescription = usedDescriptions[i];

        if (neededDescriptions.length > 0) {

        }
        if (ArgUtil.checkTypeMatch(arg, usedDescription)) {
            ArgUtil.setArgOnArgsObject(arg, argsObject, usedDescription);
        } else {
            if (!usedDescription.optional) {
                neededDescriptions.push(usedDescription);
            } else {

            }
        }
        if (neededDescriptions.length > 0) {
            var found = false;
            while (neededDescriptions.length > 0 && !found) {
                var neededDescription = neededDescriptions.shift();
                if (ArgUtil.checkTypeMatch(arg, neededDescription)) {
                    found = true;
                    usedDescriptions.unshift(neededDescription);
                    if (!description.optional) {
                        neededDescriptions.push(description);
                    }  else {
                        unusedDescriptions.unshift(description);
                    }
                } else {
                    notFoundDescriptions.push(neededDescription);
                }
            }
        } else {
            usedDescriptions.unshift(description);
        }

    }*/
};

/**
 * @static
 * @private
 * @param {*} arg
 * @param {Object} argsObject
 * @param {{
 *      name: string,
 *      type: string=,
 *      optional: boolean=,
 *      default: *=
 * }} description
 */
ArgUtil.setArgOnArgsObject = function(arg, argsObject, description) {
    var validType = ArgUtil.checkTypeMatch(arg, description);
    if (!validType) {
        throw new ArgumentBug(ArgumentBug.ILLEGAL, description.name, arg, "Argument type does not match. Must be of type '" + description.type + "'");
    }
    argsObject[description.name] = arg;
};

/**
 * @static
 * @private
 * @param {Array.<{
 *      name: string,
 *      type: string=,
 *      optional: boolean=,
 *      default: *
 * }>=} descriptions
 * @param {number} expectedNumber
 */
ArgUtil.validateDescriptions = function(descriptions, expectedNumber) {
    if (!TypeUtil.isArray(descriptions)) {
        throw new ArgumentBug(ArgumentBug.ILLEGAL, "descriptions", descriptions, "parameter must be an Array");
    }

    //TODO BRN: Is this something that we want to support? Should we have to declare all args?
    if (expectedNumber > descriptions.length) {
        throw new  ArgumentBug(ArgumentBug.ILLEGAL, "descriptions", descriptions,
            "Too few descriptions. Number of descriptions must be equal to or greater than the number of arguments");
    }

    for (var i = descriptions.length - 1; i >= 0; i--) {
        var description = descriptions[i];
        if (!TypeUtil.isObject(description)) {
            throw new ArgumentBug(ArgumentBug.ILLEGAL, "descriptions", descriptions, "descriptions Array must only contain description objects");
        }
        if (!TypeUtil.isString(description.name)) {
            throw new ArgumentBug(ArgumentBug.ILLEGAL, "descriptions", descriptions, "description objects must have a name");
        }
    }
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('ArgUtil', ArgUtil);
