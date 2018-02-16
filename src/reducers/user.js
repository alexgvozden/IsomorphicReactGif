const USER_LOGIN = "USER_LOGIN";
const USER_LOGOUT = "USER_LOGOUT";

const initialState = {
  loggedIn: false
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN:
      return {
        ...state,
        ...action.payload
      };
      break;
    case USER_LOGOUT:
      return initialState;
      break;
    default:
      return state;
  }
}
