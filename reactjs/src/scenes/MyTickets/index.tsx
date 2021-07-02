import React from 'react'; 

import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier'; 

import AppComponentBase from '../../components/AppComponentBase';  
import { Card, Col, Row, Space, Spin } from 'antd';
import { AreaChartOutlined, FileTextOutlined, LoadingOutlined } from '@ant-design/icons'; 
   
import { RouteComponentProps, withRouter } from 'react-router';   
import TicketTable from '../Component/components/ticketTable';
import AccountStore from '../../stores/accountStore';
import TicketTypeChart from '../Project/chartComponents/ticketTypeChart';
import TicketStatusChart from '../Project/chartComponents/ticketStatusChart';
import TicketStore from '../../stores/ticketStore';
import TicketPriorityChart from '../Project/chartComponents/ticketPriorityChart';
import InfoCard from '../../components/InfoCard';
 
export interface IMyTicketsProps extends RouteComponentProps { 
    accountStore?: AccountStore; 
    ticketStore?: TicketStore; 
}
export interface IMyTicketsState {  
    loading: boolean;
}
 
@inject(Stores.AccountStore, Stores.TicketStore)
@observer
class MyTickets extends AppComponentBase<IMyTicketsProps, IMyTicketsState> {
    state = {  
        loading: false,
    }

    render(){  
        const tickets = this.props.ticketStore?.userTickets;

        return ( 
            <Spin spinning={this.state.loading} size='large' indicator={<LoadingOutlined />}> 
                <InfoCard text={this.L("InfoAssignedTickets")} />
                <Card className="ui-table-card"
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
                
                {this.props.ticketStore?.assignedUserId != null || true ?
                    <Card className="ui-card"
                        title={<Space> 
                            <AreaChartOutlined style={{color: 'royalblue'}}/>
                            {this.L("Statistics")}
                        </Space>}
                    > 
                        <Row>
                            {/* Baaa, nu stiu de ce, dar fara width: 0, toate cardurile se vad pe cate o linie ... */}
                            <Col flex="1 1 300px" style={{width: 0, margin: 5}}>
                                <TicketTypeChart tickets={tickets?.items ?? []} /> 
                            </Col>
                            <Col flex="1 1 500px" style={{width: 0, margin: 5}}>
                                <TicketPriorityChart tickets={tickets?.items ?? []} /> 
                            </Col>
                            <Col flex="1 1 500px" style={{width: 0, margin: 5}}>
                                <TicketStatusChart tickets={tickets?.items ?? []} /> 
                            </Col> 
                        </Row>
                    </Card>
                    : <></>
                }
                
            </Spin>  
        ); 
    }
}
 
export default withRouter(MyTickets);