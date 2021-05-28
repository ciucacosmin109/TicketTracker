import { Card } from 'antd';
import React from 'react';
import { Tooltip,  ResponsiveContainer, BarChart, Bar, YAxis, XAxis, CartesianGrid, } from 'recharts';

import AppComponentBase from '../../../components/AppComponentBase';   
import { TicketDto } from '../../../services/ticket/dto/ticketDto';
import { TicketPriority } from '../../../services/ticket/dto/ticketPriority'; 

export interface ITicketPriorityChartProps { 
    tickets: TicketDto[];
}
 
class TicketPriorityChart extends AppComponentBase<ITicketPriorityChartProps> {
    render(){
		const tickets = this.props.tickets; 
		const data = [
			{ 
				name: this.L(TicketPriority[TicketPriority.NONE]), 
				y: tickets.filter(x => x.priority === TicketPriority.NONE).length,
				fill: "lightgray",
			},
			{ 
				name: this.L(TicketPriority[TicketPriority.VERY_LOW]), 
				y: tickets.filter(x => x.priority === TicketPriority.VERY_LOW).length,
				fill: "yellowgreen",
			},
			{ 
				name: this.L(TicketPriority[TicketPriority.LOW]), 
				y: tickets.filter(x => x.priority === TicketPriority.LOW).length,
				fill: "forestgreen",
			},
			{ 
				name: this.L(TicketPriority[TicketPriority.MEDIUM]), 
				y: tickets.filter(x => x.priority === TicketPriority.MEDIUM).length,
				fill: "steelblue",
			},
			{ 
				name: this.L(TicketPriority[TicketPriority.HIGH]), 
				y: tickets.filter(x => x.priority === TicketPriority.HIGH).length,
				fill: "goldenrod",
			},
			{ 
				name: this.L(TicketPriority[TicketPriority.VERY_HIGH]), 
				y: tickets.filter(x => x.priority === TicketPriority.VERY_HIGH).length,
				fill: "indianred",
			},
		];
        return ( 
			<Card 
				type="inner" 
				size="small" 
				title={this.L("TicketPriorities")} >

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
 
export default TicketPriorityChart;