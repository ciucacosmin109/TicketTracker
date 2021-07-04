import { Card, Col, Row, Skeleton, Space } from 'antd';
import React from 'react';

import AppComponentBase from '../AppComponentBase';

export interface UiCardProps {
    className?: string;
    style?: React.CSSProperties;
    zeroPadding?: boolean;

    loadingTitle?: boolean;
    loadingBody?: boolean;
    loadingBodyLines?: number;

    icon?: React.ReactNode;
    title?: React.ReactNode;
    extra?: React.ReactNode;
}

export default class UiCard extends AppComponentBase<UiCardProps> {
    render() {
        const hasZeroPadding = (this.props.zeroPadding && !this.props.loadingBody) || this.props.children == null;

        return (
            <Card 
                className={this.props.className}
                bodyStyle={hasZeroPadding ? 
                    {
                        padding:  "0px",
                        paddingTop: "1px",
                    } : undefined
                }
                style={{
                    border: "1.8px solid rgb(223, 223, 223)",
                    margin: "5px",
                    ...this.props.style
                }}
                loading={this.props.loadingBodyLines == null && this.props.loadingBody}
                title={this.props.icon != null || this.props.title != null || this.props.extra != null ?
                    <Row> 
                        {this.props.loadingTitle
                            ? <Space>
                                <Skeleton.Avatar active size="small" shape="square" />
                                <Skeleton.Input active size="small" style={{width: "1000px"}} /> 
                            </Space>
                            : <> 
                                <Col flex="auto">  
                                    <Space> 
                                        {this.props.icon}
                                        {this.props.title}
                                    </Space> 
                                </Col>
                                <Col flex="none">
                                    {this.props.extra}
                                </Col>
                            </>
                        }
                    </Row> : undefined
                } 
            > 
                <Skeleton 
                    active 
                    loading={this.props.loadingBody}
                    title={false}
                    paragraph={{ rows: this.props.loadingBodyLines }} 
                >
                    {this.props.children}
                </Skeleton>
            </Card>
        );
    }
}