import './index.css';
import 'antd/dist/antd.css'; 

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as moment from 'moment-timezone';

import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import Utils from './utils/utils';
import abpUserConfigurationService from './services/abpUserConfigurationService';
import initializeStores from './stores/storeInitializer';
import registerServiceWorker from './registerServiceWorker';
import Loading from './components/Loading';

declare var abp: any;

ReactDOM.render(
  <Loading />,
  document.getElementById('root') as HTMLElement
);

// Sets the default language or the browser's language
Utils.setLocalization();

abpUserConfigurationService.getAll().then(data => {
  // Populate abp variable
  Utils.extend(true, abp, data.data.result);

  // Sets the clock provider from a string ... now(), normalize(...), supportsMultipleTimezone
  abp.clock.provider = Utils.getCurrentClockProvider(abp.clock.provider);

  // Sets the language the dates will be formated to
  moment.locale(abp.localization.currentLanguage.name);

  // Sets the timezone dates (asumed to  be utc) will be converted to
  if (abp.clock.provider.supportsMultipleTimezone) {
    moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
  }

  const stores = initializeStores();

  ReactDOM.render(
    <Provider {...stores}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
    document.getElementById('root') as HTMLElement
  );

  registerServiceWorker();
});
