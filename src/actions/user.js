/* eslint-disable import/prefer-default-export */

import history from "../history";
import { USER_LOGIN, USER_LOGOUT } from "../constants/";

// export function checkAuth() {
//   return async (dispatch, getState) => {
//     console.log("CHECK AUTH 1");
//     let res;
//     try {
//       const resp = await fetch("/api/auth", {
//         method: "GET",
//         credentials: "same-origin"
//       });
//       res = await resp.json();
//       console.log("res ", res);
//     } catch (error) {
//       console.error(error);
//     }

//     console.log("AUTH CHECK RES", res);
//     if (res.error) {
//     } else if (res.success && res.user) {
//       console.log("AUTH CHECK SUCCESS");
//       dispatch({
//         type: USER_LOGIN,
//         payload: {
//           ...res.user,
//           loggedIn: true
//         }
//       });
//     }
//   };
// }

export function onLogin(email, password) {
  return async (dispatch, getState) => {
    const resp = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password
      }),
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" }
    });

    const res = await resp.json();
    console.log("RETURNED ", res);
    if (res.error) {
      alert("Wrong login");
    } else if (res.success && res.user) {
      console.log("DISPATCH ON LOGIN", res);
      dispatch({
        type: USER_LOGIN,
        payload: {
          ...res.user,
          loggedIn: true
        }
      });

      history.push("/admin");
    }
  };
}
export function onLogout() {
  return async (dispatch, getState) => {
    const resp = await fetch("/api/logout", {
      method: "POST",
      credentials: "same-origin"
    });

    const res = await resp;

    dispatch({
      type: USER_LOGOUT
    });

    history.push("/");
  };
}
