import React from 'react';
//import './index.less'

import { inject, observer } from 'mobx-react';
import Stores from '../../../stores/storeIdentifier'; 

import AppComponentBase from '../../../components/AppComponentBase';  
import { Table, Empty, Space, Button, Dropdown, Menu,  } from 'antd';
import { AppstoreOutlined, DownOutlined, LoadingOutlined,   } from '@ant-design/icons'; 
   
import { RouteComponentProps, withRouter } from 'react-router';   
import ComponentStore from '../../../stores/componentStore';
import { ComponentDto } from '../../../services/component/dto/componentDto'; 
import { SpinProps } from 'antd/lib/spin';
import EditComponent from './editComponent';
import { L } from '../../../lib/abpUtility';
import { ColumnsType } from 'antd/lib/table';

export interface IComponentTableProps extends RouteComponentProps { 
    componentStore?: ComponentStore; 

    projectId: number; 
    editEnabled?: boolean;
}
export interface IComponentTableState {  
    loading: boolean;
    modal: boolean;
    modalComponentId: number;
}
 
@inject(Stores.ComponentStore)
@observer
class ComponentTable extends AppComponentBase<IComponentTableProps, IComponentTableState> {
    state = {  
        loading: true,       
        modal: false,
        modalComponentId: 0
    }
    setModal = (visible : boolean, id : number) => {
        this.setState({modal: visible, modalComponentId: id});
    }
    modalOk = async () => { 
        await this.props.componentStore?.getAll(this.props.projectId); 
        this.setModal(false, 0);
    }

    // Load data
    async componentDidMount() {   
        await this.props.componentStore?.getAll(this.props.projectId); 
        this.setState({loading: false}); 
    } 

    onRowClick = (e:any, rec:ComponentDto) => {
        this.props.history.push("/");
        // TO DO
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
                this.setModal(true, id);
                break;
            case "1":
                this.props.componentStore?.delete({id});
                break;
            default: break;
        }
    };

    render() {    
        const components = this.props.componentStore?.components?.items;

        // Table config
        const noDataLocale = { 
            emptyText: (
                <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    description={this.L('NoComponentsAdded')}/>
            )
        }; 
        const tableLoading : SpinProps = {
            spinning: this.state.loading,
            indicator: <LoadingOutlined />,
            size: 'large'
        }

        const columns : ColumnsType<ComponentDto> = [ 
            { title: L('Name'), key:'name', render: (text: any, record: ComponentDto, index: number) =>
                <div onClick={e => this.onRowClick(e, record)}>
                    <Space key={index}>
                        <AppstoreOutlined />
                        {record.name}  
                    </Space>
                </div>
            },
            { title: L('Description'), key:'description', dataIndex: 'description', render: (text: any, record: ComponentDto, index: number) =>
                <div onClick={e => this.onRowClick(e, record)}>
                    {text}
                </div>
            },
        ];
        if(this.props.editEnabled){
            columns.push(
                { title: '...', key:'actions', width:'1%', align:'center', render: (text: any, record: ComponentDto, index: number) =>
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
                    dataSource={components} 
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
                {this.state.modalComponentId !== 0
                    ? <EditComponent
                        key={this.state.modalComponentId}
                        visible={this.state.modal}
                        projectId={this.props.projectId}
                        componentId={this.state.modalComponentId}
                        onOk={this.modalOk}
                        onCancel={() => this.setModal(false, 0)} 
                    /> : <></>
                }
            </div> 
        ); 
    }
}
 
export default withRouter(ComponentTable);