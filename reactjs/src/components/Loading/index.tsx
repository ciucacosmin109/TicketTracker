import React from 'react';
import { Space, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined spin />;

export interface ILoadingProps {
    loadingMessage?: string;
}
class Loading extends React.Component<ILoadingProps> {
    render() {
        const message = this.props.loadingMessage;

        return (
            <Space direction="vertical" style={{ paddingTop: 100, textAlign: 'center', width: "100%" }}>
                <Spin spinning={true} size="large" indicator={antIcon} />
                {message}
            </Space>
        );
    }
} 

export default Loading;
