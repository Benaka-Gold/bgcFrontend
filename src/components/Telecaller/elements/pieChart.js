import  React, {useEffect, useState} from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import {  getLeadsByTeam } from '../../../apis/leadsApi';


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
    teamLeadsData?.forEach(item => {
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
          innerRadius: 70,
          outerRadius: 120,
        },
      ]}
      height={300}
      slotProps={{
        legend: { hidden: true },
      }}
      sx={{ml:9}}
    />
  );
}