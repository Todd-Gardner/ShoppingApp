// Action Identifiers
export const SIGNUP = "SIGNUP";
export const LOGIN = 'LOGIN';

// TODO: Create a single function so not repeating myself

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
      throw new Error("Error creating user!");
    }

      const resData = await response.json(); //convery to JS object/array
      console.log('resData: ', resData);
    dispatch({ type: SIGNUP });
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
      throw new Error("Error logging in!");
    }

      const resData = await response.json(); //convery to JS object/array
      console.log('resData: ', resData);
    dispatch({ type: LOGIN });
  };
};
