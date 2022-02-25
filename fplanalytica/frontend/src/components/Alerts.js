import React, { Fragment, useEffect } from "react";
import { useAlert } from "react-alert";
import { connect } from "react-redux";
import { resetShow } from "../actions/errors";

const Alerts = ({ msg, show, resetShow }) => {
  const alert = useAlert();

  useEffect(() => {
    if (msg !== null && show) {
      alert.error(msg);
      resetShow();
    }
  }, [msg, show]);
  return <Fragment></Fragment>;
};

const mapStateToProps = (state) => ({
  msg: state.errors.msg,
  show: state.errors.show,
});

export default connect(mapStateToProps, { resetShow })(Alerts);
