import React from 'react';
import { StyledNotFound } from 'components/NotFound/NotFoundStyles';

export function NotFound() {
  return (
    <StyledNotFound>
      <div className="not-found">
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <h3>We didn't find any matches</h3>
        <span>Please check your input data</span>
      </div>
    </StyledNotFound>
  );
}
