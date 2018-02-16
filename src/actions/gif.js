import history from "../history";
import {
  GIFS_LOADED,
  GIF_DELETED,
  GIF_ADDED,
  GIF_LOADED,
  SITE_URL
} from "../constants/";
import { updateCustomMeta } from "../DOMUtils";

export function onFileUpload(files) {
  let data = new FormData();
  data.append("gif", files[0]);

  return new Promise(async (resolve, reject) => {
    let resp, res;
    try {
      resp = await fetch("/api/upload", {
        method: "POST",
        body: data,
        credentials: "same-origin"
      });
      res = await resp.json();
    } catch (error) {
      return reject(error);
    }
    if (res.success && res.path) {
      resolve(res.path);
    } else {
      reject();
    }
  });
}

export function onSaveGif(title, url) {
  return async (dispatch, getState) => {
    let res;

    try {
      const resp = await fetch("/api/gif", {
        method: "PUT",
        body: JSON.stringify({
          title: title,
          url: url
        }),
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" }
      });

      res = await resp.json();
    } catch (error) {
      console.error("Error saving gif", error.toString());
    }

    if (res.error) {
      console.error("Error saving gif");
      if (res.errorMsg.indexOf("logged") > -1) {
        history.push("/login");
      }
    } else if (res.success && res.gif) {
      dispatch({
        type: GIF_ADDED,
        payload: { _id: res.gif, title: title, url: url }
      });
      history.push("/gif/" + res.gif);
    }
  };
}

export function getGif(gifId, setMetaTags = true) {
  console.log("GET GIF ", gifId);
  return async (dispatch, getState) => {
    let res;
    try {
      const resp = await fetch(`/api/gif/${gifId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      res = await resp.json();
    } catch (error) {
      console.error("Error loading gif from server", error.toString());
    }

    console.log("RES LOADED ", res);
    if (res.error) {
      console.error("Error loading gif from server");
    } else if (res.success) {
      console.log("Action gif loaded");
      if (setMetaTags) {
        updateCustomMeta("og:title", `${res.curr.title} | GifHub`);
        updateCustomMeta("twitter:title", `${res.curr.title} | GifHub`);
        updateCustomMeta(
          "og:image",
          (res.curr.url.indexOf("http") != 0 ? SITE_URL : "") + res.curr.url
        );
        updateCustomMeta(
          "twitter:image",
          (res.curr.url.indexOf("http") != 0 ? SITE_URL : "") + res.curr.url
        );
        updateCustomMeta("og:url", SITE_URL + "/gif/" + res.curr._id);
      }

      dispatch({
        type: GIF_LOADED,
        payload: {
          current: {
            ...res.curr,
            next: res.next,
            prev: res.prev
          }
        }
      });
    }
  };
}

export function getGifs() {
  return async (dispatch, getState) => {
    const gifs = getState().gifs;

    let url = "/api/gifs",
      res;

    if (gifs.list) {
      url += `?startId=${gifs.lastId}`;
    }

    try {
      const resp = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      res = await resp.json();
    } catch (error) {
      console.error("Error loading gifs from server", error.toString());
    }

    // console.log("RES LOADED ", res);
    if (res.error) {
      console.error("Error loading gifs from server");
    } else if (res.success) {
      // console.log("Action gifs loaded");
      dispatch({
        type: GIFS_LOADED,
        payload: {
          list: gifs.list ? gifs.list.concat(res.list) : res.list,
          lastId: res.lastId,
          loadMore: res.loadMore
        }
      });
    }
  };
}

export function onDeleteGif(gifId, nextId, prevId, redirect = false) {
  return async (dispatch, getState) => {
    let res;

    if (!confirm("Confirm delete!")) return false;

    try {
      let url = "/api/gif/" + gifId;

      const resp = await fetch(url, {
        method: "DELETE",
        credentials: "same-origin"
      });
      res = await resp.json();
    } catch (error) {
      console.error("Error deleting gif from server", error.toString());
      alert(error.toString());
    }
    if (res.success) {
      if (redirect) history.push("/gif/" + nextId || prevId);
      dispatch({ type: GIF_DELETED, payload: { id: gifId } });
    } else if (res.error) {
      alert(res.errorMsg);
    }
  };
}
