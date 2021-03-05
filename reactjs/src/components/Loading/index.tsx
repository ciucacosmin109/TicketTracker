import * as React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined spin />;

const Loading = () => (
  <div style={{ paddingTop: 100, textAlign: 'center' }}>
    <Spin size="large" indicator={antIcon} /> 
  </div>
);

export default Loading;
