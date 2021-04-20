import './searchUsers.less';

import React from 'react'; 
import { CheckOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Empty, Form, Input, List, Modal, Space } from 'antd';
import { FormInstance } from 'antd/lib/form'; 
import { inject, observer } from 'mobx-react'; 
import { RouteComponentProps, withRouter } from 'react-router-dom';
import AppComponentBase from '../../../components/AppComponentBase';
import { L } from '../../../lib/abpUtility';
import { SearchAccountOutput } from '../../../services/account/dto/searchAccountOutput';
import { SearchAccountsInput } from '../../../services/account/dto/searchAccountsInput';
import AccountStore from '../../../stores/accountStore';
import Stores from '../../../stores/storeIdentifier';
import rules from './searchUsers.validation';

export interface ISearchUsersProps extends RouteComponentProps {
    accountStore?: AccountStore;
    visible: boolean;
    showSelected?: boolean;
    onOk: (selected: SearchAccountOutput[]) => void;
    onCancel: () => void;
}
export interface ISearchUsersState {
    searching: boolean;
    searchFinished: boolean;
    selectedUsers: SearchAccountOutput[];
}

@inject(Stores.AccountStore)
@observer 
class SearchUsers extends AppComponentBase<ISearchUsersProps, ISearchUsersState> {
    form = React.createRef<FormInstance>();
    state = {
        searching: false,
        searchFinished: false,
        selectedUsers: [] as SearchAccountOutput[],
    }

    resetModal = () => {
        this.form.current?.resetFields();
        this.setState({
            searching: false,
            searchFinished: false,
            selectedUsers: [] as SearchAccountOutput[],
        });
    }
    onOk = () => {
        let selected = this.state.selectedUsers;
        this.resetModal();
        this.props.onOk(selected);
    }
    onCancel = () => {
        this.resetModal();
        this.props.onCancel();
    } 
    onSearch = async (str : string) => {
        try { await this.form.current?.validateFields(); }
        catch { return; }

        this.setState({searching: true});
        try{
            await this.props.accountStore?.searchAccounts({
                keyword: str,
                maxResultCount: 20,
                sorting: 'Name ASC',
            } as SearchAccountsInput);
        }catch{ }
        this.setState({searching: false, searchFinished: true});
    }
    addUser = (user : SearchAccountOutput) => {
        if(this.state.selectedUsers.some(x => x.id === user.id)){
            this.setState({selectedUsers: this.state.selectedUsers.filter(x => x.id !== user.id)});
        }else{
            this.setState({selectedUsers: [...this.state.selectedUsers, user]});
        }
    }

    render() {  
        const noDataLocale = { 
            emptyText: (
                <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    description={L('NoResultsFound')}/>
            )
        };

        return (
            <Modal className="search-users" title={L('SearchUsers')} visible={this.props.visible} onOk={this.onOk} onCancel={this.onCancel} cancelText={L('Cancel')}>
                <Form ref={this.form} layout="vertical">
                    <Form.Item label={L('SearchByNameUserNameEmail')} name={'search'} rules={rules.search}> 
                        <Input.Search loading={this.state.searching} onSearch={this.onSearch} placeholder={L('Keyword')} enterButton={L('Search')} prefix={<UserOutlined style={{ color: 'lightgray' }}/>} />
                    </Form.Item>
                    <Form.Item hidden={!this.state.searchFinished} label={L('SearchResults')}>  
                        <List size='small' 
                            dataSource={this.props.accountStore?.searchResults.items} 
                            locale={noDataLocale} 
                            itemLayout='horizontal' 
                            pagination={{ 
                                pageSize: 3,
                                size: 'small'
                            }}
                            renderItem={(item: SearchAccountOutput, index) => 
                                
                            <List.Item key={index} className="user" onClick={()=>this.addUser(item)}> 
                                <Space>
                                    {this.state.selectedUsers.some(x => x.id === item.id)
                                        ? <Avatar style={{backgroundColor: '#1da57a'}} icon={<CheckOutlined />}/> 
                                        : <Avatar icon={<UserOutlined />}/> }  
                                    {`${item.name} ${item.surname} [${item.userName}]`}
                                </Space>
                            </List.Item>
                        } /> 
                    </Form.Item>
                    <Form.Item hidden={!this.props.showSelected || this.state.selectedUsers.length === 0} label={L('SelectedUsers')}>  
                        <List size='small' 
                            dataSource={this.state.selectedUsers} 
                            locale={noDataLocale} 
                            itemLayout='horizontal' 
                            pagination={{ 
                                pageSize: 3,
                                size: 'small'
                            }}
                            renderItem={(item: SearchAccountOutput, index) => 
                                
                            <List.Item key={index}> 
                                <Space> 
                                    <Avatar icon={<UserOutlined />}/>
                                    {`${item.name} ${item.surname} [${item.userName}]`}
                                </Space>
                            </List.Item>
                        } /> 
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}
export default withRouter(SearchUsers);