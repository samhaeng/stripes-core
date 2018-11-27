import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect as reduxConnect } from 'react-redux';

import CreateResetPassword from './CreateResetPassword';
import processBadResponse from '../../processBadResponse';

import { stripesShape } from '../../Stripes';

class CreateResetPasswordControl extends Component {
  // Todo: don't have back end yet, should be changed
  static manifest = Object.freeze({
    changePassword: {
      type: 'okapi',
      path: 'bl-users/login',
      fetch: false,
      throwErrors: false,
    },
  });

  static propTypes = {
    authFailure: PropTypes.arrayOf(PropTypes.object),
    mutator: PropTypes.shape({
      changePassword: PropTypes.shape({
        POST: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        token: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    stripes: stripesShape.isRequired,
  };

  static defaultProps = {
    authFailure: [],
  };

  handleSuccessfulResponse = () => {
    // Todo: don't have back-end yet, should be implemented
  };

  // Todo: don't have back-end yet, should be changed
  handleSubmit = values => {
    const {
      mutator: { changePassword },
      stripes: { store },
    } = this.props;
    const { newPassword } = values;

    return changePassword
      .POST({ password: newPassword })
      .then(() => { this.handleSuccessfulResponse(); })
      .catch((response) => { processBadResponse(store, response); });
  };

  render() {
    const {
      authFailure,
      match: {
        params: {
          token,
        }
      }
    } = this.props;

    return (
      <CreateResetPassword
        token={token}
        errors={authFailure}
        stripes={this.props.stripes}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

const mapStateToProps = (state) => ({ authFailure: state.okapi.authFailure });

export default reduxConnect(mapStateToProps)(CreateResetPasswordControl);