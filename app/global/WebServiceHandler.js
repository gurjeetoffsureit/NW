import NetInfo from '@react-native-community/netinfo';

export default class WebServiceHandler {

  // HTTP Header Generator.
  static header(headerParam) {
    console.log('Header Parameter:' + JSON.stringify(headerParam));
    var headers = new Headers();
    headers.append('Accept', 'application/json');
    Object.keys(headerParam).forEach(function (key) {
      headers.append(key, headerParam[key]);
    });
    return headers;
  }

  // HTTP request parameter Generator.
  static parameter(parameter) {
    console.log('Parameters :' + JSON.stringify(parameter));
    if (!parameter) {
      return "";
    }
    console.log('Parameters :' + JSON.stringify(parameter));
    var urlParameter = '?'
    Object.keys(parameter).forEach(function (key) {
      let value = parameter[key];
      //console.log('key:-' +key +'  value:-'+value);
      urlParameter = urlParameter + key + '=' + value + '&';
    });
    urlParameter = urlParameter.replace(/\&$/, '');
    //console.log('urlParameter: '+ urlParameter);
    return urlParameter;
  }

  // HTTP Get Request
  static get(url, headerParam, parameter) {
    console.log('WebServiceHandler:Initiating GET request');

    return new Promise(function (success, failed) {
      NetInfo.isConnected.fetch().done((isConnected) => {
        console.log('WebServiceHandler: Network Connectivity status: ' + isConnected);
        if (!isConnected) {
          failed({ name: '503', message: "No Internet connection" });
        } else {
          let URL = url + WebServiceHandler.parameter(parameter);
          console.log('URL:-' + URL);
          fetch(URL, {
            method: 'get',
            'headers': WebServiceHandler.header(headerParam)
          })
            .then(function (response) {
              console.log('Response ::: ', response);
              if (!response.ok) {
                if (response.status === 204) {
                  success({ code: response.status, message: "Booking successful." });
                } else if (response.status === 400) {
                  console.log('************************ ' + response.ok);
                  failed(response)
                } else {
                  failed(response)
                }
                return;
              }
              return response.json();

            })
            .then(function (jsonResponse) {
              console.log('************************ HTTP GET Succes ************************ ');
              success(jsonResponse);
            })
            .catch(function (err) {
              console.log('************************ HTTP GET Failed **************************');
              failed(err)
            });
        }
      });
    });
  }

  // HTTP POST Request
  static post(url, headerParam, parameter) {
    console.log('url is ',url);

    console.log('WebServiceHandler:Initiating POST request');
    console.log('WebServiceHandler:Initiating POST request ::: Json :::' + JSON.stringify(parameter));

    return new Promise(function (success, failed) {
      NetInfo.isConnected.fetch().done((isConnected) => {
        console.log('WebServiceHandler: Network Connectivity status: ' + isConnected);
        if (!isConnected) {
          console.log('************************ HTTP POST Failed **************************');
          failed({ name: '503', message: "No Internet connection" });
        } else {

          console.log('URL:-' + url);
          fetch(url, {
            method: 'post',
            'headers': WebServiceHandler.header(headerParam),
            body: JSON.stringify(parameter)
          })
            .then(function (response) {
              console.log('Response ::: ', response);
              if (!response.ok) {
                failed(response)
                return;
              }
              if (response.status === 204) {
                success({ code: response.status, message: "Booking successful." });
              } else {
                return response.json();
              }
            })
            .then(function (jsonResponse) {
              console.log('************************ HTTP POST Succes ************************ ');
              success(jsonResponse);
            })
            .catch(function (err) {
              console.log('************************ HTTP POST Failed **************************');
              failed(err)
            });
        }
      });
    });
  }

  // HTTP PATCH Request
  static patch(url, headerParam, parameter) {
    console.log('WebServiceHandler:Initiating PATCH request');

    return new Promise(function (success, failed) {
      NetInfo.isConnected.fetch().done((isConnected) => {
        console.log('WebServiceHandler: Network Connectivity status: ' + isConnected);
        if (!isConnected) {
          console.log('************************ HTTP PATCH Failed **************************');
          failed({ name: '503', message: "No Internet connection" });
        } else {

          console.log('URL:-' + url);
          fetch(url, {
            method: 'patch',
            'headers': WebServiceHandler.header(headerParam),
            body: JSON.stringify(parameter)
          })
            .then(function (response) {
              if (!response.ok) {
                failed(JSON.parse(response._bodyText))
                return;
              }
              return response.json();

            })
            .then(function (jsonResponse) {
              console.log('************************ HTTP PATCH Succes ************************ ');
              success(jsonResponse);
            })
            .catch(function (err) {
              console.log('************************ HTTP PATCH Failed **************************');
              failed(err)
            });
        }
      });
    });
  }

  // HTTP DELETE Request
  static delete(url, headerParam, parameter) {
    console.log('WebServiceHandler:Initiating DELETE request');

    return new Promise(function (success, failed) {
      NetInfo.isConnected.fetch().done((isConnected) => {
        console.log('WebServiceHandler: Network Connectivity status: ' + isConnected);
        if (!isConnected) {
          console.log('************************ HTTP DELETE Failed **************************');
          failed({ name: '503', message: "No Internet connection" });
        } else {

          console.log('URL:-' + url);
          fetch(url, {
            method: 'delete',
            'headers': WebServiceHandler.header(headerParam),
            body: JSON.stringify(parameter)
          })
            .then(function (response) {
              if (!response.ok) {
                failed(JSON.parse(response._bodyText))
                return;
              }
              return response.json();

            })
            .then(function (jsonResponse) {
              console.log('************************ HTTP DELETE Succes ************************ ');
              success(jsonResponse);
            })
            .catch(function (err) {
              console.log('************************ HTTP DELETE Failed **************************');
              failed(err)
            });
        }
      });
    });
  }
}