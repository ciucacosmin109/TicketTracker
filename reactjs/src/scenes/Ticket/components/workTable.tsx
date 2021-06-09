import React from 'react'; 

import { inject, observer } from 'mobx-react';
import Stores from '../../../stores/storeIdentifier'; 

import AppComponentBase from '../../../components/AppComponentBase';  
import { Table, Empty, Space, Button, Dropdown, Menu, Modal, InputNumber } from 'antd';
import { DownOutlined, LoadingOutlined } from '@ant-design/icons'; 
    
import { SpinProps } from 'antd/lib/spin'; 
import { L } from '../../../lib/abpUtility';
import { ColumnsType } from 'antd/lib/table'; 
import { WorkDto } from '../../../services/work/dto/workDto';
import WorkStore from '../../../stores/workStore';
import ProfileAvatar from '../../../components/SiderMenu/components/profileAvatar';
import { UpdateWorkInput } from '../../../services/work/dto/updateWorkInput';
import { UpdateIsWorkingInput } from '../../../services/work/dto/updateIsWorkingInput';

export interface IWorkTableProps {
    workStore?: WorkStore;

    ticketId: number;
    editEnabled?: boolean;
    includeWorking?: boolean;
}
export interface IWorkTableState { 
    modal: boolean;
    modalId: number; 
    modalWorked: number;
    modalEstimated: number;
}
 
@inject(Stores.WorkStore)
@observer
class WorkTable extends AppComponentBase<IWorkTableProps, IWorkTableState> {
    state = { 
        modal: false,
        modalId: 0, 
        modalWorked: 0,
        modalEstimated: 0,
    }
    
    setModal = (visible: boolean, work: WorkDto) => {
        this.setState({
            modal: visible, 
            modalId: work.id, 
            modalWorked: work.workedTime ?? 0,
            modalEstimated: work.estimatedTime ?? 0,
        });
    }
    hideModal = () => {
        this.setState({modal: false});
    }

    modalOk = async () => { 
        // update work 
        this.props.workStore?.update({
            id: this.state.modalId,
            workedTime: this.state.modalWorked,
            estimatedTime: this.state.modalEstimated,
        } as UpdateWorkInput); 

        // hide
        this.hideModal();
    }  

    // Load data
    async componentDidMount() {
        if(this.props.workStore?.ticketId !== this.props.ticketId){
            await this.props.workStore?.getAll(this.props.ticketId);
        } 
    } 
 
    getActionsMenu = (work : WorkDto) => {
        return (
            <Menu onClick={e => this.onActionsMenuClick(e, work)}> 
                <Menu.Item key="0">{this.L('SetActive')}</Menu.Item> 
                <Menu.Item key="1">{this.L('Edit')}</Menu.Item> 
                <Menu.Item key="2">{this.L('Delete')}</Menu.Item> 
            </Menu>
        ); 
    }
    onActionsMenuClick = (e : any, work : WorkDto) => {  
        switch(e.key){
            case "0":
                this.props.workStore?.updateIsWorking({
                    ticketId: this.props.ticketId,
                    workId: work.id
                } as UpdateIsWorkingInput);
                break;
            case "1":
                this.setModal(true, work);
                break;
            case "2":
                this.props.workStore?.delete({id: work.id});
                break;
            default: break;
        }
    };

    render() {
        const loading = this.props.workStore?.loading;
        const works = this.props.workStore?.works?.items?.filter(x => this.props.includeWorking || !x.isWorking);
        const modalWork = works?.find(x => x.id === this.state.modalId);

        // Table config
        const noDataLocale = { 
            emptyText: (
                <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    description={this.L('NoData')}/>
            )
        }; 
        const tableLoading : SpinProps = {
            spinning: loading,
            indicator: <LoadingOutlined />,
            size: 'large'
        }

        const columns : ColumnsType<WorkDto> = [ 
            { title: L('AssignedTo'), key:'type', render: (text: any, record: WorkDto, index: number) =>
                <Space key={index}> 
                    <ProfileAvatar
                        firstName={record.user?.name ?? ""} 
                        lastName={record.user?.surname} 
                        showToolTip 
                        size="small"
                        userId={record.user?.id} />
                    {record.user != null 
                        ? `${record.user?.name} ${record.user?.surname}`
                        : L("UnknownUser")
                    }
                </Space>
            },
            { title: L('AssignedAt'), key:'creationTime', dataIndex:"creationTime", render: (text: any, record: WorkDto, index: number) =>
                this.getDateTimeString(text)
            },
            { title: L('Worked'), key:'workedTime', dataIndex:"workedTime", width:'1%', render: (text: any, record: WorkDto, index: number) =>
                text ?? 0
            },
            { title: L('Estimated'), key:'estimatedTime', dataIndex:"estimatedTime", width:'1%', render: (text: any, record: WorkDto, index: number) =>
                text ?? 0
            },
        ];
        if(this.props.editEnabled){
            columns.push(
                { title: '...', key:'actions', width:'1%', align:'right', render: (text: any, record: WorkDto, index: number) =>
                    <Dropdown key={index} overlay={this.getActionsMenu(record)} trigger={['click']}>
                        <Button onClick={e => e.preventDefault()} icon={<DownOutlined />} /> 
                    </Dropdown>
                }
            );
        }

        // Component content
        return (<div style={{ width: '100%' }}>
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
                dataSource={works}
                columns={columns}
            />
            <Modal  
                visible={this.state.modal}
                onOk={this.modalOk}
                onCancel={this.hideModal}
                title={
                    <Space> 
                        <ProfileAvatar
                            firstName={modalWork?.user?.name ?? ""} 
                            lastName={modalWork?.user?.surname} 
                            showToolTip 
                            size="small"
                            userId={modalWork?.user?.id} />
                        {`${modalWork?.user?.name} ${modalWork?.user?.surname}`}
                    </Space> 
                }
            >   
                <Space> 
                    {`${L("WorkedTime")}:`}
                    <InputNumber 
                        style={{ width: 60 }}  
                        min={0} 
                        max={65000} 
                        size='small' 
                        value={this.state.modalWorked} 
                        onChange={(v: any) => this.setState({modalWorked: v})} 
                    />
                    {"/"}
                    <InputNumber 
                        style={{ width: 60 }} 
                        min={0} 
                        max={65000} 
                        size='small' 
                        value={this.state.modalEstimated} 
                        onChange={(v: any) => this.setState({modalEstimated: v})} 
                    />
                </Space> 
            </Modal>
        </div>); 
    }
}
 
export default WorkTable;