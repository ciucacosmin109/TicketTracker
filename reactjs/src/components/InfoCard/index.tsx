import { Alert } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react'; 
import InfoStore from '../../stores/infoStore';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../AppComponentBase';

export interface IInfoCardProps{
    infoStore?: InfoStore;

    text: string; 
} 
export interface IInfoCardState{ 
} 

@inject(Stores.InfoStore)
@observer
export default class InfoCard extends AppComponentBase<IInfoCardProps,IInfoCardState> { 
    render() { 
        const infoStore = this.props.infoStore;
        let paragraphList = this.props.text.split('\\n').map(s => s.trim());  

        return infoStore?.visible ? 
            <Alert
                className="ui-card-margin"
                message={this.L("Info")}
                description={paragraphList.map((str, idx) => str !== ""
                    ? <p key={idx}>{str}</p>
                    : <br key={idx} />
                )}
                type="info"
                showIcon
                closable 
                onClose={() => infoStore.toggle()}
            />
        : <></>;
        
    }
}