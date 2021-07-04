import React from 'react'; 

import AppComponentBase from '../../../components/AppComponentBase'; 
import { L } from '../../../lib/abpUtility';
import { Row, Space } from 'antd';
import { AppstoreOutlined, CalendarOutlined, EditOutlined, LockOutlined, ProjectOutlined} from '@ant-design/icons'; 
     
import { TicketDto } from '../../../services/ticket/dto/ticketDto'; 

export interface ITicketMetaProps { 
    ticketDto: TicketDto; 
}

class TicketMeta extends AppComponentBase<ITicketMetaProps> { 

    render() {
        const ticket = this.props.ticketDto;

        return (<>
            <div style={{marginBottom: '15px'}}>
                <Row> 
                    <Space>
                        <CalendarOutlined />
                        {`${L('Created')}: ${this.getDateTimeString(ticket?.creationTime!)}`}  
                    </Space>
                </Row>
                {ticket?.lastModificationTime ? 
                    <Row> 
                        <Space>
                            <EditOutlined />
                            {`${L('Modified')}: ${this.getDateTimeString(ticket?.lastModificationTime!)}`}  
                        </Space>
                    </Row> : <></>
                } 
            </div>
            <Row> 
                <Space> 
                    {ticket.project.isPublic 
                        ? <ProjectOutlined style={{color:"#1da57a"}}/> 
                        : <LockOutlined style={{color:"orange"}}/> } 
                    {`${L('Project')}: ${ticket?.project.name}`}   
                </Space>
            </Row> 
            <Row> 
                <Space> 
                    <AppstoreOutlined style={{color: 'purple'}} /> 
                    {`${L('Component')}: ${ticket?.component.name}`}   
                </Space>
            </Row> 
        </>); 
    }
}
 
export default TicketMeta;