import { AsyncStorage } from "react-native";

/* 
Watch this thread for fix / work around for the setTimeout()
Setting a timer for a long period of time, i.e. multiple minutes,
is a performance and correctness issue on Android as it keeps the timer module awake,
and timers can only be called when the app is in the foreground.
See https://github.com/facebook/react-native/issues/12981
*/

// Action Identifiers
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
/* export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN"; */

let timer;

// Action Creator Functions
export const authenticate = (userId, token, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({ type: AUTHENTICATE, userId: userId, token: token });
    }
    //return { type: AUTHENTICATE, userId: userId, token: token };
};

export const signup = (email, password) => {
  const API_KEY = " AIzaSyB4YDIwcDDpj6MQbeOWgGEnOf73595p9h4 ";
  // Create new user on firebase (redux thunk)
  return async (dispatch) => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true, //should always be true
        }),
      }
    );

    // Check for 400/500 error response
    if (!response.ok) {
      const errorResData = await response.json();
      const errorMessage = errorResData.error.message;
      let message = "Error creating user!";
      if (errorMessage === "EMAIL_EXISTS") {
        message = "The email address is already in use by another account.";
      }
      throw new Error(message);
    }

    const resData = await response.json(); //convert to JS object/array
    console.log("resData: ", resData);
    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      ) //to ms
    );
    /* Before adding authenticate
    dispatch({
      type: SIGNUP,
      token: resData.idToken,
      userId: resData.localId,
    }); */

    // Get Token Expiry
    //Convert expiresIn from String to Int, convert to ms *1000 (Date/time is in ms),
    //then wrap in new Date object to get a Date timestamp
    const tokenExpiry = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveToStorage(resData.idToken, resData.localId, tokenExpiry);
  };
};

export const login = (email, password) => {
  const API_KEY = " AIzaSyB4YDIwcDDpj6MQbeOWgGEnOf73595p9h4 ";
  return async (dispatch) => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true, //should always be true
        }),
      }
    );

    // Check for 400/500 error response
    if (!response.ok) {
      const errorResData = await response.json();
      const errorMessage = errorResData.error.message;
      let message = "Error logging in!";
      if (errorMessage === "EMAIL_NOT_FOUND") {
        message = "Please check your Email address or password and try again.";
      } else if (errorMessage === "INVALID_PASSWORD") {
        message = "Please check your email address or Password and try again.";
      }
      throw new Error(message);
    }

    const resData = await response.json(); //convert to JS object/array
    console.log("resData: ", resData);
    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );
    /* Before adding authenticate()
      dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId }); */

    // Get Token Expiry
    //Convert expiresIn from String to Int, convert to ms *1000 (Date/time is in ms),
    //then wrap in new Date object to get a Date timestamp
    const tokenExpiry = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveToStorage(resData.idToken, resData.localId, tokenExpiry);
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

// Clear timer so doesn't keep running in background
const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

// Automatically log the User out
const setLogoutTimer = (expiryTime) => {
  //dispatch (redux-thunk) inner function
  return (dispatch) => {
    //runs after the 'expiryTime'
    timer = setTimeout(() => {
      dispatch(logout());
    }, expiryTime); // / 1000 to test (3.6s)
  };
};

// Save User data to phone storage (String)
const saveToStorage = (token, userId, tokenExpiry) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      tokenExpiry: tokenExpiry.toISOString(),
    })
  );
};
