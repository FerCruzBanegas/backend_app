import express from 'express';
import path from 'path';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import expressGraphQL from 'express-graphql';
import PrettyError from 'pretty-error';

// configurations
import { auth, port, environment, socketPort } from './config';

// GraphQL
import models from './data/models';
import schema from './data/schema';
import pushNotificationRoutes from './libs/pushNotification/pushNotificationRoutes';
import reviewImageUpload from './libs/upload/reviewImageUpload';

// JWT Auth Middleware
import { verifyJWT_MW } from './libs/middleware';

// Twilio SMS
import TwilioSms from './libs/sms/twilio/sendSms';
import documentUpload from './libs/upload/documentUpload';
import profilePhotoUpload from './libs/upload/profilePhotoUpload';

// Websocket Connections
import connection from './Websocket/connection';

// CRON
import currencyCron from './core/cron/currencyCron';
import tripAutoCancelCron from './core/cron/tripAutoCancelCron';
import deleteCategoryImage from './core/cron/delete-static-images/deleteCategoryImage';
import deleteHomepageImage from './core/cron/delete-static-images/deleteHomepageImage';
import deleteSiteLogoImage from './core/cron/delete-static-images/deleteSiteLogoImage';
import deleteStaticPageImage from './core/cron/delete-static-images/deleteStaticPageImage';
import deleteContentPageImage from './core/cron/delete-static-images/deleteContentPageImage';
import deleteAvatar from './core/cron/delete-static-images/deleteAvatar';
import deletePromoCodeImage from './core/cron/delete-static-images/deletePromoCodeImage';
import deleteReviewImage from './core/cron/delete-static-images/deleteReviewImage';
import deleteSubCategoryImage from './core/cron/delete-static-images/deleteSubCategoryImage';
import deleteUserIdentity from './core/cron/delete-static-images/deleteUserIdentity';

// Admin Panel Image upload
import categoryLogoUpload from './libs/upload/site-admin/categoryLogoUpload';
import categoryBannerUpload from './libs/upload/site-admin/categoryBannerUpload';
import profileImageUpload from './libs/upload/site-admin/profileImageUpload';
import identityUpload from './libs/upload/site-admin/identityUpload';
import experienceUpload from './libs/upload/site-admin/experienceUpload';
import logoUpload from './libs/upload/site-admin/logoUpload';
import uploadTone from './libs/upload/site-admin/uploadTone';
import homepageImageUpload from './libs/upload/site-admin/homepageImageUpload';
import staticPageBannerUpload from './libs/upload/site-admin/staticPageBannerUpload';
import contentPageBannerUpload from './libs/upload/site-admin/contentPageBannerUpload';
import subCategoryUpload from './libs/upload/site-admin/subCategoryUpload';

// Testing
import { sendNotifications } from './helpers/push-notification/sendNotifications';

// Socket notification routes
import socketNotificationRoutes from './Websocket/socketNotificationRoutes';
import promoCodeImageUpload from './libs/upload/site-admin/promoCodeImageUpload';
import scheduleBookingCron from './core/cron/scheduleBookingCron/scheduleBookingCron';
import completeEmailCron from './core/cron/completeEmailCron/completeEmailCron';


const app = express();
const __DEV__ = environment;
app.use(compression());

app.use('/images', express.static(path.join(__dirname, '../images')));

// Middlewares
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Authentication
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, cache-control, Authorization');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
});

app.use(expressJwt({
    secret: auth.jwt.secret,
    credentialsRequired: false,
    getToken: req => req.headers.authToken,
}));

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.send({
            status: 400,
            errorMessage: 'Invalid auth token provided.'
        });
        next();
    }
});

app.use(verifyJWT_MW);

if (__DEV__) {
    app.enable('trust proxy');
}

pushNotificationRoutes(app);
TwilioSms(app);
reviewImageUpload(app);
documentUpload(app);
profilePhotoUpload(app);
logoUpload(app);
uploadTone(app);

// Currency rates CRON
currencyCron(app);
tripAutoCancelCron(app);

//Images Delete Cron
deleteCategoryImage(app);
deleteHomepageImage(app);
deleteSiteLogoImage(app);
deleteStaticPageImage(app);
deleteContentPageImage(app);
deleteAvatar(app);
deletePromoCodeImage(app);
deleteReviewImage(app);
deleteSubCategoryImage(app);
deleteUserIdentity(app);

// Admin panel
categoryLogoUpload(app);
profileImageUpload(app);
identityUpload(app);
experienceUpload(app);
categoryBannerUpload(app);
homepageImageUpload(app);
staticPageBannerUpload(app);
contentPageBannerUpload(app);
subCategoryUpload(app);
promoCodeImageUpload(app);

//scheduleBooking
scheduleBookingCron(app);
completeEmailCron(app);

// Express GraphQL 
const graphqlMiddleware = expressGraphQL((req, res) => ({
    schema,
    graphiql: __DEV__,
    rootValue: {
        request: req,
        response: res
    },
    pretty: __DEV__,
}));

app.use('/graphql', graphqlMiddleware);

// WebSocket Connection 
let server = app.listen(socketPort);
let socketio = require('socket.io')(server);

// WebSocket Testing HTML File
app.get('/', function (req, res) {
    if (__DEV__) {
        console.log('__dirname', __dirname)
        app.use('/socket-helpers', express.static(path.join(__dirname, './helpers/socket-development')));
        res.sendFile(__dirname + '/helpers/socket-development/index.html');
    } else {
        res.send("<p>Hey Buddy! <br /> Do you want any information! Just try it yourself!<p>")
    }
});

connection(app, socketio);

socketNotificationRoutes(app, socketio)

app.post('/push-notification-check', async function (req, res) {
    let content = {
        "data": {
            "status": "accept",
            "notificationId": 8848423,
            "message": "Trip is Accepted",
            "name": "karthik nathan",
            "userId": "62759b90-fa16-11e9-8172-69fcf98f8101",
            "riderId": "62759b90-fa16-11e9-8172-69fcf98f8101",
            "picture": null,
            "phoneNumber": "+919894230865",
            "riderLocation": "563, 80 Feet Rd, Anna Nagar, Sathamangalam, Madurai, Tamil Nadu 625020, India",
            "riderLocationLat": 9.9205003,
            "riderLocationLng": 78.1488813,
            "pickUpLocation": "563, 80 Feet Rd, Anna Nagar, Sathamangalam, Madurai, Tamil Nadu 625020, India",
            "pickUpLat": 9.9205003,
            "pickUpLng": 78.1488813,
            "dropOffLocation": "Madurai, Tamil Nadu, India",
            "dropOffLat": 9.9252007,
            "dropOffLng": 78.1197754,
            "bookingId": 8,
            "category": 1,
            "overallRating": null
        }

    };

    let userId = '1c480030-0f5c-11ea-a0d1-e52d223bb23c';

    const data = await sendNotifications('tripRequest', content, userId);

    res.send(data);
});

app.get('/user/payout/:status', async function (req, res) {
    res.send('  ')
})
// Error Handling
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// Server launch
models.sync().catch(err => console.log(err.stack)).then(() => {
    app.listen({ port: 4000 }, () =>
        console.log(`Server ready at http://localhost:4000`),
    )
});