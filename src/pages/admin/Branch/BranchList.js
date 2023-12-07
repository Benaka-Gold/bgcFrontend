import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, IconButton, Typography, Button } from "@mui/material";
import {
  AddOutlined,
  DeleteOutlineOutlined,
  EditOutlined,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import Loader from "../../../components/Loader";
import {  getBranches,deleteBranch } from "../../../apis/branch";
import BranchDialog from "../../../components/Branch/BranchForm";
import { Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions } from "@mui/material";

const BranchList = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [branch, setBranch] = useState({});
  const [loading, setLoading] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchBranches();
    setTimeout(() => setLoading(false), 500);
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await getBranches();
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching Branches:", error);
    }
  };

  const handleDelete = async (id) => {
    setBranchToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (branchToDelete) {
      setLoading(true)
      const res = await deleteBranch(branchToDelete)
      if(res.status === 200){
        alert("Branch Deleted Successfully")
      }
      else {
        alert("Error deleting branch")
      }
      await fetchBranches();
    }
    setDeleteDialogOpen(false);
    setBranchToDelete(null);
    setLoading(false)
  };

  const columns = [
    { field: "branchName", headerName: "Branch Name", flex: 1 },
    { field: "goldStock", headerName: "Current Gold Stock", flex: 1 },
    {
      field: "goldMovementThreshold",
      headerName: "Gold Movement Limit",
      flex: 1,
    },
    {
      field: "action",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              color="primary"
              onClick={() => {
                setOpen(true);
                setBranch(params.row);
              }}
            >
              <EditOutlined />
            </IconButton>
            <IconButton
              sx={{ color: "red" }}
              onClick={() => handleDelete(params.row._id)}
            >
              <DeleteOutlineOutlined />
            </IconButton>
          </Box>
        );
      },
    },
    // Add more columns as needed
  ];

  return (
    <Box
      sx={{
        ml: { md: "240px", sm: "240px", xs: "0px", lg: "240px" },
        p: 3,
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#f7f7f8",
        height: "90vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          m: 1,
          mt: 0,
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: grey[800],
            fontFamily: "Poppins, sans-serif",
            textAlign: "left",
          }}
        >
          Branches
        </Typography>
        <Button
          variant="contained"
          onClick={(e) => {
            e.preventDefault();
            setOpen(!open);
            setBranch(null);
          }}
        >
          <AddOutlined />
          Add
        </Button>
      </Box>
      <Box sx={{ minHeight: "30vh", maxHeight: "85vh" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row._id}
          sx={{
            boxShadow: 4,
            backgroundColor: grey[50],
            fontFamily: "Poppins, sans-serif",
            borderRadius: 2,
            minHeight: "3vh",
          }}
        />
      </Box>
      <BranchDialog
        open={open}
        branchData={branch}
        handleClose={async () => {
          setLoading(true);
          setOpen(!open);
          await fetchBranches();
          setLoading(false);
        }}
        saveBranch={async () => {
          await fetchBranches();
        }}
      />
      <Loader loading={loading} />
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Branch</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this branch?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BranchList;
