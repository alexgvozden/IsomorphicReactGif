/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./Banner.css";
import Link from "../Link";

class Banner extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    style: PropTypes.object,
    target: PropTypes.string
  };

  static defaultProps = {
    target: "_self",
    style: {},
    type: "header"
  };

  constructor(props) {
    super(props);
    this.banner = false;
    this.addBanner = this.addBanner.bind(this);
  }

  componentDidMount() {
    console.log("did mounth ", this.banner);
    this.addBanner();
  }

  addBanner() {
    // if (window.__DEV__) return false;
    console.log("add banner ", this.banner);
    if (!this.banner) {
      setTimeout(() => {
        this.addBanner();
      }, 100);
      return;
    }
    const s = document.createElement("script");

    let w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName("body")[0],
      windowWidth = w.innerWidth || e.clientWidth || g.clientWidth;
    //y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    // window.atOptions = this.props.type.localeCompare("300x250")
    //   ? {
    //       key: "466b67ac973b849c69d161615654b108",
    //       format: "iframe",
    //       height: 250,
    //       width: 300,
    //       params: {}
    //     }
    //   :
    window.atOptions =
      windowWidth > 720
        ? {
            key: "1fd42f7a1684804906b67e04cc2eecc9",
            format: "iframe",
            height: 90,
            width: 728,
            params: {}
          }
        : {
            key: "95389d0a442e67680f4e763561ea517c",
            format: "iframe",
            height: 250,
            width: 300,
            params: {}
          };
    s.type = "text/javascript";
    s.async = true;
    s.src =
      "http" +
      (location.protocol === "https:" ? "s" : "") +
      "://www.bnserving.com/" +
      (windowWidth > 720
        ? "1fd42f7a1684804906b67e04cc2eecc9"
        : "95389d0a442e67680f4e763561ea517c") +
      "/invoke.js";

    this.banner.appendChild(s);
  }

  render() {
    return (
      <div
        style={this.props.style}
        className={s.banner}
        ref={ref => (this.banner = ref)}
      />
    );
  }
}

export default withStyles(s)(Banner);
