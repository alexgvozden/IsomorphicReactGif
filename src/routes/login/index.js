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
import _Login from "./Login";

import { connect } from "react-redux";
import { onLogin } from "../../actions/user";

let isAdmin = false;

const mapDispatchToProps = { onLogin };
const mapStateToProps = state => state;
const Login = connect(mapStateToProps, mapDispatchToProps)(_Login);

const title = "Log In";

function action() {
  if (isAdmin) return { redirect: "/admin" };
  return {
    chunks: ["home"],
    title,
    component: (
      <Layout>
        <Login title={title} />
      </Layout>
    )
  };
}

export default action;
