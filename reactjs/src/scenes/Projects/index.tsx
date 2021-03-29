import { inject, observer } from 'mobx-react';
import React from 'react';
import Stores from '../../stores/storeIdentifier';

@inject(Stores.ProjectStore)
@observer
export default class Projects extends React.Component {
    render() {
        return <></>;
    }
}