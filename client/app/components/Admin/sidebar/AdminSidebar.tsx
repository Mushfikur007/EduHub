"use client";
import { FC, useEffect, useState } from "react";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography, Divider } from "@mui/material";
import {
  HomeOutlinedIcon,
  ArrowForwardIosIcon,
  ArrowBackIosIcon,
  PeopleOutlinedIcon,
  ReceiptOutlinedIcon,
  BarChartOutlinedIcon,
  MapOutlinedIcon,
  GroupsIcon,
  OndemandVideoIcon,
  VideoCallIcon,
  WebIcon,
  QuizIcon,
  WysiwygIcon,
  ManageHistoryIcon,
  SettingsIcon,
  ExitToAppIcon,
} from "./Icon";
import avatarDefault from "../../../../public/assests/avatar.png";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

interface itemProps {
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: any;
}

const Item: FC<itemProps> = ({ title, to, icon, selected, setSelected }) => {
  return (
    <ListItem
      button
      selected={selected === title}
      onClick={() => setSelected(title)}
      component={Link}
      href={to}
      sx={{
        '&.Mui-selected': {
          backgroundColor: 'rgba(104, 112, 250, 0.1)',
          '&:hover': {
            backgroundColor: 'rgba(104, 112, 250, 0.2)',
          },
        },
      }}
    >
      <ListItemIcon sx={{ color: '#45CBA0' }}>{icon}</ListItemIcon>
      <ListItemText primary={title} />
    </ListItem>
  );
};

const Sidebar = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [logout, setlogout] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  const logoutHandler = () => {
    setlogout(true);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? 64 : 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isCollapsed ? 64 : 240,
          boxSizing: 'border-box',
          backgroundColor: theme === 'dark' ? '#111C43' : '#fff',
          color: theme === 'dark' ? '#fff' : '#000',
          transition: 'width 0.2s ease-in-out',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', height: '100%' }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {!isCollapsed && (
            <Link href="/" className="block">
              <h3 className="text-[25px] font-Poppins uppercase dark:text-white text-black">
                EduHub
              </h3>
            </Link>
          )}
          <IconButton onClick={() => setIsCollapsed(!isCollapsed)} sx={{ color: '#45CBA0' }}>
            {isCollapsed ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon />}
          </IconButton>
        </Box>

        {!isCollapsed && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Image
              alt="profile-user"
              width={100}
              height={100}
              src={user.avatar ? user.avatar.url : avatarDefault}
              style={{
                cursor: "pointer",
                borderRadius: "50%",
                border: "3px solid #45CBA0",
              }}
            />
            <Typography variant="h6" sx={{ mt: 2 }}>
              {user?.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#45CBA0', fontWeight: 'bold' }}>
              {user?.role}
            </Typography>
          </Box>
        )}

        <List>
          <Item
            title="Dashboard"
            to="/admin"
            icon={<HomeOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: '#45CBA0' }}>
            {!isCollapsed && "Data"}
          </Typography>
          <Item
            title="Users"
            to="/admin/users"
            icon={<GroupsIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Invoices"
            to="/admin/invoices"
            icon={<ReceiptOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: '#45CBA0' }}>
            {!isCollapsed && "Content"}
          </Typography>
          <Item
            title="Create Course"
            to="/admin/create-course"
            icon={<VideoCallIcon />}
            selected={selected}
            setSelected={setSelected}
          />

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: '#45CBA0' }}>
            {!isCollapsed && "Customization"}
          </Typography>
          <Item
            title="Hero"
            to="/admin/hero"
            icon={<WebIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="FAQ"
            to="/admin/faq"
            icon={<QuizIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Categories"
            to="/admin/categories"
            icon={<WysiwygIcon />}
            selected={selected}
            setSelected={setSelected}
          />

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: '#45CBA0' }}>
            {!isCollapsed && "Controllers"}
          </Typography>
          <Item
            title="Manage Team"
            to="/admin/team"
            icon={<PeopleOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: '#45CBA0' }}>
            {!isCollapsed && "Analytics"}
          </Typography>
          <Item
            title="Courses Analytics"
            to="/admin/courses-analytics"
            icon={<BarChartOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Orders Analytics"
            to="/admin/orders-analytics"
            icon={<MapOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Users Analytics"
            to="/admin/users-analytics"
            icon={<ManageHistoryIcon />}
            selected={selected}
            setSelected={setSelected}
          />

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: '#45CBA0' }}>
            {!isCollapsed && "Extras"}
          </Typography>
          <Item
            title="Go Home"
            to="/"
            icon={<HomeOutlinedIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <ListItem button onClick={logoutHandler}>
            <ListItemIcon sx={{ color: '#45CBA0' }}>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
