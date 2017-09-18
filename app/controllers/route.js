/**
 * Created by vikram on 24/2/17.
 */

'use strict';

const
    express = require("express");

module.exports = function (app) {
    var webhookController = require("./webhook/webhookController");
    var authController = require("./authentication/authController");
    var subscriberController = require("./subscriber/subscriberController");
    app.get('/webhook', webhookController.validateToken);
    app.post('/webhook', webhookController.webhook);
    app.post('/authorize', authController.authorize);
    app.get('/subscriber/info', subscriberController.subscriberInfoByPSID);
};