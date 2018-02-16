/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./Header.css";
import Link from "../Link";
import BannerAdsterra from "../Banner/Adsterra";
import BannerPopunder from "../Banner/Popunder";
import Navigation from "../Navigation";
import logoUrl from "./logo-small.png";
import logoUrl2x from "./logo-small@2x.png";
import Overlay from "../Overlay/";

class Header extends React.Component {
  render() {
    console.log("header props ", this.props);
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Overlay />
          {/* <Navigation /> */}
          <div
            className={s.brandRow}
            style={
              this.props.loggedIn ? { justifyContent: "space-between" } : {}
            }
          >
            <Link className={s.brand} to="/">
              <img src={require("../../assets/logo.png")} />
            </Link>
            {this.props.loggedIn &&
              <div>
                <Link to="/admin">Add gif</Link>
                {/* {" | "}
                <a
                  href=""
                  onClick={e => {
                    e.preventDefault();
                    this.props.onLogout();
                  }}
                >
                  Log out
                </a> */}
              </div>}
          </div>

          {/* <BannerPopunder />
          <BannerAdsterra /> */}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Header);
