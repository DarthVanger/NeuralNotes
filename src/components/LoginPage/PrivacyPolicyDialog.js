import React from 'react';
import TermsDialog from './TermsDialog';
import PrivacyPolicy from 'components/LoginPage/PrivacyPolicy';

const PrivacyPolicyDialog = props => (
  <TermsDialog {...props} title="Privacy Policy">
    <PrivacyPolicy />
  </TermsDialog>
);

export default PrivacyPolicyDialog;
