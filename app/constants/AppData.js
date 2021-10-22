export default AppData = {
    build: {
        local: true
    },
    Skills: [
        {
            title: 'Singer',
            id: '1',
            selected: false
        },
        {
            title: 'Hip-hop',
            id: '2',
            selected: false
        },
        {
            title: 'Rapper',
            id: '3',
            selected: false
        },
        {
            title: 'Playback',
            id: '4',
            selected: false
        },
        {
            title: 'Beat-box',
            id: '5',
            selected: false
        },
        {
            title: 'Pop-singing',
            id: '6',
            selected: false
        },
    ],
    skillsData: {
        name: '',
        _id: '',
        selected: false
    },
    timing: [
        {
            timing: '08:00am - 08:00pm'
        },
        {
            timing: '08:00pm - 08:00am'
        },
        {
            timing: '08:00am - 02:00pm'
        },
        {
            timing: '02:00pm - 08:00pm'
        },
        {
            timing: '04:00pm - 08:00pm'
        }
    ],
    days: {
        Weekdays: 'slot_weekdays',
        WeekendSaturday: 'slot_sat',
        WeekendSunday: 'slot_sun'
    },
    email: {
        empty: {
            message: '^Please enter an email address'
        },
        error: {
            message: '^Please enter a valid email address'
        }
    },

    name: {
        error: {
            message: '^Name cannot be blank'
        }
    },

    skills: {
        error: {
            message: 'Please select atleast 1 option'
        }
    },

    internet: {
        success: {
            message: 'Internet connected'
        },
        error: {
            message: 'No internet connection'
        }
    },

    errors: {
        logoutSelf: 'sessionExpired',
        logoutAnother: 'loginAnother',
        tokenExpire: 'notExistToken'
    },
    alert: {
        cancel: 'Cancel',
        exit: 'exit',
        logout: 'logout',
        logoutAnother: 'logoutAnother',
        login: 'login',
        submit: 'submit',
        remove: 'remove',
        payment: 'payment'
    },
    LogoutFlag: {
        None: 'none',
        Another: 'loginAnother'
    },
    Clicked: {
        Call: 'call',
        Switch: 'switch',
        Closed: 'closed',
    },
    studioSlots: {
        Weekdays: 'weekdays',
        Saturday: 'sat',
        Sunday: 'sun'
    },
    markedDates: {
        'selected': { selected: true },
        'key1': { disabled: true, disableTouchEvent: true },
        'key2': { disabled: true, disableTouchEvent: true },
        'key3': { disabled: true, disableTouchEvent: true },
        'key4': { disabled: true, disableTouchEvent: true },
        'key5': { disabled: true, disableTouchEvent: true },
        'key6': { disabled: true, disableTouchEvent: true },
        'key7': { disabled: true, disableTouchEvent: true },
        'key8': { disabled: true, disableTouchEvent: true },
        'key9': { disabled: true, disableTouchEvent: true },
        'key10': { disabled: true, disableTouchEvent: true },
        'key11': { disabled: true, disableTouchEvent: true },
        'key12': { disabled: true, disableTouchEvent: true },
        'key13': { disabled: true, disableTouchEvent: true },
        'key14': { disabled: true, disableTouchEvent: true },
        'key15': { disabled: true, disableTouchEvent: true },
        'key16': { disabled: true, disableTouchEvent: true },
        'key17': { disabled: true, disableTouchEvent: true },
        'key18': { disabled: true, disableTouchEvent: true },
        'key19': { disabled: true, disableTouchEvent: true },
        'key20': { disabled: true, disableTouchEvent: true },
        'key21': { disabled: true, disableTouchEvent: true },
        'key22': { disabled: true, disableTouchEvent: true },
        'key23': { disabled: true, disableTouchEvent: true },
        'key24': { disabled: true, disableTouchEvent: true },
        'key25': { disabled: true, disableTouchEvent: true },
        'key26': { disabled: true, disableTouchEvent: true },
        'key27': { disabled: true, disableTouchEvent: true },
        'key28': { disabled: true, disableTouchEvent: true },
        'key29': { disabled: true, disableTouchEvent: true },
        'key30': { disabled: true, disableTouchEvent: true },
        'key31': { disabled: true, disableTouchEvent: true },
    },
    markedDates: {
        'selected': '',
        'key1': '',
        'key2': '',
        'key3': '',
        'key4': '',
        'key5': '',
        'key6': '',
        'key7': '',
        'key8': '',
        'key9': '',
        'key10': '',
        'key11': '',
        'key12': '',
        'key13': '',
        'key14': '',
        'key15': '',
        'key16': '',
        'key17': '',
        'key18': '',
        'key19': '',
        'key20': '',
        'key21': '',
        'key22': '',
        'key23': '',
        'key24': '',
        'key25': '',
        'key26': '',
        'key27': '',
        'key28': '',
        'key29': '',
        'key30': '',
        'key31': '',
    },
    CartDummy: {
        'studio_name': '',
        'studio_id': '',
        'studio_image': '',
        'premium': false,
        'verified': false,
        'slot_weekdays': {},
        'slot_sat': {},
        'slot_sun': {},
        'studio_hours': '',
        'address': '',
        'phoneNumber': '',
        'service_fee': 0,
        'location': {},
        'bookedRooms': [],
        'studioManagers':[]
    },
    Rooms: {
        'room_name': '',
        'room_id': '',
        'room_image': '',
        'price': '',
        'premium': false,
        'verified': false,
        'parkingSpot':false,
        'engineer':false,
        'slots': []
    },
    SlotsData: {
        'date': '',
        'alreadyBooked': false,
        'bookesSlots': []
    },
    CardDetails: {
        'name': '',
        'number': '',
        'expiry': '',
        'month': '',
        'year': '',
        'CVV': ''
    },
    NotAvailable: {
        booked: 'Bookings marked red are no longer available. You can proceed with rest of them.',
        available: 'Selected Rooms are no longer available. Please try again later'
    },
    weekdays: [
        {
            'day': 0,
            'weekday': 'Sun'
        },
        {
            'day': 1,
            'weekday': 'Mon'
        },
        {
            'day': 2,
            'weekday': 'Tue'
        },
        {
            'day': 3,
            'weekday': 'Wed'
        },
        {
            'day': 4,
            'weekday': 'Thu'
        },
        {
            'day': 5,
            'weekday': 'Fri'
        },
        {
            'day': 6,
            'weekday': 'Sat'
        },
    ],
    stripeError: {
        'message': 'Cannot charge a customer that has no active card. Please enter your card details to make payment successful.'
    },
    slots: {
        'label': '',
        'index': -1,
        'name': '',
        'booked': false,
        'selected': false,
    }

};