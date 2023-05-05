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

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField  from "@mui/material/TextField";
import backgroundImage from "assets/images/bg-profile.jpeg";


import JSON from "json5";
import DataTable from "examples/Tables/DataTable";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Autocomplete } from "@mui/material";
import Button from '@mui/material/Button';
import Cookies from 'universal-cookie';
function Rule() {
    const [tabsOrientation, setTabsOrientation] = useState("horizontal");
    const [rule, setRule] = useState(0);
    let [ruleEdit, setRuleEdit] = useState(0);
    let [ip, setIP] = useState(0);
    let [ipEdit, setIPEdit] = useState(0);
    let [port, setPort] = useState(0);
    let [portEdit, setPortEdit] = useState(0);
    const [ipgeo, setIPGeo] = useState(0);
    const [tabValue, setTabValue] = useState(0);
    const { id } = useParams();
    const [seed, setSeed] = useState(1);
    const [allbuckets, setAllBuckets] = useState([]);
    const [currentBucketAdd, setCurrentBucketAdd] = useState('');
    const handleSetTabValue = (event, newValue) => setTabValue(newValue);
    
    /* valid stuff */
    const [ipEmpty, setIPEmpty] = useState(false);
    const [portEmpty, setPortEmpty] = useState(false);
    const [nameEmpty, setNameEmpty] = useState(false);
    const [sourceEmpty, setSourceEmpty] = useState(false);
    const [bucketsEmpty, setBucketsEmpty] = useState(false);
    
    const [priorityEmpty, setPriorityEmpty] = useState(false);

    const cookies = new Cookies();
    useEffect(() => {
        r()
        b()
    }, [])

    const b = async () => {
        const res = await fetch('http://localhost:8000/Buckets/');
        setAllBuckets(await res.json());
    }
    const r = async () => {
        fetch(`http://localhost:8000/Rules/${id}/`)
        .then(res => res.json())
        .then(data => {setRule(data);
            setRuleEdit(data);
            setIP(getIP(data));
            setPort(getPort(data));
            setIPEdit(getIP(data));
            setPortEdit(getPort(data));});
            
    }
    let allBucketNames = allbuckets.map((data) => {return(data.name)});
    var loaded = false;
    if (rule.buckets === undefined || rule.buckets === null){
        loaded = false;
    }  else {
        loaded = true;
    }
    function getIP(data){
        let tempRule = data.rule
        tempRule = tempRule.replace('<', '{')
        tempRule = tempRule.replace('>', '}')
        tempRule = tempRule.replace('=', ':')
        tempRule = tempRule.replace('=', ':')
        tempRule = JSON.parse(tempRule)
        return tempRule['ip']
    }
    function getPort(data){
        let tempRule = data.rule
        tempRule = tempRule.replace('<', '{')
        tempRule = tempRule.replace('>', '}')
        tempRule = tempRule.replace('=', ':')
        tempRule = tempRule.replace('=', ':')
        tempRule = JSON.parse(tempRule)
        if (rule.type == 1) {
            return null
        } else {
            return tempRule['port']
        }
    }
    function addBucket() {
        for (let i = 0; i < ruleEdit.buckets.length; i++) {
            if (ruleEdit.buckets[i].name == currentBucketAdd) {
                return;
            }
        }
        ruleEdit.buckets = ruleEdit.buckets.concat(allbuckets.filter((data) => {return(data.name == currentBucketAdd)}));
        setSeed(Math.random());
        console.log(ruleEdit.buckets);
    }
    /* used to reset the edited rule to remove changes */
    function refreshEdited() {
        setRuleEdit(rule);
        setIPEdit(ip);
        setPortEdit(port);
        rows = rule.buckets.map((data) => {
            return (
                {id: data.id, name: data.name, num_rules: data.num_rules, daily_size_limit: data.daily_size_limit, age_off_policy: data.age_off_policy}
            )
        })
        setIPEmpty(false);
        setPortEmpty(false);
        setNameEmpty(false);
        setSourceEmpty(false);
        setBucketsEmpty(false);
        setPriorityEmpty(false);
        setSeed(Math.random());
    }
    
    function updateRule() {

        if (ruleEdit.name == '') {
            setNameEmpty(true);
            
        } else {
            setNameEmpty(false);
        }
        if (ipEdit == '') {
            setIPEmpty(true);
        } else {
            setIPEmpty(false);
        }
        if (portEdit == '' && ruleEdit.type == 0) {
            setPortEmpty(true);
        } else {
            setPortEmpty(false);
        }
        if (ruleEdit.priority == '') {
            setPriorityEmpty(true);
        } else {
            setPriorityEmpty(false);
        }
        if (ruleEdit.source == '') {
            setSourceEmpty(true);
        } else {
            setSourceEmpty(false);
        }
        if (ruleEdit.buckets.length == 0) {
            setBucketsEmpty(true);
        } else {
            setBucketsEmpty(false);
        }
        
        if (ruleEdit.name == '' || ipEdit == '' || (portEdit == '' && ruleEdit.type == 0) || ruleEdit.source == '' || ruleEdit.buckets.length == 0) {
            
            return false; 
        }
        ruleEdit.type == 0 ? ruleEdit.rule = `<ip='${ipEdit}',port='${portEdit}'>` : ruleEdit.rule = `<ip='${ipEdit}'>`;
        delete ruleEdit.num_rules;
        ruleEdit.buckets = ruleEdit.buckets.map((data) => {return(data?.id)});

        
        console.log(JSON.stringify(rule).replaceAll(/([a-zA-Z0-9_.]+):/g, "\"$1\":"))
        fetch(`http://localhost:8000/Rules/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ruleEdit).replaceAll(/([a-zA-Z0-9_.]+):/g, "\"$1\":").replaceAll(/:'([a-zA-Z0-9_.]+)'/g, ":\"$1\"")
        })
        .then(res => res.json())
        .then(data => {setRule(data);
            console.log(data)
            setRuleEdit(data);
            setIP(getIP(data));
            setPort(getPort(data));}
        )
        .catch(function(error) {
                console.log(error);
        });;
            setIPEdit(ip);
            setPortEdit(port);
            setRuleEdit(rule);
    }
    
    let columns = [
        {Header: "id", accessor: "id"},
        {Header: "name", accessor: "name"},
        {Header: "Number of Rules", accessor: "num_rules"},
        {Header: "Dailey Size Limit", accessor: "daily_size_limit"},
        {Header: "Age Off Policy", accessor: "age_off_policy"}]
    let rows = [];
    
    if (loaded && rows.length == 0) {
        
        rows = rule.buckets.map((data) => {
            return (
                {id: <a href={'/bucket/' + data.id}>{data.id}</a>, name: data.name, num_rules: data.num_rules, daily_size_limit: data.daily_size_limit, age_off_policy: data.age_off_policy}
            )
        })
        
    }


     /*section to check through everything to make sure they're valid*/
     
    function ipIsValid() {
        //regex for valid ip
        let regex = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
        //regex for valid ipv6
        let regex2 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
        if (regex.test(ipEdit) || regex2.test(ipEdit) || ipEdit == '') {
            return true;
        }
        return false;
    }
    function portIsValid() {
        let regex = /^[0-9]+$/;
        if (port == '' || (regex.test(portEdit) && parseInt(portEdit) >= 0 && parseInt(portEdit) <= 65535)) {
            return true;
        }
        return false;
    }
    function priorityIsValid() {
        let regex = /^[0-9]+$/;
        if (ruleEdit.priority == '' || (regex.test(ruleEdit.priority) && parseInt(ruleEdit.priority) >= 0 )) {
            return true;
        }
        return false;
    }
    function ruleIsValid() {
        if (ipIsValid() && portIsValid() && priorityIsValid()) {
            return true;
        } else {
            return false;
        }

    }

    if (cookies.get('authenticated') != 'true') {
        return <Navigate to="/login" />;
    } else {
    return (
        <DashboardLayout>
            <DashboardNavbar />
                
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
                {loaded ?
                <Card
                        sx={{
                        position: "relative",
                        mt: -8,
                        mx: 3,
                        py: 2,
                        px: 2,
                        }}
                >
                <Grid container spacing={3} alignItems="center" >
                
                <Grid item>
                    <MDBox height="100%" mt={0.5} lineHeight={1}>
                    <MDTypography variant="h5" fontWeight="medium">
                        {rule.name}

                    </MDTypography>
                    <MDTypography variant="button" color="text" fontWeight="regular">
                        {rule.rule}
                    </MDTypography>
                    </MDBox>
                </Grid>
                {cookies.get('permissions') == '1' ?
                <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
                    <AppBar position="static">
                    <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                        <Tab
                        label="View"
                        icon={
                            <Icon fontSize="small" sx={{ mt: -0.25 }}>
                            home
                            </Icon>
                        }
                        />
                        <Tab
                        label="Edit"
                        icon={
                            <Icon fontSize="small" sx={{ mt: -0.25 }}>
                            
                            </Icon>
                        }
                        />
                    </Tabs>
                    </AppBar>
                </Grid> : null}
                
                
                </Grid>
                {tabValue === 0 ? 
                /* ---------------------- View ---------------------- */
                <MDBox mt={5} mb={3} >
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={6} lg={4}>
                        <MDBox>
                        <MDBox display="flex" py={.5} pr={2}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                ID: 
                            </MDTypography>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                                {rule.id}
                            </MDTypography>
                        </MDBox>
                        </MDBox>
                        <MDBox>
                        <MDBox display="flex" py={.1} pr={2}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                Name: 
                            </MDTypography>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                                {rule.name}
                            </MDTypography>
                        </MDBox>
                        </MDBox>
                        <MDBox>
                        <MDBox display="flex" py={.1} pr={2}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                Rule: 
                            </MDTypography>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                                {rule.rule}
                            </MDTypography>
                        </MDBox>
                        </MDBox>
                        <MDBox>
                        <MDBox display="flex" py={.1} pr={2}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                Priority: 
                            </MDTypography>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                                {rule.priority}
                            </MDTypography>
                        </MDBox>
                        </MDBox>
                        <MDBox>
                        <MDBox display="flex" py={.1} pr={2}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                Source: 
                            </MDTypography>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                                {rule.source}
                            </MDTypography>
                        </MDBox>
                        </MDBox>
                        <MDBox>
                        <MDBox display="flex" py={.1} pr={2}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                Status: 
                            </MDTypography>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                                {rule.status == 1 ? "Active" : "Inactive"}
                            </MDTypography>
                        </MDBox>
                        </MDBox>
                        <MDBox>
                        <MDBox display="flex" py={.1} pr={2}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                Time Since Updated: 
                            </MDTypography>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                                {rule.active_time}
                            </MDTypography>
                        </MDBox>
                        </MDBox>
                        
                        </Grid>
                        <Grid item xs = {12}>
                        <MDBox pt={2} px={-5}>
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
                </MDBox> :
                /* ---------------------- Edit ---------------------- */
                <MDBox mt={5} mb={3}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={6} lg={4}>
                        {/*id cannot be changed*/}
                        <MDBox>
                        <MDBox display="flex" py={.5} pr={2}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                ID: 
                            </MDTypography>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                                {rule.id}
                            </MDTypography>
                        </MDBox>
                        </MDBox>
                        {/*setting value for the name*/}
                        <MDBox>
                        <MDBox display="flex" py={.1} pr={2} key = {seed}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize" my = {.5}>
                                Name: 
                            </MDTypography>
                            {!nameEmpty ? 
                            <TextField id="outlined-basic" 
                                onChange={(e) => setRuleEdit({...ruleEdit, name: e.target.value})}
                                variant="standard" 
                                defaultValue={ruleEdit.name} /> : 
                            <TextField error id="outlined-basic" 
                                onChange={(e) => setRuleEdit({...ruleEdit, name: e.target.value})}
                                variant="standard" 
                                defaultValue={ruleEdit.name} 
                                helperText={"name cannot be empty"}/>}
                        </MDBox>
                        </MDBox>
                        <MDBox>
                        {/*setting value for the rule*/}
                        <MDBox display="flex" py={.1} pr={2} key = {seed}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize" my = {.5}>
                                Rule Type: 
                            </MDTypography>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                onChange = {(e) => setRuleEdit({...ruleEdit, type: e.target.value})}
                                defaultValue = {ruleEdit.type}
                            >
                                <FormControlLabel value = "0" control={<Radio  sx = {{"& .MuiSvgIcon-root": { height: 15, width: 15, marginX: .5}}}/>} label="IP-Port" />
                                <FormControlLabel value = "1" control={<Radio  sx = {{"& .MuiSvgIcon-root": { height: 15, width: 15, marginX: .5}}}/>} label="IP-Only" />
                            </RadioGroup>
                        </MDBox>
                        </MDBox> 
                        {/* ---------------------- IP-Port ---------------------- */}

                        <MDBox>
                        <MDBox display="flex" py={.1} pr={2} key = {seed}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize" my = {.5}>
                                IP: 
                            </MDTypography>
                            {ipIsValid() == true && !ipEmpty ?
                                <TextField id="outlined-basic" 
                                    onChange={(e) => setIPEdit(e.target.value)}
                                    variant="standard" 
                                    placeholder={"IPV4 or IPV6 address"}
                                    defaultValue = {ipEdit}
                                    
                                    />: !ipIsValid() ?
                                <TextField error id="outlined-basic" 
                                    onChange={(e) => setIPEdit(e.target.value)}
                                    variant="standard" 
                                    placeholder={"IPV4 or IPV6 address"}
                                    defaultValue = {ipEdit}
                                    helperText={"must be valid IPV4 or IPV6 address"}
                                    
                                     /> : 
                                <TextField error id="outlined-basic" 
                                     onChange={(e) => setIPEdit(e.target.value)}
                                     variant="standard" 
                                     placeholder={"IPV4 or IPV6 address"}
                                     defaultValue = {ipEdit}
                                     helperText={"ip cannot be empty"}
                                    />
                                }
                        </MDBox>
                        </MDBox>
                        {ruleEdit.type == 0 ?
                        <MDBox>
                        <MDBox display="flex" py={.1} pr={2} key = {seed}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize" my = {.5}>
                                Port: 
                            </MDTypography>
                            {portIsValid() == true && !portEmpty ?
                                <TextField id="outlined-basic" 
                                onChange={(e) => setPortEdit(e.target.value)}
                                variant="standard" 
                                defaultValue={portEdit}
                                placeholder={"Port Number"} /> : !portIsValid() ? 
                                <TextField error id="outlined-basic" 
                                    onChange={(e) => setPortEdit(e.target.value)}
                                    variant="standard" 
                                    defaultValue={portEdit}
                                    placeholder={"Port Number"} 
                                    helperText={"port must be number 0-65535"}/> :
                                <TextField key = {seed} error id="outlined-basic" 
                                    onChange={(e) => setPortEdit(e.target.value)}
                                    variant="standard"
                                    defaultValue={portEdit}
                                    placeholder={"Port Number"}
                                    helperText={"port cannot be empty"} />}
                        </MDBox>
                        </MDBox>
                        : null}
                        {/*setting value for the priority*/}
                        <MDBox>
                        <MDBox display="flex" py={.1} pr={2} key = {seed}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize" my = {.5}>
                                Priority: 
                            </MDTypography>
                            {priorityIsValid() == true && !priorityEmpty ?
                                <TextField id="outlined-basic" 
                                onChange={(e) => setRuleEdit({...ruleEdit, priority: e.target.value})}
                                variant="standard" 
                                defaultValue={ruleEdit.priority}
                                placeholder={"Integer Priority"} /> : !priorityIsValid() ? 
                                <TextField error id="outlined-basic" 
                                onChange={(e) => setRuleEdit({...ruleEdit, priority: e.target.value})}
                                    variant="standard" 
                                    defaultValue={ruleEdit.priority}
                                    placeholder={"Integer Priority"} 
                                    helperText={"priority must be a number"}/> :
                                <TextField error id="outlined-basic" 
                                onChange={(e) => setRuleEdit({...ruleEdit, priority: e.target.value})}
                                    variant="standard" 
                                    defaultValue={ruleEdit.priority}
                                    placeholder={"Priority Number"}
                                    helperText={"priority cannot be empty"} />}
                        </MDBox>
                        </MDBox>
                        {/*setting value for the source*/}
                        <MDBox>
                        <MDBox display="flex" py={.1} pr={2} key = {seed}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize" my = {.5}>
                                Source: 
                            </MDTypography>
                            { !sourceEmpty ? <TextField id="outlined-basic" 
                                    onChange={(e) => setRuleEdit({...ruleEdit, source: e.target.value})}
                                    variant="standard"
                                    defaultValue={ruleEdit.source}
                                    placeholder={"e.g. 'vulndb'"} /> :
                                    <TextField error id="outlined-basic" 
                                    onChange={(e) => setRuleEdit({...ruleEdit, source: e.target.value})}
                                    variant="standard" 
                                    placeholder={"e.g. 'vulndb'"}
                                    defaultValue={ruleEdit.source}
                                    helperText={"source cannot be empty"}/>
                                }
                            
                        </MDBox>
                        </MDBox>
                        {/*setting value for the status*/}
                        <MDBox>
                        <MDBox display="flex" py={.1} pr={2} key = {seed}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize" my = {.5}>
                                Status: 
                            </MDTypography>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                onChange = {(e) => setRuleEdit({...ruleEdit, status: e.target.value})}
                                defaultValue = {ruleEdit.status}
                            >
                                <FormControlLabel value = "1" control={<Radio  sx = {{"& .MuiSvgIcon-root": { height: 15, width: 15, marginX: .5}}}/>} label="Active" />
                                <FormControlLabel value = "0" control={<Radio  sx = {{"& .MuiSvgIcon-root": { height: 15, width: 15, marginX: .5}}}/>} label="Inactive" />
                            </RadioGroup>
                        </MDBox>
                        </MDBox>
                        {/*time since updated is updated automatically*/}
                        <MDBox>
                        <MDBox display="flex" py={.1} pr={2}>
                            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                Time Since Updated: 
                            </MDTypography>
                            <MDTypography variant="button" fontWeight="regular" color="text">
                                {rule.active_time}
                            </MDTypography>
                        </MDBox>
                        </MDBox>

                        <MDBox>
                        <MDBox display="flex" pr={2}>
                            <Autocomplete

                                value={currentBucketAdd}
                                onChange={(event, newValue) => {
                                    setCurrentBucketAdd(newValue);
                                }}
                                defaultValue={'Enter Bucket Name'}
                                options={allBucketNames}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Buckets" />}
                                />
                                <Button variant="text" onClick={addBucket}>Add Bucket</Button>
                        </MDBox>
                        
                        </MDBox>


                        <MDBox display="flex" >
                                {ruleIsValid() ?
                                <Button variant="contained" onClick={() => updateRule()} color="white">Update</Button>
                                : <Button variant="contained" disabled color="white">Update</Button>}
                                <MDBox display="flex" mx = {2}><Button onClick={() => refreshEdited()} variant="contained" color="white">Reset</Button>
                                    </MDBox>
                            </MDBox>
                        </Grid>
                        
                        <Grid item xs = {12} key = {seed}>
                            <MDBox pt={2} px={-5}>
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
                </MDBox>} 
                </Card> : null}
                </MDBox>
            
                
            
        </DashboardLayout>
        
    );}
}

export default Rule;

