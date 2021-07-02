import 'famfamfam-flags/dist/sprite/famfamfam-flags.css';

import * as React from 'react';
import AppComponentBase from '../AppComponentBase'

import { Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import Stores from '../../stores/storeIdentifier'; 
import { inject } from 'mobx-react';
import InfoStore from '../../stores/infoStore';
 
export interface ILanguageSelectProps {
    infoStore?: InfoStore; 
}

@inject(Stores.InfoStore)
export default class InfoToggle extends AppComponentBase<ILanguageSelectProps> {
    render() { 
        return (
            <Button 
                type="dashed" 
                size="large" 
                style={{border: 0, height:"100%", marginLeft: '5px'}} 
                icon={
                    <QuestionCircleOutlined style={{fontSize: '20px'}} />
                }
                onClick={() => this.props.infoStore?.toggle()}
            />
        );
    }
}
