import { AUTHENTICATE, LOGOUT } from "../actions/auth";

const initialState = {
  token: null,
  userId: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE: // was LOGIN: and SIGNUP
      return {
        userId: action.userId,
        token: action.token,
      };
    case LOGOUT:
      return initialState;
    // case SIGNUP:
    //   return {
    //     token: action.token,
    //     userId: action.userId,
    //   };
    default:
      return state;
  }
  //return state; either here or use as default in switch
};
