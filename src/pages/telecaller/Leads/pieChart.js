import  React, {useEffect, useState} from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import {  getLeadsByTeam } from '../../../apis/leadsApi';


const data = [
  { label: 'Group A', value: 2400 },
  { label: 'Group B', value: 4567 },
  { label: 'Group C', value: 1398 },
  { label: 'Group D', value: 9800 },
  { label: 'Group E', value: 3908 },
  { label: 'Group F', value: 4800 },
];

export default function TwoSimplePieChart() {
  const [teamLeadsData, setTeamLeadsData] = useState([])
  const [displayPie, setDispayPie] = useState([])
  const items = JSON.parse(localStorage.getItem('user'));


  const fetchData = async () => {
    try {
      let newVar = await getLeadsByTeam(items.teamId);
      setTeamLeadsData(newVar.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(()=>{
    fetchData()
  },[])


  function summarizeLeads() {
    const summary = new Map();
    teamLeadsData.forEach(item => {
      const label = item.assignedTo && item.assignedTo.name ? item.assignedTo.name : 'Unassigned';
      summary.set(label, (summary.get(label) || 0) + 1);
    });
    const output = Array.from(summary, ([label, value]) => ({ label, value }));
    return output;
  }
  
useEffect(()=>{
 let data = summarizeLeads()
 setDispayPie(data)
}, [teamLeadsData])

  return (
    <PieChart
      series={[
        {
          data: displayPie,
          cx: 500,
          cy: 200,
          innerRadius: 40,
          outerRadius: 80,
        },
      ]}
      height={300}
      slotProps={{
        legend: { hidden: true },
      }}
    />
  );
}