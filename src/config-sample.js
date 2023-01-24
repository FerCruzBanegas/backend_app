require('dotenv').config();

export const port = process.env.PORT || 4000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
export const url = process.env.SITE_URL; /* From ENV */
export const sitename = process.env.SITENAME;
export const environment = process.env.environment || true;
export const websiteUrl = process.env.WEBSITE_URL;
export const socketPort = process.env.PORT || 4001;

export const databaseConfig = { /* From ENV */
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DBNAME,
  host: process.env.DATABASE_HOST,
  dialect: process.env.DATABASE_DIALECT || "mysql"
};

// Licence Upload
export const licenseuploadDir = process.env.LICENSE_UPLOAD_DIR || './images/license/';

// Document Upload
export const documentUploadDir = process.env.DOCUMENT_UPLOAD_DIR || './images/document/';

// Profile photo upload
export const profilePhotouploadDir = process.env.PROFILE_PHOTO_UPLOAD_DIR || './images/avatar/';

// Category photo upload
export const categoryUploadDir = process.env.CATEGORY_PHOTO_UPLOAD_DIR || './images/category/';

// SubCategory photo upload
export const subCategoryUploadDir = process.env.SUB_CATEGORY_PHOTO_UPLOAD_DIR || './images/sub-category/';

// Logo photo upload
export const logoUploadDir = process.env.LOGO_PHOTO_UPLOAD_DIR || './images/logo/';

// Homepage photo upload
export const homepageUploadDir = process.env.HOMEPAGE_PHOTO_UPLOAD_DIR || './images/homepage/';

// Staticpage photo upload
export const staticpageUploadDir = process.env.STATICPAGE_PHOTO_UPLOAD_DIR || './images/staticpage/';

// Contentpage photo upload
export const contentPageUploadDir = process.env.CONTENTPAGE_PHOTO_UPLOAD_DIR || './images/contentPage/';

// Favicon upload
export const faviconUploadDir = process.env.FAVICON_PHOTO_UPLOAD_DIR || './images/favicon/';

// ReviewImage upload
export const reviewImageUploadDir = process.env.REVIEW_PHOTO_UPLOAD_DIR || './images/reviewImage/';

// Promocode upload
export const promoCodeUploadDir = process.env.FAVICON_PHOTO_UPLOAD_DIR || './images/promocode/';

export const toneUploadDir = process.env.TONE_UPLOAD_DIR || './images/tone/';

export const auth = {
  jwt: { secret: process.env.JWT_SECRET }
};

export const serverKey = process.env.FCM_PUSH_NOTIFICATION_SERVER_KEY;


export const payment = { /* From ENV */
  stripe: {
    secretKey: process.env.STRIPE_SECRET,
  }
};