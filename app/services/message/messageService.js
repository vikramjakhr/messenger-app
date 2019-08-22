/**
 * Created by vikram on 24/2/17.
 */

'use strict';

const
    fbConfig = require('../../util/fbConfig'),
    httpUtil = require('../../util/httpUtil');


/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message'
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
 *
 * For this example, we're going to echo any text that we get. If we get some
 * special keywords ('button', 'generic', 'receipt'), then we'll send back
 * examples of those bubbles to illustrate the special message bubbles we've
 * created. If we receive a message with an attachment (image, video, audio),
 * then we'll simply confirm that we've received the attachment.
 *
 */
module.exports.receivedMessage = function (event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    var isEcho = message.is_echo;
    var messageId = message.mid;
    var appId = message.app_id;
    var metadata = message.metadata;

    // You may get a text or attachment but not both
    var messageText = message.text;
    var messageAttachments = message.attachments;
    var quickReply = message.quick_reply;

    if (isEcho) {
        // Just logging message echoes to console
        console.log("Received echo for message %s and app %d with metadata %s",
            messageId, appId, metadata);
        return;
    } else if (quickReply) {
        var quickReplyPayload = quickReply.payload;
        console.log("Quick reply for message %s with payload %s",
            messageId, quickReplyPayload);

        sendTextMessage(senderID, "Quick reply tapped");
        return;
    }

    if (messageText) {

        // If we receive a text message, check to see if it matches any special
        // keywords and send back the corresponding example. Otherwise, just echo
        // the text we received.
        switch (messageText) {
            case 'image':
                sendImageMessage(senderID);
                break;

            case 'gif':
                sendGifMessage(senderID);
                break;

            case 'audio':
                sendAudioMessage(senderID);
                break;

            case 'video':
                sendVideoMessage(senderID);
                break;

            case 'file':
                sendFileMessage(senderID);
                break;

            // case 'button':
            //     sendButtonMessage(senderID);
            //     break;

            case 'generic':
                sendGenericMessage(senderID);
                break;

            case 'receipt':
                sendReceiptMessage(senderID);
                break;

            case 'quick reply':
                sendQuickReply(senderID);
                break;

            case 'read receipt':
                sendReadReceipt(senderID);
                break;

            case 'typing on':
                sendTypingOn(senderID);
                break;

            case 'typing off':
                sendTypingOff(senderID);
                break;

            case 'account linking':
                sendAccountLinking(senderID);
                break;

            default:
                sendTextMessage(senderID, messageText);
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received");
    }
};

/*
 * Message Read Event
 *
 * This event is called when a previously-sent message has been read.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read
 *
 */


module.exports.receivedMessageRead = function (event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;

    // All messages before watermark (a timestamp) or sequence have been seen.
    var watermark = event.read.watermark;
    var sequenceNumber = event.read.seq;

    console.log("Received message read event for watermark %d and sequence " +
        "number %d", watermark, sequenceNumber);
};


/*
 * Send an image using the Send API.
 *
 */
function sendImageMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "image",
                payload: {
                    url: fbConfig.SERVER_URL + "/assets/rift.png"
                }
            }
        }
    };

    httpUtil.sendPost(messageData);
}

/*
 * Send a Gif using the Send API.
 *
 */
function sendGifMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "image",
                payload: {
                    url: fbConfig.SERVER_URL + "/assets/instagram_logo.gif"
                }
            }
        }
    };

    httpUtil.sendPost(messageData);
}

/*
 * Send audio using the Send API.
 *
 */
function sendAudioMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "audio",
                payload: {
                    url: fbConfig.SERVER_URL + "/assets/sample.mp3"
                }
            }
        }
    };

    httpUtil.sendPost(messageData);
}

/*
 * Send a video using the Send API.
 *
 */
function sendVideoMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "video",
                payload: {
                    url: fbConfig.SERVER_URL + "/assets/allofus480.mov"
                }
            }
        }
    };

    httpUtil.sendPost(messageData);
}

/*
 * Send a file using the Send API.
 *
 */
function sendFileMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "file",
                payload: {
                    url: fbConfig.SERVER_URL + "/assets/test.txt"
                }
            }
        }
    };

    httpUtil.sendPost(messageData);
}

/*
 * Send a text message using the Send API.
 *
 */
module.exports.sendTextMessage = function sendTextMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };
    httpUtil.sendPost(messageData);
};

/*
 * Send a button message using the Send API.
 *
 */
module.exports.sendButtonMessage = function sendButtonMessage(recipientId, text, buttons) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: text,
                    buttons: buttons
                }
            }
        }
    };

    httpUtil.sendPost(messageData);
}

/*
 * Send a Structured Message (Generic Message type) using the Send API.
 *
 */
    module.exports.sendGenericMessage = function sendGenericMessage(recipientId, elements) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: elements
                }
            }
        }
    };

    httpUtil.sendPost(messageData);
}

/*
 * Send a receipt message using the Send API.
 *
 */
function sendReceiptMessage(recipientId) {
    // Generate a random receipt ID as the API requires a unique ID
    var receiptId = "order" + Math.floor(Math.random() * 1000);

    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "receipt",
                    recipient_name: "Peter Chang",
                    order_number: receiptId,
                    currency: "USD",
                    payment_method: "Visa 1234",
                    timestamp: "1428444852",
                    elements: [{
                        title: "Oculus Rift",
                        subtitle: "Includes: headset, sensor, remote",
                        quantity: 1,
                        price: 599.00,
                        currency: "USD",
                        image_url: fbConfig.SERVER_URL + "/assets/riftsq.png"
                    }, {
                        title: "Samsung Gear VR",
                        subtitle: "Frost White",
                        quantity: 1,
                        price: 99.99,
                        currency: "USD",
                        image_url: fbConfig.SERVER_URL + "/assets/gearvrsq.png"
                    }],
                    address: {
                        street_1: "1 Hacker Way",
                        street_2: "",
                        city: "Menlo Park",
                        postal_code: "94025",
                        state: "CA",
                        country: "US"
                    },
                    summary: {
                        subtotal: 698.99,
                        shipping_cost: 20.00,
                        total_tax: 57.67,
                        total_cost: 626.66
                    },
                    adjustments: [{
                        name: "New Customer Discount",
                        amount: -50
                    }, {
                        name: "$100 Off Coupon",
                        amount: -100
                    }]
                }
            }
        }
    };

    httpUtil.sendPost(messageData);
}

/*
 * Send a message with Quick Reply buttons.
 *
 */
function sendQuickReply(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: "What's your favorite movie genre?",
            quick_replies: [
                {
                    "content_type": "text",
                    "title": "Action",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
                },
                {
                    "content_type": "text",
                    "title": "Comedy",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
                },
                {
                    "content_type": "text",
                    "title": "Drama",
                    "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
                }
            ]
        }
    };

    httpUtil.sendPost(messageData);
}

/*
 * Send a read receipt to indicate the message has been read
 *
 */
function sendReadReceipt(recipientId) {
    console.log("Sending a read receipt to mark message as seen");

    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: "mark_seen"
    };

    httpUtil.sendPost(messageData);
}

/*
 * Turn typing indicator on
 *
 */
function sendTypingOn(recipientId) {
    console.log("Turning typing indicator on");

    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: "typing_on"
    };

    httpUtil.sendPost(messageData);
}

/*
 * Turn typing indicator off
 *
 */
function sendTypingOff(recipientId) {
    console.log("Turning typing indicator off");

    var messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: "typing_off"
    };

    httpUtil.sendPost(messageData);
}

/*
 * Send a message with the account linking call-to-action
 *
 */
function sendAccountLinking(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "Welcome. Link your account.",
                    buttons: [{
                        type: "account_link",
                        url: fbConfig.SERVER_URL + "/authorize"
                    }]
                }
            }
        }
    };

    httpUtil.sendPost(messageData);
}