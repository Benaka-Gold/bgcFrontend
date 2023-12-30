import { Box, Typography,Button } from "@mui/material";
import React from "react";

export default function notFound(){
    return(
        <Box sx={{display : 'flex',justifyContent : 'center'}}>
            <Box >
                <img src="/logo/benakaLogo.png" width={150} height={150}/>
            </Box>
            <Box>
                <Typography variant="h1">404! Not Found</Typography>

            </Box>
            <Box>
                <Button variant={'contained'} color="primary">Back to Main Page</Button>
            </Box>
        </Box>
      
    )
}