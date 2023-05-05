import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import './style/rule.css';
import { useParams } from 'react-router-dom';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import Footer from "examples/Footer";
import MDAvatar from "components/MDAvatar";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField  from "@mui/material/TextField";
import backgroundImage from "assets/images/bg-profile.jpeg";
import burceMars from "assets/images/bruce-mars.jpg";
import { rules } from "eslint-config-prettier";
import JSON from "json5";
import DataTable from "examples/Tables/DataTable";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Autocomplete } from "@mui/material";
import { FileUploader } from "react-drag-drop-files";
import {saveAs} from "file-saver";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import PageLayout from "examples/LayoutContainers/PageLayout";
import Cookies from 'universal-cookie';
// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

import MuiLink from "@mui/material/Link";
import MDButton from "@mui/material/Button"

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components

import MDInput from "components/MDInput";
import {setAuthenticated, setPermissions, useMaterialUIController} from "context";

export const Login = (props) => {
    const [username, setUsername] = useState('');
    const [pass, setPass] = useState('');
    const cookies = new Cookies();
    if (cookies.get('authenticated') === undefined) {
        cookies.set('authenticated', false, { path: '/' });
    }
    function login() {
        let user = {
            username: username,
            password: pass
        }
        fetch('http://localhost:8000/Login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(user).replaceAll(/([a-zA-Z0-9_.]+):/g, "\"$1\":").replaceAll(/:'([a-zA-Z0-9_.]+)'/g, ":\"$1\"")
            }).then(res => res.json())
                .then(data => {
                    if(data.worked == true) {
                        cookies.set('authenticated', true, { path: '/' });
                        
                        cookies.set('permissions', data.permissions, { path: '/' });
                        window.location.reload(false);
                        return true;
                    } else {
                        return false;
                    }})
    }
    
    if (cookies.get('authenticated') != undefined && cookies.get('authenticated') == 'true') {
      console.log('test')
        return <Navigate to="/dashboard" />;
    } else {
    return (
    <PageLayout>
      <MDBox
        position="absolute"
        width="100%"
        minHeight="100vh"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            bgImage &&
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <MDBox px={1} width="100%" height="100vh" mx="auto">
        <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
          <Card>
            <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
            mx={2}
            mt={-3}
            p={2}
            mb={1}
            textAlign="center"
            >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                Sign in
            </MDTypography>
            
            </MDBox>
            <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form">
                <MDBox mb={2}>
                    <TextField type="email" onChange={(e) => setUsername(e.target.value)} variant="outlined" fullWidth label={"Username"} />
                </MDBox>
                <MDBox mb={2}>
                    <TextField type="password" onChange={(e) => setPass(e.target.value)} variant="outlined" fullWidth label={"Password"} />
                </MDBox>
                <MDBox display="flex" alignItems="center" ml={-1}>
                
                
                </MDBox>
                <MDBox mt={4} mb={1}>
                <Button variant="gradient" onClick={(e) => login()} color="info" fullWidth>
                    sign in
                </Button>
                </MDBox>
                <MDBox mt={3} mb={1} textAlign="center">
               
                </MDBox>
            </MDBox>
            </MDBox>
        </Card>
          </Grid>
        </Grid>
      </MDBox>
    </PageLayout>
    )}
}

export default Login;