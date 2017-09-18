'use strict';

const
    mysqlUtil = require('../../util/mysqlUtil');

module.exports.updatePSID = function (authCode, psid) {
    mysqlUtil.connectionPool.getConnection(function (err, connection) {
        connection.query('update subscriber set psid = ? where authorization_code= ?',
            [psid, authCode], function (error, results, fields) {
                // And done with the connection.
                if (error) throw error;
                console.log(results);
                connection.release();
            });
    });
};

module.exports.updateAuthorizationCode = function (subscriberId, authCode) {
    mysqlUtil.connectionPool.getConnection(function (err, connection) {
        connection.query('update subscriber set authorization_code = ? where subscriber_id= ?',
            [authCode, subscriberId], function (error, results, fields) {
                // And done with the connection.
                if (error) throw error;
                console.log(results);
                connection.release();
            });
    });
};

module.exports.fetchSubscriberByPSID = function (psid, callback) {
    mysqlUtil.connectionPool.getConnection(function (err, connection) {
        connection.query('select * from subscriber where psid=?',
            [psid], function (error, results, fields) {
                if (error) throw error;
                console.log(results);
                callback(null, results);
                connection.release();
            });
    });
};

module.exports.validateSubscriber = function (subscriberId, password, callback) {
    mysqlUtil.connectionPool.getConnection(function (err, connection) {
        connection.query('select subscriber_id from subscriber where subscriber_id=? and password=?',
            [subscriberId, password], function (error, results, fields) {
                // And done with the connection.
                if (error) throw error;
                console.log(results);
                var isValid = results.length > 0 && results[0].subscriber_id != null;
                callback(null, isValid);
                connection.release();
            });
    });
};