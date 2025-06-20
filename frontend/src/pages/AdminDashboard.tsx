import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CssBaseline,
  Toolbar,
  Divider,
  Box,
  IconButton,
  AppBar,
  ListItemButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CreateIcon from "@mui/icons-material/Create";
import ArticleIcon from "@mui/icons-material/Article";
import CategoryIcon from "@mui/icons-material/Category";
import CommentIcon from "@mui/icons-material/Comment";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import {  useLocation, useNavigate } from "react-router-dom";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import WidgetsIcon from "@mui/icons-material/Widgets";
export interface AdminRouteProps {
  children: React.ReactNode;
}

const drawerWidth = 240;

const AdminDashboard: React.FC<AdminRouteProps> = ({children}) => {
  const location = useLocation(); // Hook to get current route
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Define your drawer items and paths
  const drawerItems = [
    { text: "User Profile", path: "/admin/profile", icon: <PersonIcon /> },
    { text: "Create News", path: "/admin/create-news", icon: <CreateIcon /> },
    { text: "Manage News", path: "/admin/manage-news", icon: <ArticleIcon /> },
    { text: "Manage Category", path: "/admin/manage-category", icon: <CategoryIcon /> },
    { text: "Manage Comments", path: "/admin/manage-comments", icon: <CommentIcon /> },
    { text: "All Users", path: "/admin/all-users", icon: <PeopleAltIcon /> },
  ];

  const drawerContent = (
    <Box sx={{ width: drawerWidth }} role="presentation">
      <div className="text-2xl flex justify-around items-center font-bold bg-black py-4">
        <p onClick={() => navigate("/")} className="text-white cursor-pointer">
          Shot News
        </p>
      </div>
      <List 
      sx={{padding:"0px", borderTop: "1px solid white"}}>
        {drawerItems.map((item, index) => (
          <React.Fragment key={item.text}>
            <ListItem>
            <ListItemButton
              
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path} // Highlight selected item
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "black", // Black background for selected item
                  color: "white", // White text for selected item
                  "& .MuiListItemIcon-root": {
                    color: "white", // White icon color for selected item
                  },
                  "&:hover": {
                    backgroundColor: "black", // Disable hover effect on selected item
                  },
                },
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.1)", // Hover effect for non-selected items
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
            </ListItem>
            
            {index !== drawerItems.length - 1 && <Divider />} {/* Divider between items */}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <CssBaseline />
      {isSmallScreen ? (
        <>
          <AppBar
            position="absolute"
            sx={{
              width: "50px",
              backgroundColor: "black",
              marginRight: "10px",
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <WidgetsIcon sx={{ color: "white", fontSize: "30px", marginTop: "0px", }} />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};

export default AdminDashboard;
