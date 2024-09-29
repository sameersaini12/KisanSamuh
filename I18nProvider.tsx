import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import i18n from './i18n.js';

const I18nProvider = ({ children } :any ) => {
  const defaultLanguage = useSelector((state: any) => state.user.language);

  useEffect(() => {
    const languageCode = defaultLanguage === 0 ? 'en' : 'hi';
    i18n.changeLanguage(languageCode);
  }, [defaultLanguage]);

  return <>{children}</>;
};

export default I18nProvider;
