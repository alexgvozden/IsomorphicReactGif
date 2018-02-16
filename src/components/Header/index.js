import { connect } from "react-redux";

import Header from "./Header";
import { onLogout } from "../../actions/user";

const mapDispatchToProps = { onLogout };

const mapStateToProps = (state, ownProps) => {
  const loggedIn = state.user !== null && state.user.loggedIn;

  return {
    loggedIn: loggedIn
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
