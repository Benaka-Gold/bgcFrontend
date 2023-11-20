import React, { useEffect, useState } from "react";
import { getLeadByUser } from "../../../apis/leadsApi";
import { Button, Box, ButtonGroup } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {TextField} from "@mui/material";
import {Dialog, DialogActions, DialogTitle, DialogContent} from "@mui/material";

function CustomeFilter({ customeRow, setDisplay,setLoading }) {
  const [allLeads, setAllLeads] = useState([]);
  const [copyLeads, setCopyLeads] = useState([]);
  const [activeFilter, setActiveFilter] = useState("today");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
   const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    async function leadsById() {
      const payload = {
        userId: customeRow[0],
      };
      const response = await getLeadByUser(payload);
      if (response.success) {
        const todayFilteredLeads = filterByDate(response.data, "today");
        setAllLeads(todayFilteredLeads);
        setCopyLeads(response.data);
        setActiveFilter("today"); 
      } else {
        alert("Something went wrong. Please Try again");
      }
    }

    leadsById();
  }, [customeRow]);

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "source", headerName: "Source", flex: 1 },
    { field: "weight", headerName: "Weight", flex: 1 },
  ];

  function filterByDate(records, period) {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    now.setDate(now.getDate() + now.getDay());

    return records.filter((record) => {
      const updatedAt = new Date(record.updatedAt);

      switch (period) {
        case "today":
          return updatedAt >= startOfDay;
        case "thisWeek":
          return updatedAt >= startOfWeek;
        case "thisMonth":
          return updatedAt >= startOfMonth;
        default:
          return true;
      }
    });
  }

  function filterByCustomDate(records, fromDate, toDate) {
    const from = new Date(fromDate).setHours(0, 0, 0, 0);
    const to = new Date(toDate).setHours(23, 59, 59, 999);
    
    return records.filter((record) => {
      const updatedAt = new Date(record.updatedAt);
      return updatedAt >= from && updatedAt <= to;
    });
  }

  const handleCustomDateFilter = () => {
    if (fromDate && toDate) {
      const filteredLeads = filterByCustomDate(copyLeads, fromDate, toDate);
      setAllLeads(filteredLeads);
    }
  };

  const handleFilterClick = (filterType) => {
    const filteredLeads = filterByDate(copyLeads, filterType);
    setAllLeads(filteredLeads);
    setActiveFilter(filterType); 
  };
  const handleCustomFilterOpen = () => {
    setActiveFilter("custom")
    setOpenDialog(true);
  };
  console.log(activeFilter);
  const handleCustomFilterApply = () => {
    handleCustomDateFilter();
    setOpenDialog(false);
  };

  const handleCustomFilterClose = () => {
    setOpenDialog(false);
  };
  const handleBack=()=>{
    setLoading(true)
    setTimeout(()=>{
      setDisplay(true)
      setLoading(false)
    },250)
  }

  return (
    <Box sx={{ width: "100%", height: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", m: 2 }}>
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
          <Button onClick={handleBack}>Back</Button>
        </ButtonGroup>

        <ButtonGroup variant="contained" aria-label="outlined primary button group">
          <Button
            onClick={() => handleFilterClick("today")}
            color={activeFilter === "today" ? "primary" : "inherit"}
          >
            Today
          </Button>
          <Button
            onClick={() => handleFilterClick("thisWeek")}
            color={activeFilter === "thisWeek" ? "primary" : "inherit"}
          >
            This Week
          </Button>
          <Button
            onClick={() => handleFilterClick("thisMonth")}
            color={activeFilter === "thisMonth" ? "primary" : "inherit"}
          >
            This Month
          </Button>
          <Button onClick={handleCustomFilterOpen} color={activeFilter === "custom" ? "primary" : "inherit"}>
        Custom Date
      </Button>
        </ButtonGroup>

      
      </Box>

      <Dialog open={openDialog} onClose={handleCustomFilterClose} >
        <DialogTitle sx={{textAlign:"center"}}>Filter by Date</DialogTitle>
        <DialogContent  >
          <TextField
            label="From"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{m:2}}
          />
          <TextField
            label="To"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{m:2}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCustomFilterClose}>Cancel</Button>
          <Button onClick={handleCustomFilterApply}>Submit</Button>
        </DialogActions>
      </Dialog>

      <DataGrid
        columns={columns}
        rows={allLeads}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        autoHeight
        pageSizeOptions={[5, 10, 15]}
        getRowId={(row) => row._id}
        sx={{
          fontFamily: "Poppins, sans-serif",
          boxShadow: "2px 2px 2px 2px rgb(222,226,230)",
          backgroundColor: "white",
          m: 2,
        }}
      />
    </Box>
  );
}

export default CustomeFilter;
