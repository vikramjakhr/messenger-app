'use strict';

const
    mysql = require('mysql'),
    config = require('config');

module.exports.connectionPool = mysql.createPool({
    host: config.get("dbHost"),
    user: config.get("dbUser"),
    password: config.get("dbPassword"),
    database: config.get("dbName"),
    connectionLimit: 10,
    typeCast: function castField(field, useDefaultTypeCasting) {
        if (( field.type === "BIT" ) && ( field.length === 1 )) {
            var bytes = field.buffer();
            return ( bytes[0] === 1 );
        }
        return ( useDefaultTypeCasting() );
    }
});