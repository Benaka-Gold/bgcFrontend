import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Collapse } from "@mui/material";
import { ArrowDropDownCircleOutlined } from "@mui/icons-material";
import Appbar from "./Appbar";

export default function Navbar({ data }) {
  const drawWidth = 240;
  const benakaLogo = "/logo/benakaLogo.png";
  const [mobileViewOpen, setMobileViewOpen] = useState(false);
  const [open, setOpen] = useState({});
  const [activeItem, setActiveItem] = useState("Dashboard");
  const location = useLocation();

  useEffect(() => {
    // Set the active item based on the current location
    data.forEach((item) => {
      if (item.link === location.pathname) {
        setActiveItem(item.name);
      }
    });
  }, [location, data]);

  const handleToggle = () => {
    setMobileViewOpen(!mobileViewOpen);
  };

  const handleSubMenuToggle = (name) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [name]: !prevOpen[name],
    }));
    setMobileViewOpen(false);
  };

  const handleItemClick = (name) => {
    setActiveItem(name);
  };

  const responsiveDrawer = (
    <div style={{ backgroundColor: "rgb(32,33,35)", height: "100%", fontFamily: 'Poppins, sans-serif' }}>
      <img
        src={benakaLogo}
        style={{ width: "120px", p: 2 }}
        alt="Benaka logo"
      />

      <Divider />
      <List>
        {data.map((item, index) => (
          <div key={index}>
            <Link
              to={item.link || "#"}
              style={{ textDecoration: "none", color: "white" }}
            >
              <ListItemButton
                sx={{
                  color: activeItem === item.name ? "white" : "inherit",
                  fontWeight: activeItem === item.name ? "bold" : "inherit",
                  backgroundColor: activeItem === item.name && "#343541" ,
                  borderRadius: "4px",
                  width: "93%",
                  marginLeft: "10px",
                  marginRight:"10px"
                }}
                onClick={() => {
                  handleSubMenuToggle(item.name);
                  handleItemClick(item.name);
                }}
              >
                <ListItemIcon sx={{ color: activeItem === item.name ? "#ecece6" : "#ecece6" }}>
                  {React.cloneElement(item.icon)}
                </ListItemIcon>
                <ListItemText primary={item.name} />
                {item.children && (
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleSubMenuToggle(item.name)}
                  >
                    <ArrowDropDownCircleOutlined htmlColor="white" />
                  </IconButton>
                )}
              </ListItemButton>
            </Link>
            {item.children && (
              <Collapse in={open[item.name]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child, childIndex) => (
                    <Link
                      to={child.link}
                      key={childIndex}
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      <ListItemButton
                        sx={{
                          color: "white",
                          pl: 4,
                        }}
                      >
                        <ListItemIcon sx={{ color: "white" }}>
                          {React.cloneElement(child.icon)}
                        </ListItemIcon>
                        <ListItemText primary={child.name} />
                      </ListItemButton>
                    </Link>
                  ))}
                </List>
              </Collapse>
            )}
          </div>
        ))}
      </List>
    </div>
  );

  // ...

  const container =
    window !== undefined ? () => window.document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Box
        component="nav"
        sx={{
          width: { sm: drawWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileViewOpen}
          onClose={handleToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawWidth },
          }}
        >
          {responsiveDrawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawWidth },
          }}
          open
        >
          {responsiveDrawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{
        flexGrow: 1,
        width: { sm: `calc(100% - ${drawWidth}px)` },
      }}>
        <Appbar handleToggle={handleToggle} />
        <Box sx={{mt : 1}}>
        <Outlet />
          
        </Box>
      </Box>
    </Box>
  );
}
