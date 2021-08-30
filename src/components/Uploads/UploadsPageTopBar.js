import React from 'react';

import { BackButton } from 'components/BackButton/BackButton';
import { TopBar } from 'components/TopBar/TopBar';
import { TopBarLeftButtons } from 'components/TopBar/TopBarLeftButtons';
import { TopBarPageTitle } from 'components/TopBar/TopBarPageTitle';

const UploadsPageTopBar = () => {
  return (
    <TopBar>
      <TopBarLeftButtons>
        <BackButton to={'notes'} />
      </TopBarLeftButtons>
      <TopBarPageTitle>Uploads</TopBarPageTitle>
    </TopBar>
  );
};

export { UploadsPageTopBar };
