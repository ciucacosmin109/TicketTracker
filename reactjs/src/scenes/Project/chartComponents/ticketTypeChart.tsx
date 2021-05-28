import { Card } from 'antd';
import React from 'react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, } from 'recharts';

import AppComponentBase from '../../../components/AppComponentBase';   
import { TicketDto } from '../../../services/ticket/dto/ticketDto';
import { TicketType } from '../../../services/ticket/dto/ticketType';

export interface ITicketTypeChartProps { 
    tickets: TicketDto[];
}
 
class TicketTypeChart extends AppComponentBase<ITicketTypeChartProps> {
    render(){
		const tickets = this.props.tickets; 
		const data = [
			{ 
				name: this.L(TicketType[TicketType.OTHER]), 
				value: tickets.filter(x => x.type === TicketType.OTHER).length,
				fill: "goldenrod",
			},
			{ 
				name: this.L(TicketType[TicketType.BUG]), 
				value: tickets.filter(x => x.type === TicketType.BUG).length,
				fill: "indianred",
			},
			{ 
				name: this.L(TicketType[TicketType.FEATURE]), 
				value: tickets.filter(x => x.type === TicketType.FEATURE).length,
				fill: "forestgreen",
			},
		];
        return ( 
			<Card 
				type="inner" 
				size="small" 
				title={this.L("TicketTypes")} >  

				<ResponsiveContainer width={"100%"} height={200}>
					<PieChart>
						<Pie 
							dataKey="value" 
							data={data} 
							cx="50%" cy="50%" 
							innerRadius="40%"
							outerRadius="60%" 
							isAnimationActive={false} 
							label={true} 
							labelLine={false}
						/>
						<Legend /> 
						<Tooltip />
					</PieChart>
				</ResponsiveContainer>
			</Card>
        ); 
    }
}
 
export default TicketTypeChart;