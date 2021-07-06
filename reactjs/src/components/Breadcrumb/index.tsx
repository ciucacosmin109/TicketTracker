import React from 'react';
import H from 'history';

import AppComponentBase from '../AppComponentBase';
import { Breadcrumb as AntdBreadcrumb, Space } from 'antd'; 
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier'; 
import { AppstoreOutlined, HomeOutlined, LoadingOutlined, LockOutlined, ProjectOutlined } from '@ant-design/icons'; 
import { Link } from 'react-router-dom';
import ProjectStore from '../../stores/projectStore';
import ComponentStore from '../../stores/componentStore';
import TicketStore from '../../stores/ticketStore'; 
import { IRoute } from '../Router/router.config'; 
import utils from '../../utils/utils';  
import { SimpleProjectDto } from '../../services/project/dto/simpleProjectDto';
import { SimpleComponentDto } from '../../services/component/dto/simpleComponentDto';
import { SimpleTicketDto } from '../../services/ticket/dto/simpleTicketDto';
import TicketInfo from '../../scenes/Ticket/components/ticketInfo';

export interface IBreadcrumbItem {
    icon?: any; 
    path?: string;
    
    title: string;
    routeName: string;
}

export interface IBreadcrumbProps {
    projectStore?: ProjectStore;
    componentStore?: ComponentStore;
    ticketStore?: TicketStore;

    history: H.History;
}
export interface IBreadcrumbState {
}

@inject(
    Stores.ProjectStore,
    Stores.ComponentStore,
    Stores.TicketStore)
@observer
class Breadcrumb extends AppComponentBase<IBreadcrumbProps, IBreadcrumbState> { 
    oldItems : IBreadcrumbItem[] = [];

    getItemFromIRoute = (route: IRoute) : IBreadcrumbItem => {
        return {
            icon: route.icon ? <route.icon /> : undefined,
            path: route.path,
            title: this.L(route.title),
            routeName: route.name
        };
    }

    getProjectListItem = (isPublic: boolean | undefined, loading: boolean) : IBreadcrumbItem => {
        if(!loading && isPublic != null) {
            return this.getItemFromIRoute(utils.getRouteByName(
                !isPublic ? "myprojects" : "publicprojects"
            ));
        }else{
            return {
                icon: <LoadingOutlined />,
                title: this.L("Projects"), 
                routeName: "loading"
            };
        }  
    }
    getItemByProject = (project: SimpleProjectDto | undefined, loading: boolean) : IBreadcrumbItem => {
        if(!loading && project != null) { 
            return {
                icon: project?.isPublic 
                    ? <ProjectOutlined style={{color:"#1da57a"}}/> 
                    : <LockOutlined style={{color:"orange"}}/>,
                path: this.getPath("project").replace(":id", project.id.toString()),
                title: project.name, 
                routeName: "project"
            };
        }else{ 
            return {
                icon: <LoadingOutlined />,
                title: this.L("Project"), 
                routeName: "loading"
            };
        }  
    }
    getItemByComponent = (component: SimpleComponentDto | undefined, loading: boolean) : IBreadcrumbItem => {
        if(!loading && component != null) { 
            return {
                icon: <AppstoreOutlined style={{color: 'purple'}} />,
                path: this.getPath("component").replace(":id", component.id.toString()),
                title: component.name,
                routeName: "component"
            };
        }else{ 
            return {
                icon: <LoadingOutlined />,
                title: this.L("Component"),
                routeName: "loading"
            };
        }
    }
    getItemByTicket = (ticket: SimpleTicketDto | undefined, loading: boolean) : IBreadcrumbItem => {
        if(!loading && ticket != null) { 
            return {
                icon: TicketInfo.getTypeIcon(ticket.type),
                path: this.getPath("ticket").replace(":id", ticket.id.toString()),
                title: ticket.title,
                routeName: "ticket"
            };
        }else{ 
            return {
                icon: <LoadingOutlined />,
                title: this.L("Ticket"), 
                routeName: "loading"
            };
        }
    }

    getItems = () : IBreadcrumbItem[] => { 
        const items : IBreadcrumbItem[] = [];

        // Stores
        const loadingProject = this.props.projectStore?.loading ?? true;
        const loadingComponent = this.props.componentStore?.loading ?? true;
        const loadingTicket = this.props.ticketStore?.loading ?? true;

        const project = this.props.projectStore?.project; 
        const component = this.props.componentStore?.component;
        const ticket = this.props.ticketStore?.ticket;

        // Find the route
        const currentRoute = utils.getRoute(this.props.history.location.pathname); 
        switch(currentRoute.name){
            case "project": {
                const idx = this.oldItems.findIndex(x => x.routeName === "myprojects" || x.routeName === "publicprojects"); 
                if(idx !== -1 && (loadingProject || project == null)){
                    items.push(...this.oldItems.slice(0, idx + 1));
                }else{
                    items.push(this.getProjectListItem(project?.isPublic, loadingProject)); 
                } 
                items.push(this.getItemByProject(project, loadingProject)); 
                break;
            }
            case "component": {
                const idx = this.oldItems.findIndex(x => x.routeName === "project"); 
                if(idx !== -1 && (loadingComponent || component == null)){
                    items.push(...this.oldItems.slice(0, idx + 1));
                }else{
                    items.push(this.getProjectListItem(component?.project?.isPublic, loadingComponent));
                    items.push(this.getItemByProject(component?.project, loadingComponent)); 
                } 
                items.push(this.getItemByComponent(component, loadingComponent)); 
                break;
            }
            case "ticket": {
                const idx = this.oldItems.findIndex(x => x.routeName === "component");
                if(idx !== -1 && (loadingTicket || ticket == null)){
                    items.push(...this.oldItems.slice(0, idx + 1));
                }else{
                    items.push(this.getProjectListItem(ticket?.project?.isPublic, loadingTicket));
                    items.push(this.getItemByProject(ticket?.project, loadingTicket)); 
                    items.push(this.getItemByComponent(ticket?.component, loadingTicket)); 
                } 
                items.push(this.getItemByTicket(ticket, loadingTicket)); 
                break;
            }
            default: {
                if(currentRoute.path !== "/"){
                    items.push(this.getItemFromIRoute(currentRoute));
                }
                break;
            }
        }
        return items;
    }
    render() {
        const items = this.getItems();
        this.oldItems = items;
        
        return ( 
            <AntdBreadcrumb  
                style={{margin: '0 0 15px 10px'}}
            >
                <AntdBreadcrumb.Item>
                    <Link to="/">
                        <Space>
                            <HomeOutlined />
                            {items.length === 0 
                                ? <span>{this.L('Home')}</span>
                                : <></>
                            }
                        </Space>
                    </Link>
                </AntdBreadcrumb.Item> 
                {items.map((x: IBreadcrumbItem, i: number) => 
                    <AntdBreadcrumb.Item key={i}> 
                        <Link to={x.path ?? "#"}>
                            <Space>
                                {x.icon != null ? x.icon : <></>}
                                <span>{x.title}</span> 
                            </Space>
                        </Link>
                    </AntdBreadcrumb.Item> 
                )}
            </AntdBreadcrumb> 
        );
    }
}

export default Breadcrumb;
