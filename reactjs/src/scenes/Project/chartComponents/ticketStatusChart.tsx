import { Card } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Tooltip,  ResponsiveContainer, BarChart, Bar, YAxis, XAxis, CartesianGrid, } from 'recharts';

import AppComponentBase from '../../../components/AppComponentBase';    
import { TicketDto } from '../../../services/ticket/dto/ticketDto'; 
import StatusStore from '../../../stores/statusStore';
import Stores from '../../../stores/storeIdentifier';

export interface ITicketStatusChartProps { 
	statusStore?: StatusStore;

    tickets: TicketDto[];
}

@inject(Stores.StatusStore)
@observer
class TicketStatusChart extends AppComponentBase<ITicketStatusChartProps> {
	async componentDidMount() {
		await this.props.statusStore?.getAll();
	}
	
    static getStatusColor = (status: { name: string|undefined } | undefined) => {
        switch(status?.name){ 
            case "New": return "steelblue";
            case "In development": return "yellowgreen";
            case "In development (reopened)": return "goldenrod";
            case "Solved": return "forestgreen";
            case "Closed": return "indianred";
            default: return "lightgray";
        }
    }

    render(){
		const statuses = this.props.statusStore?.statuses?.items ?? [];
		const tickets = this.props.tickets; 

		let data = [];
		for(let s of statuses){
			data.push({
				name: this.L(s.name), 
				y: tickets.filter(x => x.status?.name === s.name).length,
				fill: TicketStatusChart.getStatusColor(s),
			});
		} 

        return ( 
			<Card 
				type="inner" 
				size="small" 
				title={this.L("TicketStatuses")} >

				<ResponsiveContainer width={"100%"} height={200}> 
					<BarChart data={data} >
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" />
						<YAxis />
						<Tooltip /> 
						<Bar isAnimationActive={false} dataKey="y" /> 
					</BarChart>
				</ResponsiveContainer>
			</Card>
        ); 
    }
}
 
export default TicketStatusChart;