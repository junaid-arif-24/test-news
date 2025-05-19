import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Box,
  IconButton,
  AppBar,
  Toolbar,
  CssBaseline,
  ListItemButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CreateIcon from "@mui/icons-material/Create";
import ArticleIcon from "@mui/icons-material/Article";
import CategoryIcon from "@mui/icons-material/Category";
import CommentIcon from "@mui/icons-material/Comment";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WidgetsIcon from "@mui/icons-material/Widgets";
import {useMediaQuery} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";

export interface AdminRouteProps {
  children: React.ReactNode;
}

const drawerWidth = 240;

const AdminDashboard: React.FC<AdminRouteProps> = ({children}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

const drawerItems = [
  {text: "user Profile", path:"/admin/profile", icon: <PersonIcon /> },
  {
    text: " Create News", path : "/admin/create-news" , icon : <CreateIcon />
  },
  {
    text: "Manage News", path : "/admin/manage-news", icon: <ArticleIcon />
  },
  {
    text: " Manage Category" ,path:"/admin/manage-category", icon: <CategoryIcon /> 
  },
  {
    text:"Manage Comments", path: "/admin/manage-comments" , icon: <CommentIcon /> 
  },
  {
    text: " All Users" , path: "/admin/all-users" , icon : <PeopleAltIcon /> 
  }
];


const drawerContent = (

  <Box sx={{width: drawerWidth}} role="presentation">
    <div className="text-2xl flex justify-center items-center font-bold bg-black py-4 text-white cursor-pointer"
    onClick={()=>navigate("/")}
    >
      Shot News
    </div>
    <List sx={{p:0, borderTop:"1px solid white"}}>
      {
        drawerItems.map((item)=>(
          <React.Fragment key={item.text}>
            <ListItem>

            <ListItemButton  selected={location.pathname === item.path} onClick={()=>navigate(item.path)} sx={{
              "& .Mui-selected":{
                backgroundColor: "black",
                color:"white",
                "& .MuiListItemIcon-root" :{ color:"white"},
              },
              "&:hover" : {backgroundColor : "rgba(0,0,0,0.1)"},
            }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text}/>

            </ListItemButton>

            </ListItem>
            

          </React.Fragment>
        ))
      }

    </List>

  </Box>
)

  return <div className="flex bg-gray-100 min-h-screen">
    <CssBaseline /> 
    {
      isSmallScreen ? (
        <>
        <AppBar >
          <Toolbar>
            <IconButton>
              <WidgetsIcon /> 
            </IconButton>
          </Toolbar>
        </AppBar>

        <Drawer >
          {drawerContent}
        </Drawer>
        
        </>
      ):
      (
        <Drawer>
          {drawerContent}
        </Drawer>
      )
    }

    <main className="w-full">
      {children}
    </main>


  </div>;
};

export default AdminDashboard;
