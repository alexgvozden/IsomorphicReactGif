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
import s from "./SharingButtons.css";
import Link from "../Link";

class SharingButtons extends React.Component {
  constructor(props) {
    super(props);
    this.trackEvent = this.trackEvent.bind(this);
    this.trackEventFb = this.trackEventFb.bind(this);
    this.trackEventTw = this.trackEventTw.bind(this);
    this.trackEventPn = this.trackEventPn.bind(this);
  }

  trackEventFb(e) {
    this.trackEvent("fb");
  }
  trackEventTw(e) {
    this.trackEvent("tw");
  }
  trackEventPn(e) {
    this.trackEvent("pn");
  }
  trackEvent(type) {
    if (window.ga && !window.__DEV__)
      window.ga("send", {
        hitType: "event",
        eventCategory: "Sharing",
        eventAction: "share_" + type,
        eventLabel: "Share " + type
      });
  }

  render() {
    return (
      <div className={s.effect}>
        {this.props.displayTitle &&
          <div className={s.message}>Share with friends</div>}
        <div className={s.buttons}>
          <a
            href={
              "https://www.facebook.com/sharer/sharer.php?u=" +
              (this.props.url || document.location.href)
            }
            onClick={this.trackEventFb}
            className={s.fb}
            target="_blank"
            title="Share on Facebook"
          >
            <i className="fa fa-facebook" aria-hidden="true" />
          </a>
          <a
            href={
              "https://twitter.com/home?status=" +
              encodeURI(this.props.title + " " + this.props.url)
            }
            onClick={this.trackEventTw}
            target="_blank"
            className={s.tw}
            title="Share on Twitter"
          >
            <i className="fa fa-twitter" aria-hidden="true" />
          </a>
          <a
            onClick={this.trackEventPn}
            href={
              "https://pinterest.com/pin/create/button/?url=" +
              encodeURI(this.props.url) +
              "&media=" +
              encodeURI(
                this.props.image.indexOf("/") === 0
                  ? "http://gifhub.net" + this.props.image
                  : this.props.image
              ) +
              "&description=" +
              encodeURI(this.props.title)
            }
            className={s.pinterest}
            title="Share on Pinterest"
          >
            <i className="fa fa-pinterest-p" aria-hidden="true" />
          </a>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(SharingButtons);
