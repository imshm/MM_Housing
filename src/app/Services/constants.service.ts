export enum VARS {
    APP_TIMEZONE                = 'Asia/Calcutta',
    TZ_TIMEZONE_FORMAT          = 'ha z',
    DEFAULT_DATE_FORMAT         = 'MM/dd/yyyy',
    APP_TIMEZONE_LOCALES        = 'en-US',
    MSG_BACK_BUTTON             = 'Tap again to exit',
    EMAIL_PATTERN               = '^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
    OFFSET                      = 0,
    PAGE                        = 1,
    LIMIT_LIST                  = 15,
    SORT_BY                     = 'DESC',
    MAX_FILE_SIZE_MB            = 5,
    ON_HTTP_CONNECTION_LOST     = 'The Internet connection appears to be offline, please try again later',
    ON_CONNECT_NETWORK          = 'You are online',
    ON_DISCONNECT_NETWORK       = 'You are offline. Some functionality may be unavailable',
    LOGGED_OUT                  = 'Logged out.',
    ERROR_FILE_DOWNLOAD         = 'File download failed. Please try again.',
    ERROR_NO_FILE_APP           = 'No app found to open this file type.',
    ERROR_OPENING_FILE          = 'Error opening file.',
    SUCCESS_FILE_DOWNLOAD       = 'File has been downloaded.',
    SUCCESS_FILE_BEEN_DOWNLOAD  = ' has been downloaded.',
    ALLOWED_FILE_TYPE           = 'image/jpeg,image/jpg,image/png,image/gif',
    OTHER_FILE_TYPE             = 'image/jpeg,image/jpg,image/png,application/pdf',
    IMG_PDF_FILE_TYPE           = 'application/pdf',
    IMG_PDF_FILE_TYPE_EXT       = 'pdf',

    INVALID_USER                = 'Logged out due to invalid Login.',
    ERROR_CONNECTION            = 'Connection error. Please try again later',
    MULTIPLE_SELECT_IMG         = 5,
    DEFAULT_FILE_TYPE           = 'image/jpeg,image/jpg,image/png,image/gif',
    MAX_FILE_SIZE_5             = 5242880, // 5000000,
    MAX_FILE_SIZE_10            = 10485760, // 10000000,
    NUMERIC_PATTERN           = '/[0-9]+/g',
    MIN_PASS_LENGTH             = 6,
}

export enum APP_URLS {
    LOGIN   = '/login',
    SEARCH   = '/search',
}
export enum SITE_URLS {
    MAIN    = '',
    LOGIN   = '/login',
    GET_CATEGORY   = 'getcategory',
    GET_BANNERS   = 'getbanners',
    GET_PRODUCTS   = 'getproducts',
    GET_RECENT_PRODUCTS   = 'getrecentproducts',
}
export enum FILE_VAR {
    MULTIPLE_SELECT_DEFAULT     = 5,
    MULTIPLE_SELECT             = 5,
    MAX_SIZE_MB                 = 5,
    MAX_FILE_SIZE_DEFAULT       = 10485760,
    MAX_FILE_SIZE_5             = 5242880,
    MAX_FILE_SIZE_10            = 10485760,
    ERROR_FILE_DOWNLOAD         = 'File download failed. Please try again.',
    ERROR_NO_FILE_APP           = 'No app found to open this file type.',
    ERROR_OPENING_FILE          = 'Error opening file.',
    SUCCESS_FILE_DOWNLOAD       = 'File has been downloaded.',
    SUCCESS_FILE_BEEN_DOWNLOAD  = ' has been downloaded.',
    ALLOWED_FILE_TYPE           = 'image/jpeg,image/jpg,image/png,image/gif,image/tiff,image/pjepg',
    IMG_FILE_TYPE               = 'image/jpeg,image/jpg,image/png',
    OTHER_FILE_TYPE             = 'image/jpeg,image/jpg,image/png,application/pdf',
    IMG_PDF_FILE_TYPE           = 'application/pdf',
    IMG_PDF_FILE_TYPE_EXT       = 'pdf',
    SUB_HEADER1                 = '**Allowed - jpeg, jpg, png, gif, pjepg, tiff. MaxSize - 10 MB. Max 5 file(Choose from gallery).',
    SUB_HEADER2                 = '**Allowed - jpeg, jpg, png, gif, pjepg, tiff.'
}
export enum VALIDATION_MSG {
    ERR_REQUIRED_FIELD              = '*You must enter a value.',
    ERR_REQUIRED_SELECT             = '*You must select a value.',
    ERR_EMAIL_PATTERN               = '*Email format is not correct',
    ERR_FIELD_NOT_MATCH             = '*Fields do not match',
    ERR_NUMERIC_ONLY                = '*Only Numeric Values Allowed',
    ERR_GREATER_OR_EQUAL            = '*Value should be greater than or Equal to ',
    ERR_LESS_OR_EQUAL               = '*Value should be Less than or Equal to ',
    ERR_PASS_MIN_LENGTH             = '*Password must be minimum 8 characters long!',
    ERR_GREATER_THAN_ZERO           = '*Value should be greater than or Equal to 1',
    CUSTOMER_ERR_LENGTH_NOT_MATCH   = '*Length do not match.',
    ERR_PERMISSION_ALLOW            = 'Please allow camera permissions.',
    ERR_INVALID_USER                = 'Logged out due to invalid Login.',
    ERR_NOT_AUTHORISED_USER         = 'You are not authorised person. Please contact admin.',
    ERR_FILE_TYPE                   = 'File type not allowed!',
    ERR_FILE_SIZE                   = 'File size not allowed!',
    ERR_FILE_SIZE_AND_TYPE          = 'One or more file(s) SIZE or TYPE not allowed!',
    ERR_LOGOUT                      = 'Logged out.',
    ERR_LENGTH_NOT_MATCH            = '*Enter 10 digits only.',
}
export enum IMG {
    DEFAULT_IMAGE   = 'assets/icon/icon.png',
    ERROR_IMAGE     = 'assets/icon/icon.png',
}

export declare type INPUT_TYPE_NAME = keyof typeof INPUT_TYPE_NAME_MAP;
declare const INPUT_TYPE_NAME_MAP: {
    _EMAIL,
    _PASSWORD,
    _INPUT,
    _SELECT,
    _EQUAL,
    _MINLENGTH_MAXLENGTH_SAME,
    _PATTERN_NUM_MIN_MAX,
    _MAX_CHAR,
    _MIN_CHAR,
    PASSWORD,
    MINLENGTH_MAXLENGTH_SAME,
    OTHER;
};
export const USER_DETAILS = {
    DATA: undefined
};

export const ALPHA = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
// Mindz123
