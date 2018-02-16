/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import Layout from "../../components/Layout";
import _Admin from "./Admin";

import { connect } from "react-redux";
import { onSaveGif } from "../../actions/gif";

const mapDispatchToProps = { onSaveGif };
const mapStateToProps = state => state;
const Admin = connect(mapStateToProps, mapDispatchToProps)(_Admin);

const title = "Admin - Upload GIF";

function action() {
  return {
    chunks: ["admin"],
    title,
    component: (
      <Layout>
        <Admin title={title} />
      </Layout>
    )
  };
}

export default action;
