/**
 * Created by vikram on 24/2/17.
 */

'use strict';


const
    messageService = require('../../services/message/messageService'),
    subscriberService = require('../../services/subscriber/subscriberService'),
    httpUtil = require('../../util/httpUtil'),
    config = require('config');


/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message. 
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 * 
 */
module.exports.receivedPostback = function (event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;

    // The 'payload' param is a developer-defined field which is set in a postback
    // button for Structured Messages.
    var payload = event.postback.payload;

    console.log("Received postback for user %d and page %d with payload '%s' " +
        "at %d", senderID, recipientID, payload, timeOfPostback);


    switch (payload) {
        case 'EMAIL_US':
            messageService.sendTextMessage(senderID, "You can email your query at contact@tatasky.com. We will get back");
            break;

        case 'GET_STARTED_BUTTON':
            let buttons = [
                {
                    type: "postback",
                    title: "Set Top Box",
                    payload: "SET_TOP_BOXES"
                },
                {
                    type: "postback",
                    title: "Contact Us",
                    payload: "CONTACT_US"
                }
                ,
                {
                    type: "account_link",
                    url: config.get("loginURL")
                }

            ];

            messageService.sendButtonMessage(senderID, "Welcome to Tata Sky Bot Assistant. Select one of the following options", buttons);
            break;
        case 'CONTACT_US':

            let buttonsContactUs = [
                {
                    type: "phone_number",
                    title: "Customer Service",
                    payload: "18002086633"
                },
                {
                    type: "phone_number",
                    title: "Get a Callback",
                    payload: "+917411774117"
                },
                {
                    type: "postback",
                    title: "Email us",
                    payload: "EMAIL_US"
                }

            ];

            messageService.sendButtonMessage(senderID, "You can reach out to us through one of the following options", buttonsContactUs);
            break;
        case 'SET_TOP_BOXES':
            messageService.sendButtonMessage(senderID, "How do you want to see the Set Top Box Listing", setTopBoxInfoDetails());
            break;
        case 'SET_TOP_BOXES_CAROUSEL_VIEW':
            messageService.sendGenericMessage(senderID, setTopBoxCarouselView());
            break;
        case 'SET_TOP_BOXES_LIST_VIEW':
            sendListMessage(senderID, setTopBoxListView());
            break;
        case 'SUBSCRIBER_PROFILE':
            console.log("sender idddddddd : " + senderID);
            subscriberService.fetchSubscriberByPSID(senderID, function (err, results) {
                messageService.sendTextMessage(senderID, "Subscriber Id:" + results[0].subscriber_id +
                    " subscriber name:" + results[0].subscriber_name + " Account Status:" + results[0].account_status)
            });
            break;

        default:
            messageService.sendTextMessage(senderID, "I'm not sure what you want. Can you be more specific?");
            break;

    }


    // When a postback is called, we'll send a message back to the sender to
    // let them know it was successful
    // messageService.sendTextMessage(senderID, "Hey!!! Glad to see you. We've lot of interesting stuff for you. Do you want to " +
    //     "see some of them?");
};

function sendListMessage(recipientId, elements) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "list",
                    top_element_style: "compact",
                    elements: elements,
                    buttons: [
                        {
                            title: "Home",
                            type: "postback",
                            payload: "GET_STARTED_BUTTON"
                        }
                    ]
                }
            }
        }
    };

    httpUtil.sendPost(messageData);
}

function setTopBoxInfoDetails() {
    let buttonssetTopBoxInfoDetails = [
        {
            type: "postback",
            title: "Carousel View",
            payload: "SET_TOP_BOXES_CAROUSEL_VIEW"
        },
        {
            type: "postback",
            title: "List View",
            payload: "SET_TOP_BOXES_LIST_VIEW"
        }

    ];
    return buttonssetTopBoxInfoDetails;
}

function setTopBoxCarouselView() {
    let elementssetTopBoxCarouselView = [
        {
            title: 'Tata Sky',
            image_url: "http://res.cloudinary.com/amur-labs/image/upload/v1486657763/3_srkcxu.png",
            subtitle: 'Exciting services such as Actve Services and Showcase, our Pay-Per-View movie',
            default_action: {
                type: "web_url",
                url: "http://www.tatasky.com/wps/portal/TataSky/set-top-boxes/tatasky"

            },
            buttons: [
                {
                    type: "web_url",
                    url: "http://www.tatasky.com/wps/portal/TataSky/set-top-boxes/tatasky",
                    title: "View Details"
                },
                // {
                //   type:"web_url",
                // url:"https://www.facebook.com/dialog/feed?app_id=184683071273&link=facebook.com&picture=http%3A%2F%2Fres.cloudinary.com%2Famur-labs%2Fimage%2Fupload%2Fv1486657763%2F3_srkcxu.png&name=Test&caption=%20&description=descripton&redirect_uri=http%3A%2F%2Fwww.facebook.com%2F",
                //   title:"Test Share"
                // },
                {
                    type: "element_share"
                }
            ]
        },
        {
            title: 'Tata Sky HD',
            image_url: "http://res.cloudinary.com/amur-labs/image/upload/v1486657746/2_pcscub.png",
            subtitle: 'Great picture quality, incredibly vivid colours, sharper images and stunning surround sound',
            default_action: {
                type: "web_url",
                url: "http://www.tatasky.com/wps/portal/TataSky/set-top-boxes/tataskyhd"

            },
            buttons: [
                {
                    type: "web_url",
                    url: "http://www.tatasky.com/wps/portal/TataSky/set-top-boxes/tataskyhd",
                    title: "View Details"
                },
                {
                    type: "element_share"
                }
            ]
        },
        {
            title: 'Tata Sky+ Transfer HD',
            image_url: "http://res.cloudinary.com/amur-labs/image/upload/v1487567514/image_ryskxy.png",
            subtitle: 'Stream your favourite shows, directly on your Android or iOS device !',
            default_action: {
                type: "web_url",
                url: "http://www.tatasky.com/wps/portal/TataSky/set-top-boxes/tataskyplustransfer"

            },
            buttons: [
                {
                    type: "web_url",
                    url: "http://www.tatasky.com/wps/portal/TataSky/set-top-boxes/tataskyplustransfer",
                    title: "View Details"
                },
                {
                    type: "element_share"
                }
            ]
        },
        {
            title: 'Tata Sky 4K',
            image_url: "http://res.cloudinary.com/amur-labs/image/upload/v1486657723/1_dc51qq.png",
            subtitle: 'Future ready Ultra High Definition 4K that takes TV viewing to New level',
            default_action: {
                type: "web_url",
                url: "http://www.tatasky.com/wps/portal/TataSky/set-top-boxes/tatasky4k"

            },
            buttons: [
                {
                    type: "web_url",
                    url: "http://www.tatasky.com/wps/portal/TataSky/set-top-boxes/tatasky4k",
                    title: "View Details"
                },
                {
                    type: "element_share"
                }
            ]
        }

    ];

    return elementssetTopBoxCarouselView;
}

function setTopBoxListView() {
    let elementssetTopBoxListView = [
        {
            title: 'Tata Sky',
            image_url: "http://res.cloudinary.com/amur-labs/image/upload/v1486657763/3_srkcxu.png",
            subtitle: 'Exciting services such as Actve Services and Showcase, our Pay-Per-View movie',
            default_action: {
                type: "web_url",
                url: "http://www.tatasky.com/wps/portal/TataSky/set-top-boxes/tatasky"

            },
            buttons: [
                {
                    type: "web_url",
                    url: "http://www.tatasky.com/wps/portal/TataSky/orderonline?boxType=Standard",
                    title: "Get Connection"
                }
            ]


        },
        {
            title: 'Tata Sky HD',
            image_url: "http://res.cloudinary.com/amur-labs/image/upload/v1486657746/2_pcscub.png",
            subtitle: 'Great picture quality, incredibly vivid colours and stunning surround sound',
            default_action: {
                type: "web_url",
                url: "http://www.tatasky.com/wps/portal/TataSky/set-top-boxes/tataskyhd"

            },
            buttons: [
                {
                    type: "web_url",
                    url: "http://www.tatasky.com/wps/portal/TataSky/orderonline?boxType=HD",
                    title: "Get Connection"
                }
            ]


        },
        {
            title: 'Tata Sky+ Transfer HD',
            image_url: "http://res.cloudinary.com/amur-labs/image/upload/v1487567514/image_ryskxy.png",
            subtitle: 'Stream your favourite shows, directly on your Android or iOS device !',
            default_action: {
                type: "web_url",
                url: "http://www.tatasky.com/wps/portal/TataSky/set-top-boxes/tataskyplustransfer"

            },
            buttons: [
                {
                    type: "web_url",
                    url: "http://www.tatasky.com/wps/portal/TataSky/orderonline?boxType=Transfer",
                    title: "Get Connection"
                }
            ]


        },
        {
            title: 'Tata Sky 4K',
            image_url: "http://res.cloudinary.com/amur-labs/image/upload/v1486657723/1_dc51qq.png",
            subtitle: 'future ready Ultra High Definition 4K that takes TV viewing to New level',
            default_action: {
                type: "web_url",
                url: "http://www.tatasky.com/wps/portal/TataSky/set-top-boxes/tatasky4k"

            },
            buttons: [
                {
                    type: "web_url",
                    url: "http://www.tatasky.com/wps/portal/TataSky/orderonline?boxType=UHD4K",
                    title: "Get Connection"
                }
            ]

        }


    ];

    return elementssetTopBoxListView;

}