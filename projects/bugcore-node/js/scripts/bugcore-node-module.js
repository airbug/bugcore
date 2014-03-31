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

module.exports = new BugCore();
