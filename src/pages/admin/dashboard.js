import { Box } from '@mui/material'
import React from 'react'
import Loader from '../../components/Loader'
const Dashboard = () => {
  const [loading,setLoading] = React.useState(false)
  React.useEffect(()=>{
    setLoading(true)
    setTimeout(()=>setLoading(false),500)
  },[])
  return (
    <div>
      <Box >
        Dashboard
      </Box>
      <Loader loading={loading}/>
    </div>

  )
}

export default Dashboard