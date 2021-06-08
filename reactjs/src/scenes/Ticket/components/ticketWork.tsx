import React from 'react'; 

import { inject, observer } from 'mobx-react';
import Stores from '../../../stores/storeIdentifier'; 
import WorkStore from '../../../stores/workStore';
import ProjectUserStore from '../../../stores/projectUserStore';

import AppComponentBase from '../../../components/AppComponentBase'; 
import { L } from '../../../lib/abpUtility';
import { Button, InputNumber, Row, Select, Space } from 'antd';
import ProfileAvatar from '../../../components/SiderMenu/components/profileAvatar'; 
//import { SimpleWorkDto } from '../../../services/work/dto/simpleWorkDto';

export interface ITicketWorkProps {   
    workStore?: WorkStore;
    projectUserStore?: ProjectUserStore;

    editUserEnabled: boolean;
    editEstimationEnabled: boolean;
    ticketId: number; 
}
export interface ITicketWorkState {  
    loading: boolean;
 
    workedTime: number;
    estimatedTime: number;
}

@inject( 
    Stores.WorkStore, 
    Stores.ProjectUserStore)
@observer
class TicketWork extends AppComponentBase<ITicketWorkProps, ITicketWorkState> {  
    state = { 
        loading: true,
 
        workedTime: 0,
        estimatedTime: 0,
    }
    
    onAssign = (value: number, option: any/*OptionData | OptionGroupData*/) => {
        if(value === 0){
            this.props.workStore?.updateIsWorking({ticketId: this.props.ticketId}); 
        }else {
            this.setState({ 
                workedTime: 0,
                estimatedTime: 0,
            }); 
            this.props.workStore?.create({
                userId: value,
                ticketId: this.props.ticketId
            });
        }
    }
    onWorkedChange = (value: string | number | undefined) => {
        if(typeof value === "number"){
            this.setState({workedTime: value});
        }
    }
    onEstimatedChange = (value: string | number | undefined) => {
        if(typeof value === "number"){
            this.setState({estimatedTime: value});
        }
    }
    onTimeSave = async () => {
        if(this.props.workStore?.assignedWork){
            await this.props.workStore?.update({
                id: this.props.workStore?.assignedWork?.id,
                workedTime: this.state.workedTime,
                estimatedTime: this.state.estimatedTime,
            });
        }
    }

    async componentDidMount() {
        if(this.props.ticketId !== this.props.workStore?.ticketId){
            await this.props.workStore?.getAll(this.props.ticketId);
            await this.props.workStore?.getAssigned(this.props.ticketId);
        }
        await this.props.projectUserStore?.getAllByTicketId(this.props.ticketId);

        const assignedWork = this.props.workStore?.assignedWork;

        this.setState({
            loading: false,  
            workedTime: assignedWork?.workedTime ?? 0,
            estimatedTime: assignedWork?.estimatedTime ?? 0,
        });
    }

    render() {
        //const works = this.props.workStore?.works ?? [];
        const assignedTo = this.props.workStore?.assignedWork;
        //const worked = this.props.workStore?.works?.items?.filter(x => !x.isWorking) ?? [];

        const projectUsers = this.props.projectUserStore?.ticketUsers ?? [];
        const projectUsersMapped = projectUsers?.map(x => ({ value: x.user.id, label:
            <Space style={{ cursor: 'pointer' }}>
                <ProfileAvatar
                    firstName={x.user.name}
                    lastName={x.user.surname} 
                    size="small" />
                {`${x.user.name} ${x.user.surname}`}
            </Space>
        }));
        
        const options = [
            //{ value: -1, label: L("Unknown"), disabled: true }, 
            { value: 0, label: L("NoUserAssigned") },  
            ...projectUsersMapped
        ];

        return (<Space direction="vertical"> 
            <Row> 
                <Space>
                    {`${L("AssignedTo")}:`} 

                    {this.props.editUserEnabled 
                        ? 
                            <Select
                                showSearch 
                                style={{ 
                                    width: 210
                                }}  
                                options={options}
                                value={assignedTo?.user?.id ?? 0} 
                                onSelect={this.onAssign}
                                notFoundContent={L("NoResultsFound")}
                                placeholder={L("TypeUser")}
                                filterOption={(input, option) =>
                                    (projectUsers.find(x => x.id === option?.value)?.user.fullName?.toLowerCase().indexOf(input.toLowerCase()) ?? -1) >= 0
                                }
                            /> 
                        :
                            assignedTo?.user ? <>
                                <ProfileAvatar
                                    firstName={assignedTo?.user?.name} 
                                    lastName={assignedTo?.user?.surname} 
                                    showToolTip 
                                    size="small"
                                    userId={assignedTo?.user?.id} />
                                {`${assignedTo?.user?.name} ${assignedTo?.user?.surname}`}
                            </> : L("NoUserAssigned")
                    }
                </Space>
            </Row>
            {assignedTo ?
                <Row>
                    <Space>
                        {`${L("WorkedTime")}:`}
                        {!this.props.editEstimationEnabled 
                            ? `${assignedTo.workedTime ?? 0} / ${assignedTo.estimatedTime ?? 0}`
                            : <>
                                <InputNumber 
                                    style={{ width: 60 }}  
                                    min={0} 
                                    max={65000} 
                                    size='small' 
                                    value={this.state.workedTime} 
                                    onChange={this.onWorkedChange} 
                                />
                                {"/"}
                                <InputNumber 
                                    style={{ width: 60 }} 
                                    min={0} 
                                    max={65000} 
                                    size='small' 
                                    value={this.state.estimatedTime} 
                                    onChange={this.onEstimatedChange} 
                                />
                                <Button size="small" onClick={this.onTimeSave}>{L("Save")}</Button>
                            </>
                        } 
                    </Space>
                </Row> : <></>
            }
        </Space>); 
    }
}
 
export default TicketWork;