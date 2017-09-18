/**
 * Created by vikram on 24/2/17.
 */

/*
 * Use your own validation token. Check that the token used in the Webhook
 * setup is the same token used here.
 *
 */

'use strict';

const
    fbConfig = require('../../util/fbConfig'),
    authenticationService = require('../../services/authentication/authenticationService'),
    deliveryService = require('../../services/delivery/deliveryService'),
    accountLinkingService = require('../../services/linking/accountLinkingService'),
    messageService = require('../../services/message/messageService'),
    postbackService = require('../../services/postback/postbackService');

module.exports.validateToken = function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === fbConfig.VALIDATION_TOKEN) {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
};

module.exports.webhook = function (req, res) {
    var data = req.body;

    // Make sure this is a page subscription
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach(function (pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;

            // Iterate over each messaging event
            pageEntry.messaging.forEach(function (messagingEvent) {
                if (messagingEvent.optin) {
                    authenticationService.receivedAuthentication(messagingEvent);
                } else if (messagingEvent.message) {
                    messageService.receivedMessage(messagingEvent);
                } else if (messagingEvent.delivery) {
                    deliveryService.receivedDeliveryConfirmation(messagingEvent);
                } else if (messagingEvent.postback) {
                    postbackService.receivedPostback(messagingEvent);
                } else if (messagingEvent.read) {
                    messageService.receivedMessageRead(messagingEvent);
                } else if (messagingEvent.account_linking) {
                    accountLinkingService.receivedAccountLink(messagingEvent);
                } else {
                    console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                }
            });
        });

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know you've
        // successfully received the callback. Otherwise, the request will time out.
        res.sendStatus(200);
    }
};
