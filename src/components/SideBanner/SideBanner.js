import React, { PureComponent } from "react";
import Banner from "../../assets/sidebanner.jpeg";

class SideBanner extends PureComponent {
  render() {
    return (
      <div
        style={{
          display: "block",
          width: 120,
          height: 600,
          backgroundColor: "#444"
        }}
      />
    );
  }
}

export default SideBanner;
