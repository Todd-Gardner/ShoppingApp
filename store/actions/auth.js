// Action Identifiers
export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";

// TODO: Create a single Identifier so not repeating myself

// Action Creator Functions
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
    dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId });
  };
};

export const login = (email, password) => {
  const API_KEY = " AIzaSyB4YDIwcDDpj6MQbeOWgGEnOf73595p9h4 ";
  // Create new user on firebase (redux thunk)
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
    dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId });
  };
};
