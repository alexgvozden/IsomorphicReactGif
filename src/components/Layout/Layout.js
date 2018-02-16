/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import withStyles from "isomorphic-style-loader/lib/withStyles";

import Header from "../Header";
import Footer from "../Footer";
import SideBanner from "../SideBanner/";

// import { checkAuth } from "../../actions/user";

// external-global styles must be imported in your JS.
import normalizeCss from "normalize.css";
import s from "./Layout.css";

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  componentDidMount() {
    // console.log("check auth", this.props.checkAuth);
    // this.props.checkAuth();
  }

  render() {
    console.log("LAYOUT ");
    return (
      <div>
        <Header />
        <div className={s.mainContent}>
          {this.props.children}
          {/* <SideBanner /> */}
        </div>
        {/* <Footer /> */}
      </div>
    );
  }
}

const mapDispatchToProps = {
  // checkAuth
};
const mapStateToProps = (state, ownProps) => {
  const loggedIn = state.user !== null && state.user.loggedIn;
  return {
    loggedIn: loggedIn
  };
};

export default withStyles(normalizeCss, s)(
  connect(mapStateToProps, mapDispatchToProps)(Layout)
);
