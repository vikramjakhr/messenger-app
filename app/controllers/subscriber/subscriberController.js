'use strict';

const
    subscriberService = require('../../services/subscriber/subscriberService');


module.exports.subscriberInfoByPSID = function (req, res) {
    var psid = req.query['psid'];
    console.log(psid);
    subscriberService.fetchSubscriberByPSID(psid, function (err, results) {
        if (!err) {
            var resp = {
                subscriberId: results[0].subscriber_id,
                subscriberName: results[0].subscriber_name,
                isPremiumUser: results[0].is_premium_user,
                hasPVR: results[0].is_pvr,
                rmn: results[0].rmn,
                accountStatus: results[0].account_status
            };
            res.status(200).send(resp);
        } else {
            console.error("Error while fetching subscriber info");
            res.sendStatus(403);
        }
    });
};