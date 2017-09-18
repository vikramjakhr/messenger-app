/**
 * Created by vikram on 24/2/17.
 */

/*
 * Use your own validation token. Check that the token used in the Webhook
 * setup is the same token used here.
 *
 */

'use strict';

/*
 * This path is used for account linking. The account linking call-to-action
 * (sendAccountLinking) is pointed to this URL. 
 * 
 */

const
    uuidV1 = require('uuid/v1'),
    subscriberService = require('../../services/subscriber/subscriberService');


module.exports.authorize = function (req, res) {
    console.log("Received authorization request");
    var body = req.body;
    var subscriberId = body.subscriberId;
    var password = body.password;
    var accountLinkingToken = body.accountLinkingToken;
    var redirectURI = body.redirectURI;
    console.log("Authorization request for subscriberId %s and password %s with accountLinkingToken %s and redirectURI %s",
        subscriberId, password, accountLinkingToken, redirectURI);
    // Authorization Code should be generated per user by the developer. This will
    subscriberService.validateSubscriber(subscriberId, password, function (err, isValid) {
        console.log(isValid);
        if (isValid) {
            var authCode = uuidV1();
            subscriberService.updateAuthorizationCode(subscriberId, authCode);
            var redirectURISuccess = redirectURI + "&authorization_code=" + authCode;
            console.log("Sending response uri : %s", redirectURISuccess);
            res.jsonp({redirectURISuccess: redirectURISuccess, isValid: isValid});
        } else {
            res.jsonp({redirectURISuccess: "/login.html", isValid: isValid});
        }
    });
};