/*
 * Copyright (c) 2014 airbug inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */

//-------------------------------------------------------------------------------
// Script
//-------------------------------------------------------------------------------

var bugpackApi  = require("bugpack");
var bugpack     = bugpackApi.loadContextSync(module);
bugpack.loadExportSync("BugCore");
var BugCore     = bugpack.require("BugCore");


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

module.exports = BugCore.getInstance();
