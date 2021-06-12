import React from 'react';
//import './index.less'

import { inject, observer } from 'mobx-react';
import Stores from '../../../stores/storeIdentifier'; 

import AppComponentBase from '../../../components/AppComponentBase';  
import { Table, Empty, Space, Button, Dropdown, Menu,  } from 'antd';
import { BugFilled, BulbFilled, DownOutlined, FileTextOutlined, LoadingOutlined,   } from '@ant-design/icons'; 
   
import { RouteComponentProps, withRouter } from 'react-router';
import { SpinProps } from 'antd/lib/spin'; 
import { L } from '../../../lib/abpUtility';
import { ColumnsType } from 'antd/lib/table';
import TicketStore from '../../../stores/ticketStore';
import { TicketDto } from '../../../services/ticket/dto/ticketDto';
import { TicketType } from '../../../services/ticket/dto/ticketType';
import ComponentStore from '../../../stores/componentStore';
import ProjectStore from '../../../stores/projectStore'; 

export interface ITicketTableProps extends RouteComponentProps { 
    ticketStore?: TicketStore; 
    componentStore?: ComponentStore; 
    projectStore?: ProjectStore; 

    componentId?: number; 
    projectId?: number; 
    assignedUserId?: number; 

    editEnabled?: boolean;
    detailed?: boolean;
}
export interface ITicketTableState {
}
 
@inject(
    Stores.TicketStore,
    Stores.ComponentStore,
    Stores.ProjectStore)
@observer
class TicketTable extends AppComponentBase<ITicketTableProps, ITicketTableState> { 
    // Load data
    componentDidMount() {   
        if(this.props.componentId != null){
            this.props.ticketStore?.getAllByComponentId(this.props.componentId); 
        }else if(this.props.projectId != null){
            this.props.ticketStore?.getAllByProjectId(this.props.projectId); 
        }else if(this.props.assignedUserId != null){
            this.props.ticketStore?.getAllByAssignedUserId(this.props.assignedUserId); 
        } 
    } 
    getTicketsFromStore = () => {
        if(this.props.componentId != null){
            return this.props.ticketStore?.componentTickets?.items;
        }else if(this.props.projectId != null){
            return this.props.ticketStore?.projectTickets?.items;
        }else if(this.props.assignedUserId != null){
            return this.props.ticketStore?.userTickets?.items;
        }else return [];
    }

    onRowClick = (e:any, rec:TicketDto) => {
        const path = this.getPath("ticket").replace('/:id', `/${rec.id}`);
        this.props.history.push(path);
    }
    goToProject = async (e:any, rec:TicketDto) => {
        const path = this.getPath("project").replace('/:id', `/${rec.project.id}`);
        this.props.history.push(path);
    }
    goToComponent = (e:any, rec:TicketDto) => {
        const path = this.getPath("component").replace('/:id', `/${rec.component.id}`);
        this.props.history.push(path);
    }
 
    getActionsMenu = (id : number) => {
        return (
            <Menu onClick={e => this.onActionsMenuClick(e, id)}> 
                <Menu.Item key="0">{this.L('Edit')}</Menu.Item> 
                <Menu.Item key="1">{this.L('Delete')}</Menu.Item> 
            </Menu>
        ); 
    }
    onActionsMenuClick = (e : any, id : number) => {  
        switch(e.key){
            case "0":
                const path = this.getPath("editticket").replace('/:id', `/${id}`);
                this.props.history.push(path);
                break;
            case "1":
                this.props.ticketStore?.delete({id});
                break;
            default: break;
        }
    };

    render() {
        const loading = this.props.ticketStore?.loading;
        const tickets = this.getTicketsFromStore();

        // Table config
        const noDataLocale = { 
            emptyText: (
                <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    description={this.L('NoTickets')}/>
            )
        }; 
        const tableLoading : SpinProps = {
            spinning: loading,
            indicator: <LoadingOutlined />,
            size: 'large'
        }

        const columns : ColumnsType<TicketDto> = [ 
            { title: L('Type'), key:'type', width:'1%', render: (text: any, record: TicketDto, index: number) =>
                <div onClick={e => this.onRowClick(e, record)}>
                    <Space key={index}>
                        {   
                            record.type === 1 ?
                                <BugFilled style={{color: 'red'}} /> :
                            record.type === 2 ?
                                <BulbFilled style={{color: 'green'}} /> :
                            <FileTextOutlined />
                        } 
                        {L(TicketType[record.type])}  
                    </Space>
                </div>
            },
            { title: L('Ticket'), key:'title', dataIndex:"title", render: (text: any, record: TicketDto, index: number) =>
                <div onClick={e => this.onRowClick(e, record)}> 
                    {text}
                </div>
            },
        ];
        if(this.props.detailed){
            columns.push(
                { title: L('Project'), key:'project', render: (text: any, record: TicketDto, index: number) =>
                    <div onClick={e => this.goToProject(e, record)}> 
                        {record.project.name}
                    </div>
                },
                { title: L('Component'), key:'component', render: (text: any, record: TicketDto, index: number) =>
                    <div onClick={e => this.goToComponent(e, record)}> 
                        {record.component.name}
                    </div>
                },
            );
        }
        if(this.props.editEnabled){
            columns.push(
                { title: '...', key:'actions', width:'1%', align:'right', render: (text: any, record: TicketDto, index: number) =>
                    <Dropdown key={index} overlay={this.getActionsMenu(record.id)} trigger={['click']}>
                        <Button onClick={e => e.preventDefault()} icon={<DownOutlined />} /> 
                    </Dropdown>
                }
            );
        }
        
        // Component content
        return (  
            <div style={{ width: '100%' }}>
                <Table size='small'
                    showHeader={true} 
                    rowKey={x=>x.id} 
                    pagination={{
                        hideOnSinglePage: true
                    }}
                    style={{
                        width: '100%'
                    }}
                    loading={tableLoading}
                    scroll={{x: true}}
                    locale={noDataLocale} 
                    dataSource={tickets} 
                    columns={columns}   
                    onRow={(record, rowIndex) => { // seteaza props pentru linii
                      return {
                        //onClick: event => this.onRowClick(event, record), // click row
                        style: {
                            cursor: 'pointer'
                        }
                      };
                    }}
                /> 
            </div> 
        ); 
    }
}
 
export default withRouter(TicketTable);