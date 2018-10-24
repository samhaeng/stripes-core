import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field, Form, formValueSelector } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { TextField, Button, Row, Col } from '@folio/stripes/components';
import _ from 'lodash';
import styles from './CreateResetPassword.css';
import FieldLabel from './components/FieldLabel';
import OrganizationLogo from '../OrganizationLogo';
import AuthErrorsContainer from '../AuthErrorsContainer/AuthErrorsContainer';

class CreateResetPassword extends Component {
  static propTypes = {
    stripes: PropTypes.shape({
      intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired,
      }),
    }).isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    errors: PropTypes.arrayOf(PropTypes.object),
    formValues: PropTypes.object,
    submitSucceeded: PropTypes.bool,
  };

  static defaultProps = {
    errors: []
  };

  constructor(props) {
    super(props);

    this.newPassword = React.createRef();
    this.state = {
      passwordMasked: true,
    };
    this.validators = {
      confirmPassword: this.confirmPasswordValidation,
    };
  }

  componentDidMount() {
    // Focus new-password input on mount
    this.newPassword.current.getRenderedComponent().input.current.focus();
  }

  togglePasswordMask = () => {
    this.setState(({ passwordMasked }) => ({
      passwordMasked: !passwordMasked,
    }));
  };

  confirmPasswordValidation = (value, { newPassword, confirmPassword }) => {
    const isConfirmPasswordInvalid = newPassword && confirmPassword && newPassword !== confirmPassword;
    const { errors } = this.props;

    if (isConfirmPasswordInvalid) {
      if (!_.some(errors, this.passwordMatchError)) {
        errors.push(this.passwordMatchError);
      }
    } else {
      _.remove(errors, this.passwordMatchError);
    }
  };

  render() {
    const {
      errors,
      handleSubmit,
      submitting,
      onSubmit,
      submitSucceeded,
      formValues: { newPassword, confirmPassword },
      stripes: { intl: { formatMessage: translate } },
    } = this.props;
    const { passwordMasked } = this.state;

    const translateNamespace = 'stripes-core.createResetPassword';
    const submissionStatus = submitting || submitSucceeded;
    const buttonDisabled = !_.isEmpty(errors) || submissionStatus || !(newPassword && confirmPassword);
    const buttonLabel = translate({ id: `stripes-core.${submissionStatus ? 'settingPassword' : 'setPassword'}` });
    const passwordType = passwordMasked ? 'password' : 'text';
    const passwordToggleLabelId = `stripes-core.button.${passwordMasked ? 'show' : 'hide'}Password`;
    this.passwordMatchError = {
      code: 'password.match.error',
      type: 'error'
    };

    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <Row center="xs">
            <Col xs={6}>
              <OrganizationLogo />
            </Col>
          </Row>
          <Row center="xs">
            <Col xs={6}>
              <h1 className={styles.header}>
                {translate({ id: `${translateNamespace}.header` })}
              </h1>
            </Col>
          </Row>
          <Row>
            <Form
              className={styles.form}
              onSubmit={handleSubmit(onSubmit)}
            >
              <div data-test-new-password-field>
                <Row center="xs">
                  <Col xs={6}>
                    <FieldLabel
                      htmlFor="new-password"
                      text={translate({ id: `${translateNamespace}.newPassword` })}
                    />
                  </Col>
                </Row>
                <Row center="xs">
                  <Col xs={6}>
                    <Field
                      id="new-password"
                      component={TextField}
                      name="newPassword"
                      type={passwordType}
                      marginBottom0
                      fullWidth
                      inputClass={styles.input}
                      validationEnabled={false}
                      hasClearIcon={false}
                      autoComplete="new-password"
                      ref={this.newPassword}
                      withRef
                    />
                  </Col>
                </Row>
              </div>
              <div data-test-confirm-password-field>
                <Row center="xs">
                  <Col xs={6}>
                    <FieldLabel
                      htmlFor="confirm-password"
                      text={translate({ id: `${translateNamespace}.confirmPassword` })}
                    />
                  </Col>
                </Row>
                <Row end="sm" center="xs" bottom="xs">
                  <Col xs={6}>
                    <div className={styles.formGroup}>
                      <Field
                        id="confirm-password"
                        component={TextField}
                        name="confirmPassword"
                        type={passwordType}
                        marginBottom0
                        fullWidth
                        inputClass={styles.input}
                        validationEnabled={false}
                        hasClearIcon={false}
                        autoComplete="confirm-password"
                        validate={this.validators.confirmPassword}
                      />
                    </div>
                  </Col>
                  <Col sm={3} xs={12}>
                    <div
                      data-test-change-password-toggle-mask-btn
                      className={styles.toggleButtonWrapper}
                    >
                      <Button
                        type="button"
                        buttonStyle="link"
                        onClick={this.togglePasswordMask}
                      >
                        <FormattedMessage id={passwordToggleLabelId} />
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>
              <Row center="xs">
                <Col xs={6}>
                  <div className={styles.formGroup}>
                    <Button
                      buttonStyle="primary"
                      id="clickable-login"
                      type="submit"
                      buttonClass={styles.submitButton}
                      disabled={buttonDisabled}
                      fullWidth
                      marginBottom0
                    >
                      {buttonLabel}
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row center="xs">
                <Col xs={6}>
                  <div className={styles.AuthErrorsWrapper}>
                    { !_.isEmpty(errors) && <AuthErrorsContainer errors={errors} /> }
                  </div>
                </Col>
              </Row>
            </Form>
          </Row>
        </div>
      </div>
    );
  }
}

const CreateResetPasswordForm = reduxForm({ form: 'CreateResetPassword' })(CreateResetPassword);
const selector = formValueSelector('CreateResetPassword');

export default connect(state => ({ formValues: selector(state, 'newPassword', 'confirmPassword') }))(CreateResetPasswordForm);
