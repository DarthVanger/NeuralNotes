import React from 'react';
import TermsDialog from './TermsDialog';
import TermsOfService from 'components/LoginPage/TermsOfService';

const TermsOfServiceDialog = props => (
  <TermsDialog {...props} title="Terms of Service">
    <TermsOfService />
  </TermsDialog>
);

export default TermsOfServiceDialog;
