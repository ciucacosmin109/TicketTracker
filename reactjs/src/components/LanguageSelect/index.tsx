import './index.less';
import 'famfamfam-flags/dist/sprite/famfamfam-flags.css';

import * as React from 'react';

import { Button, Dropdown, Menu } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
 
import Stores from '../../stores/storeIdentifier';
import AccountStore from '../../stores/accountStore'; 
import { inject } from 'mobx-react';

declare var abp: any;

export interface ILanguageSelectProps {
  accountStore?: AccountStore;
  noUser?: boolean;
  hidden?: boolean;
}

@inject(Stores.AccountStore)
class LanguageSelect extends React.Component<ILanguageSelectProps> {
  get languages() {
    return abp.localization.languages.filter((val: any) => {
      return !val.isDisabled;
    });
  }

  async changeLanguage(languageName: string) {
    if(this.props.noUser == null || this.props.noUser === false)
      await this.props.accountStore!.changeLanguage(languageName);

    abp.utils.setCookieValue(
      'Abp.Localization.CultureName',
      languageName,
      new Date(new Date().getTime() + 5 * 365 * 86400000), //5 year
      abp.appPath
    );

    window.location.reload();
  }

  get currentLanguage() {
    return abp.localization.currentLanguage;
  }

  render() {
    const langMenu = (
      <Menu className='menu' selectedKeys={[this.currentLanguage.name]}>
        {this.languages.map((item: any) => (
          <Menu.Item key={item.name} onClick={() => this.changeLanguage(item.name)}>
            <i className={item.icon} /> {item.displayName}
          </Menu.Item>
        ))}
      </Menu>
    );

    return ( 
      <Dropdown overlay={langMenu} placement="bottomRight" trigger={['click']}>
        <Button type="dashed" size="large" style={{border: 0, height:"100%", marginLeft: '5px'}} icon={
          !this.props.hidden 
            ? <GlobalOutlined style={{fontSize: '20px'}} /> 
            : undefined
        }>{this.props.hidden ? " " : ""}</Button>
      </Dropdown> 
    );
  }
}

export default LanguageSelect;
