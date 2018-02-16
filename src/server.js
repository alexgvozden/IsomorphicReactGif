/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import expressJwt, { UnauthorizedError as Jwt401Error } from "express-jwt";
import expressGraphQL from "express-graphql";
import jwt from "jsonwebtoken";
import nodeFetch from "node-fetch";
import React from "react";
import ReactDOM from "react-dom/server";
import PrettyError from "pretty-error";
import App from "./components/App";
import Html from "./components/Html";
import { ErrorPageWithoutStyle } from "./routes/error/ErrorPage";
import errorPageStyle from "./routes/error/ErrorPage.css";
import createFetch from "./createFetch";
// import passport from "./passport";
import router from "./router";
import assets from "./assets.json"; // eslint-disable-line import/no-unresolved
import configureStore from "./store/configureStore";
import { setRuntimeVariable } from "./actions/runtime";
import config from "./config";

/**
 * APP 
 */
const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || "all";

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.resolve(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

const mongoose = require("mongoose");
const mongoDB = "mongodb://127.0.0.1/gifhub";
const db = mongoose.connect(
  mongoDB,
  {
    useMongoClient: true,
    user: "gifhub_dbuser",
    pass: "R9QTPvZevKbnVBbD",
    promiseLibrary: global.Promise
  },
  err => {
    // console.log("error connecting to mongoDB server");
    if (err) throw new Error("Database not connected");
  }
);

/**
 * SESSION SETUP
 */
let session = require("express-session");
let MongoStore = require("connect-mongo")(session);
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Origin", "http://gifhub.net");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
// let FileStore = require("session-file-store")(session);
app.use(cookieParser());
app.use(
  session({
    name: "gifhub-session-id",
    secret: "trumpet-rhino-director",
    saveUninitialized: false,
    resave: true,
    cookie: { maxAge: 60 * 60 * 1000 },
    // store: new FileStore({ path: "./tmp" })
    store: new MongoStore({ mongooseConnection: db })
  })
);

const User = require("./data/models/User");
const Gif = require("./data/models/Gif");

/**
 * UPLOAD INIT
 */
const multer = require("multer");
const moment = require("moment");
const sizeOf = require("image-size");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = "uploads/" + moment().format("YYYYMM");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    cb(null, moment().format("x") + "-" + file.originalname.replace(" ", "-"));
  }
});
let upload = multer({ storage: storage });

/**
 * UPLOAD
 */
app.post("/api/upload", upload.single("gif"), (req, res, next) => {
  if (req.file) {
    return res.send(
      JSON.stringify({
        success: true,
        path: req.file.path.replace("uploads/", "/uploads/")
      })
    );
  }

  return res.send({ error: true, errorMsg: "File not uploaded" });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Middleware for routes that require logged in user
 */
function requiresLogin(req, res, next) {
  // console.log("req.session", req.session);
  if (req.session && req.session.email) {
    return next();
  } else {
    res.send(
      JSON.stringify({
        error: true,
        errorMsg: "You must be logged in to add gif"
      })
    );
  }
}

app.post("/api/logout", (req, res) => {
  req.logout();
  res.send();
});

/**
 * Auth endpoint, called on first app load to determine if user is logged in
 */
// app.get("/api/auth", requiresLogin, (req, res) => {
//   // if user is logged in it will pass to this point
//   // if not logged in requiresLogin will reject and it will not send below
//   JSON.stringify({
//     success: true,
//     user: {
//       id: req.session.userId,
//       email: req.session.email
//     }
//   });
// });

/**
 * User authentication 
 */
app.post("/api/login", (req, res) => {
  try {
    User.authenticate(
      User,
      req.body.email,
      req.body.password,
      (err, result) => {
        // console.log("err", err);
        if (err)
          return res.send(
            JSON.stringify({ error: true, errorMsg: err.toString() })
          );

        // success

        if (result) {
          req.session.email = req.body.email;
          req.session.userId = result._id;

          // console.log("req.session", req.session);
          return res.send(
            JSON.stringify({
              success: true,
              user: {
                id: result._id,
                email: result.email
              }
            })
          );
        }
      }
    );
  } catch (error) {
    return res.send(
      JSON.stringify({ error: true, errorMsg: error.toString() })
    );
  }
});

// app.get("/api/init/8553801493", (req, res) => {
//   const newUser = new User({
//     email: "alex.gvozden@gmail.com",
//     password: "martinbrodgif1"
//   });
//   newUser.save((err, gif) => {
//     if (err)
//       return res.send(
//         JSON.stringify({ error: true, errorMsg: err.toString() })
//       );

//     const newUser2 = new User({
//       email: "misosubotic90@gmail.com",
//       password: "martinbrodgif1"
//     });
//     newUser2.save((err, gif) => {
//       if (err)
//         return res.send(
//           JSON.stringify({ error: true, errorMsg: err.toString() })
//         );
//       res.send(JSON.stringify({ success: true }));
//     });
//   });
// });

/**
 * Save gif
 */
app.put("/api/gif", requiresLogin, (req, res) => {
  // console.log("gif put", req, res);
  const newGif = new Gif({
    url: req.body.url,
    title: req.body.title
  });

  // if (req.body.url.indexOf("http://gifhub.net/upload") === 0) {
  //   const dimensions = sizeOf(req.body.url.replace("http://gifhub.net/"));
  //   newGif.width = dimensions.width;
  //   newGif.height = dimensions.height;
  // }

  newGif.save((err, gif) => {
    if (err)
      return res.send(
        JSON.stringify({ error: true, errorMsg: err.toString() })
      );
    res.send(JSON.stringify({ success: true, gif: gif._id }));
  });
});

/**
 * Get gifs endpoints
 */
app.get("/api/gifs", async (req, res) => {
  let gifList, lastId, countAfterLast;
  // get gifs
  try {
    let query = Gif.find({}).sort({ _id: -1 });
    if (req.query.startId) {
      query.where("_id").lt(req.query.startId);
    }
    //return res.send(query.toString());
    gifList = await query.limit(req.query.limit || 5).exec();

    // last id in list
    if (gifList.length > 0) {
      lastId = gifList[gifList.length - 1]._id;
    } else {
      return res.send(
        JSON.stringify({ loadMore: false, success: true, list: [], lastId: -1 })
      );
    }
    // count of gifs after last
    countAfterLast = await Gif.count({ _id: { $lt: lastId } }).limit(1);
  } catch (error) {
    return res.send(
      JSON.stringify({ error: true, errorMsg: error.toString() })
    );
  }

  res.setHeader("Content-Type", "application/json");
  res.send(
    JSON.stringify({
      success: true,
      lastId: lastId,
      loadMore: countAfterLast > 0,
      list: gifList
    })
  );
});

/**
 * GIF download
 */
app.get("/download", (req, res) => {
  if (req.query.path.indexOf("http") === 0) {
    return res.redirect(req.query.path);
  }
  const path = req.query.path.replace("..", "");
  if (path.indexOf("uploads/") === 0) {
    res.download(path);
  } else {
    res.send(JSON.stringify({ error: true, errorMsg: "invalid path" }));
  }
});

/**
 * Get single gif info, with prev and next reference
 */
app.get("/api/gif/:id", async (req, res) => {
  let result = {},
    gif,
    prevGif,
    nextGif;

  try {
    gif = await Gif.find({ _id: req.params.id }).limit(1).exec();
    result.curr = gif[0];
  } catch (error) {
    return res.send(
      JSON.stringify({ error: true, errorMsg: error.toString() })
    );
  }

  // fetch prev gif
  try {
    nextGif = await Gif.find({ _id: { $lt: req.params.id } })
      .select("_id")
      .sort({ _id: -1 })
      .limit(1);
    result.next = nextGif[0]._id;
  } catch (error) {
    //console.log(error);
  }

  // fetch next gif
  try {
    prevGif = await Gif.find({ _id: { $gt: req.params.id } })
      .select("_id")
      .sort({ _id: "ascending" })
      .limit(1);
    result.prev = prevGif[0]._id;
  } catch (error) {
    //console.log(error);
  }

  result.success = true;
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(result));
});

/**
 * DELETE a gif
 */
app.delete("/api/gif/:id", requiresLogin, async (req, res) => {
  let gif;
  try {
    gif = await Gif.find({ _id: req.params.id }).remove().exec();
  } catch (error) {
    return res.send(
      JSON.stringify({ error: true, errorMsg: error.toString() })
    );
  }

  return res.send(JSON.stringify({ success: true }));
});

//
// Authentication
// -----------------------------------------------------------------------------
// app.use(
//   expressJwt({
//     secret: config.auth.jwt.secret,
//     credentialsRequired: false,
//     getToken: req => req.cookies.id_token
//   })
// );

// Error handler for express-jwt
// app.use((err, req, res, next) => {
//   // eslint-disable-line no-unused-vars
//   if (err instanceof Jwt401Error) {
//     console.error("[express-jwt-error]", req.cookies.id_token);
//     // `clearCookie`, otherwise user can't use web-app until cookie expires
//     res.clearCookie("id_token");
//   }
//   next(err);
// });

// app.use(passport.initialize());

if (__DEV__) {
  app.enable("trust proxy");
}
// app.get(
//   "/login/facebook",
//   passport.authenticate("facebook", {
//     scope: ["email", "user_location"],
//     session: false
//   })
// );
// app.get(
//   "/login/facebook/return",
//   passport.authenticate("facebook", {
//     failureRedirect: "/login",
//     session: false
//   }),
//   (req, res) => {
//     const expiresIn = 60 * 60 * 24 * 180; // 180 days
//     const token = jwt.sign(req.user, config.auth.jwt.secret, { expiresIn });
//     res.cookie("id_token", token, { maxAge: 1000 * expiresIn, httpOnly: true });
//     res.redirect("/");
//   }
// );

//
// Register API middleware
// -----------------------------------------------------------------------------
// app.use(
//   "/graphql",
//   expressGraphQL(req => ({
//     schema,
//     graphiql: __DEV__,
//     rootValue: { request: req },
//     pretty: __DEV__
//   }))
// );

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get("*", async (req, res, next) => {
  try {
    const css = new Set();

    // Universal HTTP client
    const fetch = createFetch(nodeFetch, {
      baseUrl: config.api.serverUrl,
      cookie: req.headers.cookie
    });

    const initialState = {
      user: req.user || null
    };

    const store = configureStore(initialState, {
      fetch
      // I should not use `history` on server.. but how I do redirection? follow universal-router
    });

    store.dispatch(
      setRuntimeVariable({
        name: "initialNow",
        value: Date.now()
      })
    );

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
      fetch,
      // You can access redux through react-redux connect
      store,
      storeSubscription: null
    };

    const route = await router.resolve({
      ...context,
      path: req.path,
      query: req.query,
      serverUrl: config.serverUrl
    });

    // console.log("route5 ", route);

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };
    data.children = ReactDOM.renderToString(
      <App context={context} store={store}>
        {route.component}
      </App>
    );
    data.styles = [{ id: "css", cssText: [...css].join("") }];
    data.scripts = [assets.vendor.js];
    if (route.chunks) {
      data.scripts.push(...route.chunks.map(chunk => assets[chunk].js));
    }
    data.scripts.push(assets.client.js);
    data.app = {
      apiUrl: config.api.clientUrl,
      state: context.store.getState()
    };

    const html = ReactDOM.renderToStaticMarkup(
      <Html {...data} dev={__DEV__} />
    );
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage("express");

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: "css", cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// ----------------------------------------------------------------------------
if (!module.hot) {
  app.listen(config.port, () => {
    console.info(`The server is running at http://localhost:${config.port}/`);
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept("./router");
}

export default app;
