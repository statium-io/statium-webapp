import React from 'react';
import { IntlProvider } from 'react-intl';

import { DayCalendar } from './components/DayCalendar';
import Header from './Header';

const messagesInFrench = {
  myMessage: "Aujourd'hui, c'est le {ts, date, ::yyyyMMdd}",
};

type Props = Record<string, never>;

const App: React.FunctionComponent<Props> = () => {
  return (
    <IntlProvider defaultLocale="en" locale="fr" messages={messagesInFrench}>
      <Header />
      <DayCalendar />
    </IntlProvider>
  );
};

export default App;
