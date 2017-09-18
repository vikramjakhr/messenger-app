/**
 * Created by vikram on 24/2/17.
 */

'use strict';

/*
 * Account Link Event
 *
 * This event is called when the Link Account or UnLink Account action has been
 * tapped.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/account-linking
 * 
 */

const
    subscriberService = require('../../services/subscriber/subscriberService'),
    messageService = require('../../services/message/messageService');

module.exports.receivedAccountLink = function (event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;

    var status = event.account_linking.status;
    var authCode = event.account_linking.authorization_code;

    console.log("Received account link event with for user %d with status %s " +
        "and auth code %s ", senderID, status, authCode);
    if (status == "linked") {
        subscriberService.updatePSID(authCode, senderID);
        let accountLinkingButtons = [
            {
                type: "postback",
                title: "Subscriber Info",
                payload: "SUBSCRIBER_PROFILE"
            },
            {

                type: "account_unlink"
            }
        ];
        messageService.sendButtonMessage(senderID, "what do you want to find info for", accountLinkingButtons);
    }

    /*if (status == "unlinked") {
     sendAccountUnLinkingToBusiness(senderID);

     }*/
};
