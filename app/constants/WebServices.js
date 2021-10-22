import App from '../constants/AppData';
export default WebServices = {
    // Url: (App.build.local) ? 'http://192.168.88.14:4003/' : 'http://103.36.77.34:4003/',
    // Url: 'http://34.227.18.184:4003/',
    // Url: 'https://neighborhoodwatche.com/api/',  //Live
    // Url: 'http://192.168.88.14:4003/',  //local
    // Url: 'http://103.212.235.82:4003/',  //Rajat sir msg in group
    Url: 'http://103.149.154.53:4003/',
    PaymentUrl: 'http://103.149.154.53:4003/',
    AuthKey: (App.build.local) ? 'QWR2ZW50cnVzX2NyZWF0ZWRCeV9LcmlzaGFuQG9mZnN1cmVpdC5jb20=' :
        'QWR2ZW50cnVzX2NyZWF0ZWRCeV9LcmlzaGFuQG9mZnN1cmVpdC5jb20=',
    iTunes: 'https://itunes.apple.com/us/app/neighborhood-watche/id1437380405?mt=8&ign-mpt=uo%3D4',
    PlayStore: 'https://play.google.com/store/apps/details?id=com.offsureit.recordingstudio',
    Update: 'http://neighborhoodwatche.com/version.json',
    // Url: 'http://103.36.77.34:4003/',
    // AuthKey: 'QWR2ZW50cnVzX2NyZWF0ZWRCeV9LcmlzaGFuQG9mZnN1cmVpdC5jb20=',
    Self: 'users',
    App: 'app/',
    Studios: 'studios',
    Genre: 'genre',
    Rooms: 'rooms/',
    Room: 'room/',
    Booking: 'booking',
    Cancel: '/cancel',
    Book: 'book/',
    Pay: 'pay',
    Media: 'media?file=',
    Share: 'share/',
    Date: '?date=',
    Availability: '/availability',
    Validate: 'cartValidate',
    Slots: '/slots',
    ConnectStripe: 'connect/stripe/card/list',
    // RoomsByDate: `${Url}${App}${Book}availabile/${Rooms}?date=`,
    // /book/availabile/rooms?date=2019-08-14
    statusCodes: {
        success: 200,
        failure: 400
    },
    status: [
        {
            flag: 'sessionExpired',
            errorMesage: 'Your session has been expired. Please try login again',
            action: 'logout'
        },
        {
            flag: 'loginAnother',
            errorMesage: 'This user is already logged in on another device. Do you want to close previous session?',
            action: 'logoutAnother'
        },
        {
            flag: 'logout',
            message: 'Logout successfully.',
            action: 'exit'
        },
        {
            flag: 'notExistToken',
            errorMesage: 'Your session has been expired. Please try login again',
            action: 'exit'
        },
        {
            flag: 'userNotActive',
            errorMesage: 'Your new account is under review by our staff. You will be notified once the account has been verified.',
            action: 'cancel'
        },
        {
            flag: 'userBlocked',
            errorMesage: 'Your account is blocked by our staff.',
            action: 'exit'
        },

    ]
};