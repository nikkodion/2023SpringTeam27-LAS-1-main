import React, { useEffect, useState } from "react";
import './style/rule.css';
import { useParams, Navigate } from 'react-router-dom';
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
import Cookies from 'universal-cookie';

import maplibregl from 'maplibre-gl';
import {Map} from "react-map-gl";
import DeckGL from '@deck.gl/react';
import {ScatterplotLayer} from '@deck.gl/layers';
import {HeatmapLayer} from '@deck.gl/aggregation-layers';
function Bucket() {
    const cookies = new Cookies();
    const [tabsOrientation, setTabsOrientation] = useState("horizontal");
    const [bucket, setBucket] = useState(Math.random());
    
    const { id } = useParams();
    const [seed, setSeed] = useState(Math.random());
    useEffect(() => {
        b()
        remove_zeroes()
    }, [])

    const b = async () => {
        const res = await fetch(`http://localhost:8000/Buckets/${id}/`);
        setBucket(await res.json());
    }
    let rules = []
    if (bucket.rules != undefined) {
        rules = bucket.rules
    }
    console.log(bucket.rules)
    /*stuff for the map*/
    let coords = rules.map((data) => {return ([parseFloat(data.lat),parseFloat(data.long)])});
    
    const remove_zeroes = () => {
    //iterate coords backwards and remove any 0,0 coords
    for (let i = coords.length - 1; i >= 0; i--) {
        if (coords[i][0] === 0 && coords[i][1] === 0) {
            
            coords.splice(i, 1);
        }
    }
    for (let i = coords.length - 1; i >= 0; i--) {
        if (coords[i][0] === 0 && coords[i][1] === 0) {
            console.log('test')
        }
    }
    
    setSeed(Math.random())}

    //console.log(coords[0]);
    //console.log(rule);
    const INITIAL_VIEW_STATE = {
        longitude: 0,
        latitude: 10,
        zoom: 0,
        maxZoom: 16,
        pitch: 0,
        bearing: 0
      };
    //(coords)
    let layers = [
        new HeatmapLayer({
            id: 'scatter-plot',
            data: coords,
            
            radiusScale: 100,
            radiusMinPixels: 0.25,
            getPosition: d=> [d[1], d[0]],
            getWeight: d => 10,
            getRadius: 50,
            intensity: 1,
            threshold: 0.05,})
    ]
    /* end map stuff */
    var loaded = false;
    if (bucket.rules === undefined || bucket.rules === null){
        loaded = false;
    }  else {
        loaded = true;
    }
    
    function changeStatus(data) {
        
        if (data.status == 1) {
            
            data.status = 0;
        } else {
            
            data.status = 1;
        }
        
        let ip = null;
        let port = null;
        let tempRule = data.rule
        tempRule = tempRule.replace('<', '{')
        tempRule = tempRule.replace('>', '}')
        tempRule = tempRule.replace('=', ':')
        tempRule = tempRule.replace('=', ':')
        tempRule = JSON.parse(tempRule)
        if (tempRule.type == 1) {
            ip = tempRule['ip']

        } else {
            ip = tempRule['ip']
            port = tempRule['port']
        }
        
        data.type == 0 ? data.rule = `<ip='${ip}',port='${port}'>` : data.rule = `<ip='${ip}'>`;
        fetch(`http://localhost:8000/Rules/${data.id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data).replaceAll(/([a-zA-Z0-9_.]+):/g, "\"$1\":").replaceAll(/:'([a-zA-Z0-9_.]+)'/g, ":\"$1\"")
        }).then(() => {
            setSeed(Math.random());
        })
    }
    let columns = [];
    if (cookies.get('permissions') == '1') {
        columns = [
            {Header: "id", accessor: "id"},
            {Header: "name", accessor: "name"},
            {Header: "buckets", accessor: "buckets"},
            {Header: "Rule", accessor: "rule"},
            {Header: "Status", accessor: "status"},
            {Header: "", accessor: "statuschange"}]
    } else {
        columns = [
            {Header: "id", accessor: "id"},
            {Header: "name", accessor: "name"},
            {Header: "buckets", accessor: "buckets"},
            {Header: "Rule", accessor: "rule"},
            {Header: "Status", accessor: "status"}]
    }
    let rows = [];
    
    function getStatus(status) {
        if (status == 1) {
            return "Active"
        } else {
            return "Inactive"
        }
    }
    if (loaded) {
        rows = bucket.rules.map((data) => {
            if (cookies.get('permissions') == '1') {
                return (
                    {id: <a href={'/rule/' + data.id}>{data.id}</a>, 
                        name: data.name, 
                        buckets: data.buckets, 
                        rule: data.rule, 
                        status: getStatus(data.status), 
                        statuschange : <Button variant="contained" fontWeight="regular" color="text" onClick={() => {changeStatus(data)}}>Change Status</Button>}
                )
            } else {
                return (
                    {id: <a href={'/rule/' + data.id}>{data.id}</a>, 
                        name: data.name, 
                        buckets: data.buckets, 
                        rule: data.rule, 
                        status: getStatus(data.status)}
                )
            }
        })
    }
    function getAgeOffPolicy() {
        if (bucket.age_off_policy === 1) {
            return "Per Bucket"
        } else if (bucket.age_off_policy === 2) {
            return "Per Rule"
        } else {
            return "No Age Off Policy"
        }
    }
    if (cookies.get('authenticated') != "true") {
        return <Navigate to="/login" />;
    } else {
    return (
        <DashboardLayout>
            <DashboardNavbar  />
                
                <MDBox position="relative" mb={5}>
                <MDBox
                    display="flex"
                    alignItems="center"
                    position="relative"
                    minHeight="18.75rem"
                    borderRadius="xl"
                    sx={{
                    backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
                        `${linearGradient(
                        rgba(gradients.info.main, 0.6),
                        rgba(gradients.info.state, 0.6)
                        )}, url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "50%",
                    overflow: "hidden",
                    }}
                />
                <Card
                        sx={{
                        position: "relative",
                        mt: -8,
                        mx: 3,
                        py: 2,
                        px: 2,
                        }}
                >
                <Grid container spacing={3} alignItems="center">
                
                <Grid item>
                    <MDBox height="100%" mt={0.5} lineHeight={1}>
                    <MDTypography variant="h5" fontWeight="medium">
                        {bucket.name}

                    </MDTypography>
                    </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
                    <AppBar position="static">
                    
                    </AppBar>
                </Grid>
                
                </Grid>
                
                <MDBox mt={5} mb={3} >
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={6} lg={4}>
                        <MDBox>
                        <MDBox display="flex" py={.5} pr={2}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                ID: 
                            </MDTypography>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                                {bucket.id}
                            </MDTypography>
                        </MDBox>
                        </MDBox>
                        <MDBox>
                        <MDBox display="flex" py={.1} pr={2}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                Name: 
                            </MDTypography>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                                {bucket.name}
                            </MDTypography>
                        </MDBox>
                        </MDBox>
                        <MDBox>
                        <MDBox display="flex" py={.1} pr={2}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                Number of Associated Rules: 
                            </MDTypography>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                                {bucket.num_rules}
                            </MDTypography>
                        </MDBox>
                        </MDBox>
                        <MDBox>
                        <MDBox display="flex" py={.1} pr={2}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                Max Rule Duration 
                            </MDTypography>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                                {bucket.max_rule_duration}
                            </MDTypography>
                        </MDBox>
                        </MDBox>
                        <MDBox>
                        <MDBox display="flex" py={.1} pr={2}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                Age Off Policy: 
                            </MDTypography>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                                {getAgeOffPolicy()}
                            </MDTypography>
                        </MDBox>
                        </MDBox>
                        <MDBox>
                        <MDBox display="flex" py={.1} pr={2}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                Daily Data Limit: 
                            </MDTypography>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                                {bucket.daily_size_limit}
                            </MDTypography>
                        </MDBox>
                        </MDBox>
                        
                        </Grid>
                        <Grid item xs = {12} >
                            <MDBox pt={2} px={-5} key = {seed}>
                                <MDTypography variant="h6" color="text">
                                Attached Buckets
                                </MDTypography>
                            
                            <MDBox pt={-2} px={-5}>
                                <DataTable
                                table={{ columns, rows }}
                                isSorted={false}
                                entriesPerPage={false}
                                showTotalEntries={false}
                                noEndBorder
                                />
                            </MDBox>
                            </MDBox>
                        </Grid>
                        
                    </Grid>
                    
                </MDBox> 
                </Card>
                <Card>
                
                            <MDBox mb={1.5} >
                                <div style={{height: 400}} key = {seed}>
                                <DeckGL layers={layers} initialViewState={INITIAL_VIEW_STATE} controller={true}>
                                    <Map reuseMaps mapLib={maplibregl} mapStyle={'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'} preventStyleDiffing={true} />
                                </DeckGL>
                                </div>
                            </MDBox>
                
                </Card>
                </MDBox>
            
                
            
        </DashboardLayout>
    );}
}

export default Bucket;
