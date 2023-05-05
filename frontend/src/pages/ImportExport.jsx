import React, { useEffect, useState } from "react";
import './style/rule.css';
import { Navigate} from 'react-router-dom';
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
import Cookies from 'universal-cookie';
function ImportExport() {
  const [file, setFile] = useState(null);
  const cookies = new Cookies();
  const handleChange = (file) => {
    setFile(file);
  };
  function uploadFile() {
    const data = new FormData()
    data.append('file', file)
    fetch('http://localhost:8000/Import/rules/', {
      method: 'POST',
      body: data
    }).then((response) => {
      console.log(response)
    });
  }

  function downloadFile(type) {
    if (type === "rules") {
      fetch('http://localhost:8000/Export/rules/', {
        method: 'GET',
        contentType: "text/csv",
        responseType: 'blob'
      }).then((response) => {
        response.blob().then(blob => {
          saveAs(blob, "rules.csv");})
      });
    } else if (type === "buckets") {
      fetch('http://localhost:8000/Export/buckets/', {
        method: 'GET',
        contentType: "text/csv",
        responseType: 'blob'
      }).then((response) => {
        response.blob().then(blob => {
          saveAs(blob, "buckets.csv");})
      });
    }
  }
  const fileTypes = ["CSV"];
  if (cookies.get('authenticated') != "true") {
    return <Navigate to="/login" />;
  } else {
  return (
      <DashboardLayout>
          <DashboardNavbar />

          <MDBox position="relative" mb={5} >
              
              <Card
                      sx={{
                      position: "relative",
                      mt: 0,
                      mx: 3,
                      py: 2,
                      px: 2,
                      }}
              >
                  <Grid container spacing={3} alignItems="center">
                    <Grid item>
                      Upload Config Files
                    </Grid>
                  </Grid>
                  <MDBox mt={5} mb={3} >
                    <Grid container spacing={1}>
                    <Grid item xs={12} md={6} lg={4}>
                      <MDBox>
                      <MDBox display="flex"  pr={2}>
                        <Grid item>
                          <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
                        </Grid>
                      </MDBox>
                      </MDBox>
                      <MDBox>
                      <MDBox display="flex"  my={1} pr={2}>
                        <Grid item>
                          <Button variant="contained" color="text" onClick={uploadFile}>Upload</Button>
                        </Grid>
                      </MDBox>
                      </MDBox>
                    </Grid>
                    </Grid>
                  </MDBox>

                  <Grid container spacing={3} alignItems="center">
                    <Grid item>
                      Download Config Files
                    </Grid>
                  </Grid>
                  <MDBox mt={5} mb={3} >
                    <Grid container spacing={1}>
                    <Grid item xs={12} md={6} lg={4}>
                      <MDBox>
                      <MDBox display="flex"  pr={2}>
                        <Grid item>
                          <Button variant="contained" color="text" onClick={(e) => downloadFile('rules')}>Download Rules</Button>
                          <Button variant="contained" color="text" onClick={(e) => downloadFile('buckets')}>Download Buckets</Button>
                        </Grid>
                      </MDBox>
                      </MDBox>
                    </Grid>
                    </Grid>
                  </MDBox>
                  
              </Card>
          </MDBox>
      </DashboardLayout>
  )}
  
}
export default ImportExport;

   

  