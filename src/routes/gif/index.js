/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import Gif from "./Gif";
import Layout from "../../components/Layout";

async function action({ fetch, params }) {
  let res;
  try {
    const resp = await fetch(`/api/gif/${params.id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    res = await resp.json();
  } catch (error) {
    console.error("Error loading gif from server", error.toString());
  }
  // console.log("RES", res);
  return {
    chunks: ["home"],
    title: res.curr.title,
    image:
      (res.curr.url.indexOf("http") != 0 ? "http://gifhub.net" : "") +
      res.curr.url,
    component: (
      <Layout>
        <Gif
          {...params}
          item={Object.assign(res.curr, { next: res.next, prev: res.prev })}
        />
      </Layout>
    )
  };
}

export default action;
