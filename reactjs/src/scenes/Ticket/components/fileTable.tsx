import React from 'react'; 

import { inject, observer } from 'mobx-react';
import Stores from '../../../stores/storeIdentifier'; 

import AppComponentBase from '../../../components/AppComponentBase';  
import { Table, Empty, Button, Dropdown, Menu, Space } from 'antd';
import { DownOutlined, FileExcelFilled, FileFilled, 
    FileImageFilled, FileMarkdownFilled, FilePdfFilled, 
    FilePptFilled, FileTextFilled, FileWordFilled, FileZipFilled, LoadingOutlined } from '@ant-design/icons'; 
    
import { SpinProps } from 'antd/lib/spin'; 
import { L } from '../../../lib/abpUtility';
import { ColumnsType } from 'antd/lib/table';  
import FileStore from '../../../stores/fileStore';
import { FileDto } from '../../../services/file/dto/fileDto';
import fileService from '../../../services/file/fileService';
import { DownloadFileInput } from '../../../services/file/dto/downloadFileInput';
import FileUploader from './fileUploader';

export interface IFileTableProps {
    fileStore?: FileStore;

    ticketId: number;
    uploadEnabled?: boolean;
    editEnabled?: boolean;
}
export interface IFileTableState {
}
 
@inject(Stores.FileStore)
@observer
class FileTable extends AppComponentBase<IFileTableProps, IFileTableState> {
    // Load data
    componentDidMount() {
        if(this.props.fileStore?.files?.ticketId !== this.props.ticketId){
            this.props.fileStore?.getFileList(this.props.ticketId);
        } 
    } 
 
    static getFileIcon = (filename: string) => {
        if(filename.endsWith(".pdf")){
            return <FilePdfFilled style={{color: "gray"}} />;
        }else if(filename.endsWith(".txt")){
            return <FileTextFilled style={{color: "gray"}} />;
        }else if(filename.endsWith(".md")){
            return <FileMarkdownFilled style={{color: "gray"}} />;
        }else if(filename.endsWith(".png") || filename.endsWith(".jpg") || filename.endsWith(".jpeg") || filename.endsWith(".gif")){
            return <FileImageFilled style={{color: "indianred"}} />;
        }else if(filename.endsWith(".xlsx") || filename.endsWith(".xls")){
            return <FileExcelFilled style={{color: "forestgreen"}} />;
        }else if(filename.endsWith(".pptx") || filename.endsWith(".ppt")){
            return <FilePptFilled style={{color: "goldenrod"}} />;
        }else if(filename.endsWith(".docx") || filename.endsWith(".doc")){
            return <FileWordFilled style={{color: "dodgerblue"}} />;
        }else if(filename.endsWith(".zip") || filename.endsWith(".rar") || filename.endsWith(".tar.gz")){
            return <FileZipFilled style={{color: "goldenrod"}} />;
        }else{
            return <FileFilled style={{color: "gray"}} />;
        }
    }
    getActionsMenu = (file : FileDto) => {
        return (
            <Menu onClick={e => this.onActionsMenuClick(e, file)}>
                <Menu.Item key="0">{this.L('Download')}</Menu.Item> 
                <Menu.Item key="1">{this.L('Delete')}</Menu.Item> 
            </Menu>
        ); 
    }
    onActionsMenuClick = (e : any, file : FileDto) => {  
        switch(e.key){
            case "0":
                fileService.download({fileId: file.id, ticketId: file.ticketId} as DownloadFileInput);
                break;
            case "1":
                this.props.fileStore?.delete({id: file.id});
                break;
            default: break;
        }
    };

    onNewFiles = async (files: FileList) => { 
        const ticketId = this.props.fileStore?.files?.ticketId; 
        if(ticketId == null){
            return;
        }
        console.log(files); 

        for(let i = 0; i < files.length;i++){
            const formData = new FormData();  
            formData.append("file", files[i]);
            formData.append("ticketId", ticketId.toString()); 
            
            await this.props.fileStore?.post(formData);
        } 
    };

    render() {
        const loading = this.props.fileStore?.loading;
        const files = this.props.fileStore?.files?.files; 

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

        const columns : ColumnsType<FileDto> = [ 
            { key:'padding', width:'10px' },
            { title: L('Id'), key:'id', dataIndex:"id", width:'1%' },
            { title: L('Name'), key:'name', dataIndex:"name", render: (text: any, record: FileDto, index: number) =>
                <Space>
                    {FileTable.getFileIcon(record.name)}
                    <a href={fileService.getDownloadLink({ticketId: record.ticketId, fileId: record.id})} download>
                        {text}
                    </a>
                </Space>
            },
            { title: L('Size'), key:'size', dataIndex:"size", render: (text: any, record: FileDto, index: number) =>
                ((record.size / 1024.0 / 1024.0) ?? 0).toFixed(2) + " MB"
            },
            { title: L('UploadedAt'), key:'creationTime', dataIndex:"creationTime", render: (text: any, record: FileDto, index: number) =>
                this.getDateTimeString(text)
            },
        ];
        if(this.props.editEnabled){
            columns.push(
                { title: '...', key:'actions', width:'1%', align:'right', render: (text: any, record: FileDto, index: number) =>
                    <Dropdown key={index} overlay={this.getActionsMenu(record)} trigger={['click']}>
                        <Button onClick={e => e.preventDefault()} icon={<DownOutlined />} /> 
                    </Dropdown>
                }
            );
        }

        // Component content
        return (<div style={{width: '100%'}}>
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
                dataSource={files}
                columns={columns}
            /> 
            {this.props.uploadEnabled 
                ? <FileUploader onNewFiles={this.onNewFiles} />
                : <></>
            } 
        </div>); 
    }
}
 
export default FileTable;