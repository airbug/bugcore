/*
 * Copyright (c) 2015 airbug Inc. http://airbug.com
 *
 * bugcore may be freely distributed under the MIT license.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('DateUtil')

//@Require('Class')
//@Require('Obj')
//@Require('StringUtil')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context('*', function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class       = bugpack.require('Class');
    var Obj         = bugpack.require('Obj');
    var StringUtil  = bugpack.require('StringUtil');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {Obj}
     */
    var DateUtil = Class.extend(Obj, {
        _name: 'DateUtil'
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {String}
     */
    DateUtil.monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    /**
     * @static
     * @enum {String}
     */
    DateUtil.monthShortNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];


    //-------------------------------------------------------------------------------
    // Static Methods
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @param {Date} date
     * @return {string}
     */
    DateUtil.getAMPM = function(date) {
        if (date.getHours() < 12) {
            return 'AM';
        }
        return 'PM';
    };

    /**
     * @static
     * @param {Date} date
     * @return {string}
     */
    DateUtil.getHour12HourClock = function(date) {
        var hours = date.getHours();
        if (hours === 0) {
            return 12;
        } else if (hours <= 12) {
            return hours;
        }
        return (hours - 12);
    };

    /**
     * @static
     * @param {Date} date
     * @return {string}
     */
    DateUtil.getMonthName = function(date) {
        return DateUtil.monthNames[date.getMonth()];
    };

    /**
     * @static
     * @param {Date} date
     * @return {string}
     */
    DateUtil.getMonthShortName = function(date) {
        return DateUtil.monthShortNames[date.getMonth()];
    };

    /**
     * @static
     * @param {Date} fromDate
     * @param {Date} toDate
     * @return {number}
     */
    DateUtil.getNumberMinutesAgo = function(fromDate, toDate) {
        var fromUTC = fromDate.getTime();
        var toUTC = toDate.getTime();
        var numberMinutesAgo = Math.floor((toUTC - fromUTC) / (1000 * 60));
        return numberMinutesAgo;
    };

    /**
     * @static
     * @param {Date} timestampDate
     * @return {string}
     */
    DateUtil.renderSentAgo = function(timestampDate) {
        var nowDate = new Date();
        var nowUTC = nowDate.getTime();
        var yesterdayDate = new Date(nowUTC - (1000 * 60 * 60 * 24));
        var timestampUTC = timestampDate.getTime();
        var howLongAgo = '';

        // Did this message occur within the last minute?
        if (nowUTC < timestampUTC + (1000 * 60)) {
            howLongAgo += 'a few seconds ago';
        }
        // Did this message occur within the last hour?
        else if (nowUTC < timestampUTC + (1000 * 60 * 60)) {
            var numberOfMinutesAgo = DateUtil.getNumberMinutesAgo(timestampDate, nowDate);
            howLongAgo += numberOfMinutesAgo + ' minutes ago';
        }
        // Did this message occur on the same year?
        else if (nowDate.getFullYear() === timestampDate.getFullYear()) {

            // Did this message occur on the same day and month?
            if (nowDate.getDate() === timestampDate.getDate() && nowDate.getMonth() === timestampDate.getMonth()) {
                howLongAgo += DateUtil.getHour12HourClock(timestampDate) + ':' +
                    StringUtil.lpad(timestampDate.getMinutes(), '0', 2) + ' ' + DateUtil.getAMPM(timestampDate);
            }
            // Did this message occur yesterday?
            else if (yesterdayDate.getDate() === timestampDate.getDate() && yesterdayDate.getMonth() === timestampDate.getMonth()) {
                howLongAgo += 'yesterday ' + DateUtil.getHour12HourClock(timestampDate) + ':' +
                    StringUtil.lpad(timestampDate.getMinutes(), '0', 2) + ' ' + DateUtil.getAMPM(timestampDate);
            }
            else {
                howLongAgo += DateUtil.getMonthName(timestampDate) + ' ' + timestampDate.getDate() + ', ' +
                    DateUtil.getHour12HourClock(timestampDate) + ':' + StringUtil.lpad(timestampDate.getMinutes(), '0', 2) + ' ' +
                    DateUtil.getAMPM(timestampDate);
            }
        }
        // Fallback to a full timestamp
        else {
            howLongAgo += DateUtil.getMonthName(timestampDate) + ' ' + timestampDate.getDate() + ', ' +
                timestampDate.getFullYear() + ' ' + DateUtil.getHour12HourClock(timestampDate) + ':' +
                StringUtil.lpad(timestampDate.getMinutes(), '0', 2) + ' ' + DateUtil.getAMPM(timestampDate);
        }

        return howLongAgo;
    };

    /**
     * @static
     * @param {Date} timestampDate
     * @return {string}
     */
    DateUtil.renderShortTime = function(timestampDate) {
        var nowDate = new Date();
        var stamp = '';

        //same year?
        if (nowDate.getFullYear() === timestampDate.getFullYear()) {

            //same day?
            if (nowDate.getDate() === timestampDate.getDate() && nowDate.getMonth() === timestampDate.getMonth()) {
                stamp += DateUtil.getHour12HourClock(timestampDate) + ':' +
                    StringUtil.lpad(timestampDate.getMinutes(), '0', 2) + ' ' + DateUtil.getAMPM(timestampDate);
            } else {
                stamp += DateUtil.getMonthShortName(timestampDate) + ' ' + timestampDate.getDate();
            }

        } else {
            stamp += timestampDate.getMonth() + '/' + timestampDate.getDate() + '/' + timestampDate.getFullYear();
        }

        return stamp;
    };


    //-------------------------------------------------------------------------------
    // Exports
    //-------------------------------------------------------------------------------

    bugpack.export('DateUtil', DateUtil);
});
