import { useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';

import * as UploadsSelectors from 'components/Uploads/UploadsSelectors';

const CloseTabWarning = () => {
  const activeUploadsList = useSelector(UploadsSelectors.getActiveUploadsList);
  const isCloseTabWarningEnabledRef = useRef(false);

  // Show the close tab warning when user tries to close the tab
  // See https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
  const handleWindowUnload = useCallback(e => {
    // for Mozilla
    e.preventDefault();
    // for Chrome
    e.returnValue = '';
  }, []);

  useEffect(() => {
    if (activeUploadsList.length && !isCloseTabWarningEnabledRef.current) {
      isCloseTabWarningEnabledRef.current = true;
      window.addEventListener('beforeunload', handleWindowUnload);
    }

    if (!activeUploadsList.length && isCloseTabWarningEnabledRef.current) {
      isCloseTabWarningEnabledRef.current = false;
      window.removeEventListener('beforeunload', handleWindowUnload);
    }
  }, [activeUploadsList]);

  return null;
};

export default CloseTabWarning;
