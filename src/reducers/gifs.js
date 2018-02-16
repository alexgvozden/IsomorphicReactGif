import { GIFS_LOADED, GIF_LOADED, GIF_DELETED, GIF_ADDED } from "../constants/";

const initialState = {
  list: false,
  loadMore: true,
  lastId: -1,
  current: false
};

export default function gifs(state = initialState, action) {
  switch (action.type) {
    case GIFS_LOADED:
    case GIF_LOADED:
      return {
        ...state,
        ...action.payload
      };
      break;
    case GIF_DELETED:
      {
        try {
          let list = state.list.slice(0) || [];
          let index;

          list.forEach((el, i) => {
            let eq = el._id == action.payload.id;
            console.log("comapre", el._id, action.payload.id, eq);
            if (eq) index = i;
          });
          list.splice(index, 1);
          console.log("found index", list, action.payload.id, index);
          return {
            ...state,
            list: list
          };
        } catch (error) {
          return state;
        }
      }
      break;
    case GIF_ADDED:
      return {
        ...state,
        list: [action.payload].concat(state.list.slice(0) || [])
      };
      break;
    default:
      return state;
  }
}
