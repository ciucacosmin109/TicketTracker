import React from 'react'; 

import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier'; 

import AppComponentBase from '../../components/AppComponentBase';  
import { Card, Row, Space, Spin } from 'antd';
import { FileTextOutlined, LoadingOutlined } from '@ant-design/icons'; 
   
import { RouteComponentProps, withRouter } from 'react-router';   
import TicketTable from '../Component/components/ticketTable';
import AccountStore from '../../stores/accountStore';
 
export interface IMyTicketsProps extends RouteComponentProps { 
    accountStore?: AccountStore; 
}
export interface IMyTicketsState {  
    loading: boolean;
}
 
@inject(Stores.AccountStore)
@observer
class MyTickets extends AppComponentBase<IMyTicketsProps, IMyTicketsState> {
    state = {  
        loading: false,
    }

    render(){ 

        // Component content
        return ( 
            <Spin spinning={this.state.loading} size='large' indicator={<LoadingOutlined />}>
                <Card className="ui-card"
                    title={ 
                        <Space>
                            <FileTextOutlined />
                            {this.L('AssignedTickets')}
                        </Space>   
                    }
                >
                    <Row> 
                        <TicketTable 
                            key={this.props.accountStore?.account?.id} 
                            assignedUserId={this.props.accountStore?.account?.id} 
                            detailed 
                        /> 
                    </Row>
                </Card>
            </Spin>  
        ); 
    }
}
 
export default withRouter(MyTickets);