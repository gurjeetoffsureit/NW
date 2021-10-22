// const urlLive = `https://neighborhoodwatche.com/api/`;
const urlLive = `http://103.212.235.82:4003/`;


const baseUrl = urlLive;
// const baseUrl = urlLive;

// Auth
export const authLogin = `${baseUrl}users`;
export const authLoginFacebook = `${authLogin}/facebook`;

// Orders
export const Orders = `${baseUrl}driver/orders`;
export const OrdersByDate = `${Orders}?date=`;
export const OrdersByStatus = `${Orders}?status=`;
export const OrderStatus = `${Orders}/status/`;
export const ResetPassword = `${baseUrl}auth/forgot-password`;
export const Notification = `${baseUrl}dashboard/notifications`;
export const UpdatePassword = `${baseUrl}profile/security/change-password`;

export const Facebook = `https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=`;

// Actions
export function fetchLink(path, method, auth, data) {
    return fetch(path, {
        method,
        credentials: "include",
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': `QWR2ZW50cnVzX2NyZWF0ZWRCeV9LcmlzaGFuQG9mZnN1cmVpdC5jb20=`,
            'x-token': auth
        },
        body: data && JSON.stringify(data)
    });
}

export function facebookProfile(path) {
    return fetch(path);
}