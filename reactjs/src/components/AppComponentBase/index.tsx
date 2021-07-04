import * as React from 'react';
import './index.less';

import { L, isGranted } from '../../lib/abpUtility';
import { appRouters } from '../Router/router.config';
import utils from '../../utils/utils';
import moment from 'moment-timezone'

class AppComponentBase<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {
  L_original(key: string, sourceName?: string): string {
    return L(key);
  }
  L(key: string, ...args: string[]): string {
    return L(key, ...args);
  }

  isGranted(permissionName: string): boolean {
    return isGranted(permissionName);
  }

  getPath(componentName: string): string {
    return appRouters.find((x : any) => x.name === componentName)?.path ?? "/"; 
  }

  getQueryParam(name: string) : string | null { 
    if(this.props["location"] != null){
      let params = new URLSearchParams(this.props["location"].search); 
      return params.get(name);
    }

    return null;
  }

  getDateString(date: Date){ 
    return moment(date).local().format("DD-MM-YYYY");
    //return new Date(date).toLocaleDateString("ro-RO");
  }
  getDateTimeString(date: Date){ 
    return moment(date).local().format("DD-MM-YYYY, HH:mm:ss");
    //return new Date(date).toLocaleString("ro-RO");
  }

  setCustomTitle(title: string | undefined){
    if(title != null){
      document.title = title + ' | ' + utils.getPageTitle("");
    } 
  }
}

export default AppComponentBase;
