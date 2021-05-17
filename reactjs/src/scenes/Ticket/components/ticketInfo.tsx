import React from 'react'; 

import AppComponentBase from '../../../components/AppComponentBase'; 
import { L } from '../../../lib/abpUtility';
import { Row, Space } from 'antd';
import { AlignLeftOutlined, BgColorsOutlined,  BranchesOutlined,  BugFilled,  BulbFilled,  
    CarryOutFilled, DownCircleOutlined, DropboxCircleFilled, 
    FileAddOutlined, FileTextOutlined, LockFilled, MinusCircleFilled, 
    QuestionCircleOutlined, SnippetsFilled, UpCircleFilled, ZoomInOutlined } from '@ant-design/icons'; 
    
import { TicketType } from '../../../services/ticket/dto/ticketType';
import { TicketPriority } from '../../../services/ticket/dto/ticketPriority';
import { SimpleStatusDto } from '../../../services/status/dto/simpleStatusDto';  
import {TicketDto} from '../../../services/ticket/dto/ticketDto';

export interface ITicketInfoProps { 
    ticketDto: TicketDto; 
}

class TicketInfo extends AppComponentBase<ITicketInfoProps> { 

    getPriorityIcon = (priority: TicketPriority) => {
        switch(priority){ 
            case TicketPriority.VERY_LOW:
                return <DownCircleOutlined />;
            case TicketPriority.LOW:
                return <DownCircleOutlined style={{color: 'green'}} />;
            case TicketPriority.MEDIUM:
                return <MinusCircleFilled style={{color: 'green'}} />;
            case TicketPriority.HIGH:
                return <UpCircleFilled style={{color: 'orange'}} />;
            case TicketPriority.VERY_HIGH:
                return <UpCircleFilled style={{color: 'red'}} />;
            default:
                return <QuestionCircleOutlined />;
        }
    }
    getActivityIcon = (activity: SimpleStatusDto | undefined) => {
        switch(activity?.name){ 
            case "Design":
                return <BgColorsOutlined style={{color: 'orange'}} />;
            case "Development":
                return <AlignLeftOutlined style={{color: 'red'}} />;
            case "Testing":
                return <ZoomInOutlined style={{color: 'orange'}} />;
            case "Documentation":
                return <SnippetsFilled style={{color: 'blue'}} />;
            case "Deployment":
                return <DropboxCircleFilled style={{color: 'green'}} />;
            default:
                return <QuestionCircleOutlined />;
        }
    }
    getStatusIcon = (status: SimpleStatusDto | undefined) => {
        switch(status?.name){ 
            case "New":
                return <FileAddOutlined />;
            case "In development":
                return <BranchesOutlined style={{color: 'orange'}} />;
            case "In development (reopened)":
                return <BranchesOutlined style={{color: 'orange'}} />;
            case "Solved":
                return <CarryOutFilled style={{color: 'green'}} />;
            case "Closed":
                return <LockFilled style={{color: 'red'}} />;
            default:
                return <QuestionCircleOutlined />;
        }
    }

    render() {
        const ticket = this.props.ticketDto;

        return (<>
            <Row> 
                <Space>
                    {`${L("Type")}:`}
                    {   
                        ticket?.type === 1 ?
                            <BugFilled style={{color: 'red'}} /> :
                        ticket?.type === 2 ?
                            <BulbFilled style={{color: 'green'}} /> :
                        <FileTextOutlined />
                    } 
                    {L(TicketType[ticket?.type ?? 0])} 
                </Space>
            </Row>
            <Row style={{marginBottom: '15px'}}> 
                {ticket?.activity != null ?
                    <Space>
                        {`${L("Activity")}:`}
                        {this.getActivityIcon(ticket?.activity)} 
                        {L(ticket?.activity?.name ?? "")} 
                    </Space> : <></>
                }
            </Row> 
            <Row> 
                <Space>
                    {`${L("Priority")}:`}
                    {this.getPriorityIcon(ticket?.priority ?? 0)} 
                    {L(TicketPriority[ticket?.priority ?? 0])} 
                </Space>
            </Row> 
            <Row> 
                <Space>
                    {`${L("Status")}:`}
                    {this.getStatusIcon(ticket?.status)} 
                    {L(ticket?.status?.name ?? "")}  
                </Space>
            </Row> 
        </>); 
    }
}
 
export default TicketInfo;