import React, { PureComponent } from "react";
import Link from "../Link/";
import Button from "../Button/";
import SharingButtons from "../SharingButtons/";
import history from "../../history";
import Img from "react-image";
import { BarLoader } from "react-spinners";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import normalizeCss from "normalize.css";
import s from "./GifSingle.css";
import BannerAdsterra from "../Banner/Adsterra";
import FacebookProvider, { Comments } from "react-facebook";
import { CopyToClipboard } from "react-copy-to-clipboard";

class GifSingle extends PureComponent {
  constructor(props) {
    super(props);
    this.onDelete = this.onDelete.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log("nextProps");
    if (nextProps.item.id !== this.props.item.id) {
      this.props.getGif(nextProps.item.id);
    }
  }

  trackEvent(type) {
    if (window.ga && !window.__DEV__)
      window.ga("send", {
        hitType: "event",
        eventCategory: "GifSingle",
        eventAction: type,
        eventLabel: type
      });
  }

  onDelete(e) {
    console.log("on delete gif");
    e.preventDefault();

    this.props.onDeleteGif(
      this.props.item._id,
      this.props.item.next,
      this.props.item.prev,
      true
    );
  }

  getSharingNextPrev(style = {}, type = "top", displayTitle = false) {
    return (
      <div className={s.container} key={type} style={style}>
        {this.props.item.prev
          ? <Button
              onClick={e => {
                this.trackEvent("prev");
              }}
              to={`/gif/${this.props.item.prev}`}
            >
              &#x21e0; <span className={s.title}>Prev</span>
            </Button>
          : <div className={s.emptyButton} />}
        <SharingButtons
          displayTitle={displayTitle}
          url={"http://gifhub.net/gif/" + this.props.item._id}
          title={this.props.item.title + " #GifHub"}
          image={this.props.item.url}
        />
        {this.props.item.next
          ? <Button
              onClick={e => {
                this.trackEvent("next");
              }}
              to={`/gif/${this.props.item.next}`}
            >
              <span className={s.title}>Next</span> &#x21e2;
            </Button>
          : <div className={s.emptyButton} />}
      </div>
    );
  }

  render() {
    if (!this.props.item) return null;

    // console.log("add gif", this.props);
    return (
      <div key={this.props.item._id} className={s.main}>
        {this.getSharingNextPrev()}
        <h3 style={{ marginTop: 30, marginBottom: 10 }}>
          {this.props.item.title}
        </h3>
        <div>
          <Img
            className={s.image}
            src={this.props.item.url}
            loader={
              <BarLoader
                color={"#444444"}
                height={250}
                width={"100%"}
                style={{ marginBottom: 20 }}
              />
            }
          />
        </div>

        <Button
          style={{ width: 120, fontSize: 12, margin: "40px auto" }}
          target="_blank"
          onClick={e => {
            this.trackEvent("download");
          }}
          to={`/download?path=${this.props.item.url.indexOf("/") === 0
            ? encodeURI(this.props.item.url.substr(1))
            : this.props.item.url}`}
        >
          <i className="fa fa-download" aria-hidden="true" /> DOWNLOAD
        </Button>
        <div className={s.linkCopy}>
          <CopyToClipboard
            text={"http://gifhub.com/gif/" + this.props.item._id}
            onCopy={() => {
              alert("Copied to clipboard");
            }}
          >
            <div>
              Click to copy
              <input
                type="text"
                onFocus={event => {
                  event.target.select();
                }}
                className={s.linkInput}
                value={"http://gifhub.com/gif/" + this.props.item._id}
              />
            </div>
          </CopyToClipboard>
        </div>
        {this.getSharingNextPrev({ marginTop: 40 }, "bottom", true)}
        <div style={{ marginTop: 40 }}>
          <FacebookProvider appId="134531060560497">
            <Comments
              href={"http://gifhub.com/gif/" + this.props.item._id}
              colorScheme="dark"
            />
          </FacebookProvider>
        </div>

        {this.props.loggedIn &&
          <div>
            <br />
            <br />
            <Link to="/admin">Add new GIF</Link>
            {"  "} | {" "}
            <Link to="#" onClick={this.onDelete}>
              Delete this GIF
            </Link>
          </div>}
      </div>
    );
  }
}

export default withStyles(normalizeCss, s)(GifSingle);
