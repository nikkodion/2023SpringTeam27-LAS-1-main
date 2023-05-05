import React, { useEffect, useState } from "react";
import './style/rule.css';
import { Navigate } from 'react-router-dom';
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
import Cookies from 'universal-cookie';
function CreateRule() {
    const [rule, setRule] = useState(0);
    const [id, setId] = useState('');
    const [ip, setIP] = useState('');
    const [port, setPort] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState(0);
    const [priority, setPriority] = useState(0);
    const [status, setStatus] = useState(0);
    const [buckets, setBuckets] = useState([]);
    const [source, setSource] = useState('');
    const [seedoverall, setSeedOverall] = useState(0);
    const [allbuckets, setAllBuckets] = useState([]);
    const [seed, setSeed] = useState(0);
    const [currentBucketAdd, setCurrentBucketAdd] = useState('');
    const [ruleCreated, setRuleCreated] = useState(false);
    const cookies = new Cookies();
    /*valid stuff */
    const [idEmpty, setIdEmpty] = useState(false);
    const [ipEmpty, setIPEmpty] = useState(false);
    const [portEmpty, setPortEmpty] = useState(false);
    const [nameEmpty, setNameEmpty] = useState(false);
    const [sourceEmpty, setSourceEmpty] = useState(false);
    const [bucketsEmpty, setBucketsEmpty] = useState(false);
    const [idTaken, setIdTaken] = useState(false);
    const [priorityEmpty, setPriorityEmpty] = useState(false);
    useEffect(() => {
        b()
    }, [])
    
    
    const b = async () => {
        const res = await fetch('http://localhost:8000/Buckets/');
        setAllBuckets(await res.json());
    }
    
    var loaded = false;
    if (allbuckets === undefined || allbuckets === null){
        loaded = false;
    }  else {
        loaded = true;
    }
    
    let allBucketNames = allbuckets.map((data) => {return(data.name)});
    let columns = [
        {Header: "id", accessor: "id"},
        {Header: "name", accessor: "name"},
        {Header: "Number of Rules", accessor: "num_rules"},
        {Header: "Dailey Size Limit", accessor: "daily_size_limit"},
        {Header: "Age Off Policy", accessor: "age_off_policy"},
        {Header: "Remove", accessor: "remove"}]
    let rows = buckets.map((data) => {
        return (
            {id: <a href={'bucket/' + data.id}>{data.id}</a>, name: data.name, num_rules: data.num_rules, daily_size_limit: data.daily_size_limit, age_off_policy: data.age_off_policy, remove: <Button onClick={() => removeBucket(data)}>Remove</Button>}
        )
    })
    function removeBucket(data) {
        
        buckets.splice(buckets.indexOf(data), 1);
        setSeed(Math.random());
    }
    function addBucket() {
        //see if bucket is already in
        for (let i = 0; i < buckets.length; i++) {
            if (buckets[i].name == currentBucketAdd) {
                return;
            }
        }
        setBuckets(buckets.concat(allbuckets.filter((data) => {return(data.name == currentBucketAdd)})));
        setSeed(Math.random());
    }
    async function checkID(data) {
        //see if id is already in use in database with fetch
       
        fetch(`http://localhost:8000/RuleExists/${data}/`).then((res) => res).then((data) => {
            
            if (data.status == 200) {
                console.log('test1');
                setIdTaken(true);
                return true;
            } else {
                console.log('test2');
                setIdTaken(false);
                return false;
            }
        }).catch((err) => {
            console.log('test3');
            setIdTaken(false);
            return false;
        });
        
    }
    function createRule() {
        if (id == '') {
            setIdEmpty(true);
        } else {
            setIdEmpty(false);
        }
        if (name == '') {
            setNameEmpty(true);
            
        } else {
            setNameEmpty(false);
        }
        if (ip == '') {
            setIPEmpty(true);
        } else {
            setIPEmpty(false);
        }
        if (port == '' && type == 0) {
            setPortEmpty(true);
        } else {
            setPortEmpty(false);
        }
        if (priority == '') {
            setPriorityEmpty(true);
        } else {
            setPriorityEmpty(false);
        }
        if (source == '') {
            setSourceEmpty(true);
        } else {
            setSourceEmpty(false);
        }
        if (buckets.length == 0) {
            setBucketsEmpty(true);
        } else {
            setBucketsEmpty(false);
        }
        
        if (id == '' || name == '' || ip == '' || (port == '' && type == 0) || source == '' || buckets.length == 0) {
            
            return false; 
        }
        let idExists = checkID(id);
        if (!idExists) {
            
            return false;
        }
        let rule = {
            id: parseInt(id),
            name: name,
            type: parseInt(type),
            priority:parseInt( priority),
            status: parseInt(status),
            rule : '',
            buckets: [],
            active_time: 0,
            source: source
        }
        type == 0 ? rule.rule = `<ip='${ip}',port='${port}'>` : rule.rule = `<ip='${ip}'>`;
        rule.buckets = buckets.map((data) => {return(data.id)});
        fetch('http://localhost:8000/Rules/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rule).replaceAll(/([a-zA-Z0-9_.]+):/g, "\"$1\":").replaceAll(/:'([a-zA-Z0-9_.]+)'/g, ":\"$1\"")
        }).then(res => res.json())
        .then((data) => { setRuleCreated(true); });
    }
    
    /*section to check through everything to make sure they're valid*/
    function idIsValid() {
        /*make sure id is only numbers*/
        let regex = /^[0-9]+$/;
        if (id == '' || (regex.test(id) && parseInt(id) >= 0 )) {
            return true;
        }
        return false;

        
    }
    function ipIsValid() {
        //regex for valid ip
        let regex = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
        //regex for valid ipv6
        let regex2 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
        if (regex.test(ip) || regex2.test(ip) || ip == '') {
            return true;
        }
        return false;
    }
    function portIsValid() {
        let regex = /^[0-9]+$/;
        if (port == '' || (regex.test(port) && parseInt(port) >= 0 && parseInt(port) <= 65535)) {
            return true;
        }
        return false;
    }
    function priorityIsValid() {
        let regex = /^[0-9]+$/;
        if (priority == '' || (regex.test(priority) && parseInt(priority) >= 0 )) {
            return true;
        }
        return false;
    }
    function ruleIsValid() {
        if (idIsValid() && ipIsValid() && portIsValid() && priorityIsValid()) {
            return true;
        } else {
            return false;
        }

    }

    if (cookies.get('authenticated') != "true") {
        return <Navigate to="/login" />;
    } else {
    return (
        <DashboardLayout>
            <DashboardNavbar />

            <MDBox position="relative" mb={5} key = {seedoverall}>
                
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
                            <MDBox height="100%" mt={0.5} lineHeight={1}>
                            <MDTypography variant="h5" fontWeight="medium">
                                Create Rule

                            </MDTypography>
                            </MDBox>
                        </Grid>
                    </Grid>
                    <MDBox mt={5} mb={3} >
                        <Grid container spacing={1}>
                        <Grid item xs={12} md={6} lg={4}>
                            <MDBox>
                            <MDBox display="flex"  pr={2}>
                            <Grid item>
                                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                    ID: 
                                </MDTypography>
                                </Grid>
                                <Grid item alignItems="end"  style={{ display: "flex"}}>
                                {idIsValid() && !idEmpty && !idTaken ? <TextField  id="outlined-basic" 
                                    onChange={(e) => setId(e.target.value)}
                                    variant="standard" 
                                    placeholder={"Integer ID"}
                                     /> : !idIsValid() ?
                                    <TextField error id="outlined-basic" 
                                    onChange={(e) => setId(e.target.value)}
                                    variant="standard" 
                                    placeholder={"Integer ID"}
                                    helperText={"ID must be a nonzero integer"} />:
                                    idTaken ? 
                                    <TextField error id="outlined-basic" 
                                    onChange={(e) => setId(e.target.value)}
                                    variant="standard" 
                                    placeholder={"Integer ID"}
                                    helperText={"ID is already in use"} />:
                                    <TextField error id="outlined-basic" 
                                    onChange={(e) => setId(e.target.value)}
                                    variant="standard" 
                                    placeholder={"Integer ID"}
                                    helperText={"id cannot be empty"}
                                     />}
                                </Grid>
                            </MDBox>
                            </MDBox>
                            <MDBox>
                            <MDBox display="flex" pr={2}>
                                <Grid item>
                                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                    Name: 
                                </MDTypography>
                                </Grid>
                                <Grid item alignItems="end"  style={{ display: "flex"}}>
                                {!nameEmpty  ? <TextField id="outlined-basic" 
                                    onChange={(e) => setName(e.target.value)}
                                    variant="standard" 
                                    placeholder={"Rule Name"} />
                                    :<TextField error id="outlined-basic" 
                                    onChange={(e) => setName(e.target.value)}
                                    variant="standard" 
                                    placeholder={"Rule Name"} 
                                    helperText={"name cannot Be empty"}/>
                                }
                                </Grid>
                            </MDBox>
                            </MDBox>
                            <MDBox>
                            <MDBox display="flex" pr={2}>
                                <Grid item>
                                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                    Rule Type:
                                </MDTypography>
                                </Grid>
                                <Grid item alignItems="end"  style={{ display: "flex"}}>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    onChange = {(e) => setType(e.target.value)}
                                    defaultValue = {0}
                                >
                                    <FormControlLabel value = "0" control={<Radio  sx = {{"& .MuiSvgIcon-root": { height: 15, width: 15, marginX: .5}}}/>} label="IP-Port" />
                                    <FormControlLabel value = "1" control={<Radio  sx = {{"& .MuiSvgIcon-root": { height: 15, width: 15, marginX: .5}}}/>} label="IP-Only" />
                                </RadioGroup>
                                </Grid>
                            </MDBox>
                            </MDBox>
                            <MDBox>
                            <MDBox display="flex" pr={2}>
                                <Grid item>
                                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                    IP: 
                                </MDTypography>
                                </Grid>
                                <Grid item alignItems="end"  style={{ display: "flex"}}>
                                {ipIsValid() == true && !ipEmpty ?
                                <TextField id="outlined-basic" 
                                    onChange={(e) => setIP(e.target.value)}
                                    variant="standard" 
                                    placeholder={"IPV4 or IPV6 address"}
                                    />: !ipIsValid() ?
                                <TextField error id="outlined-basic" 
                                    onChange={(e) => setIP(e.target.value)}
                                    variant="standard" 
                                    placeholder={"IPV4 or IPV6 address"}
                                    helperText={"must be valid IPV4 or IPV6 address"}
                                     /> : 
                                <TextField error id="outlined-basic" 
                                     onChange={(e) => setIP(e.target.value)}
                                     variant="standard" 
                                     placeholder={"IPV4 or IPV6 address"}
                                     helperText={"ip cannot be empty"}/>
                                }
                                </Grid>
                            </MDBox>
                            </MDBox>
                            {type == 0 ?
                            <MDBox>
                            
                            <MDBox display="flex" pr={2}>
                                <Grid item>
                                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                    Port: 
                                </MDTypography>
                                </Grid>
                                <Grid item alignItems="end"  style={{ display: "flex"}}>
                                {portIsValid() == true && !portEmpty ?
                                <TextField id="outlined-basic" 
                                onChange={(e) => setPort(e.target.value)}
                                variant="standard" 
                                placeholder={"Port Number"} /> : !portIsValid() ? 
                                <TextField error id="outlined-basic" 
                                    onChange={(e) => setPort(e.target.value)}
                                    variant="standard" 
                                    placeholder={"Port Number"} 
                                    helperText={"port must be number 0-65535"}/> :
                                <TextField error id="outlined-basic" 
                                    onChange={(e) => setPort(e.target.value)}
                                    variant="standard" 
                                    placeholder={"Port Number"}
                                    helperText={"port cannot be empty"} />}
                                
                                </Grid>
                            </MDBox>
                            </MDBox>
                             : null}

                            <MDBox>
                            <MDBox display="flex" pr={2}>
                                <Grid item>
                                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                    Priority: 
                                </MDTypography>
                                </Grid>
                                <Grid item alignItems="end"  style={{ display: "flex"}}>
                                {priorityIsValid() == true && !priorityEmpty ?
                                <TextField id="outlined-basic" 
                                onChange={(e) => setPriority(e.target.value)}
                                variant="standard" 
                                placeholder={"Integer Priority"} /> : !priorityIsValid() ? 
                                <TextField error id="outlined-basic" 
                                    onChange={(e) => setPriority(e.target.value)}
                                    variant="standard" 
                                    placeholder={"Integer Priority"} 
                                    helperText={"priority must be a number"}/> :
                                <TextField error id="outlined-basic" 
                                    onChange={(e) => setPriority(e.target.value)}
                                    variant="standard" 
                                    placeholder={"Priority Number"}
                                    helperText={"priority cannot be empty"} />}
                                </Grid>
                            </MDBox>
                            </MDBox>
                            <MDBox>
                            <MDBox display="flex" pr={2}>
                                <Grid item>
                                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                    Source: 
                                </MDTypography>
                                </Grid>
                                <Grid item alignItems="end"  style={{ display: "flex"}}>
                                { !sourceEmpty ? <TextField id="outlined-basic" 
                                    onChange={(e) => setSource(e.target.value)}
                                    variant="standard" 
                                    placeholder={"e.g. 'vulndb'"} /> :
                                    <TextField error id="outlined-basic" 
                                    onChange={(e) => setSource(e.target.value)}
                                    variant="standard" 
                                    placeholder={"e.g. 'vulndb'"}
                                    helperText={"source cannot be empty"}/>
                                }
                                </Grid>
                            </MDBox>
                            </MDBox>
                            <MDBox>
                            <MDBox display="flex" pr={2}>
                                <Grid item>
                                <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                                    Rule Type:
                                </MDTypography>
                                </Grid>
                                <Grid item alignItems="end"  style={{ display: "flex"}}>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    onChange = {(e) => setStatus(e.target.value)}
                                    defaultValue = {0}
                                >
                                    <FormControlLabel value = "1" control={<Radio  sx = {{"& .MuiSvgIcon-root": { height: 15, width: 15, marginX: .5}}}/>} label="Active" />
                                    <FormControlLabel value = "0" control={<Radio  sx = {{"& .MuiSvgIcon-root": { height: 15, width: 15, marginX: .5}}}/>} label="Inactive" />
                                </RadioGroup>
                                </Grid>
                            </MDBox>
                            </MDBox>
                            {/* adding buckets */}
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
                            {bucketsEmpty ?
                            <MDBox>
                            <MDBox display="flex" pr={2}>
                                <MDTypography variant="button" color="error" >rule must be attached to at least one bucket</MDTypography>
                            </MDBox>
                            </MDBox> : null}
                        </Grid>
                        <Grid item xs={12} justify='flex-end'>
                            {ruleIsValid() ?
                            <Button justify="flex-end" variant="contained" color="text" onClick={createRule}>Create Rule</Button> :
                            <Button justify="flex-end" variant="contained" color="text" disabled>Create Rule</Button>}
                        </Grid>
                        <Grid item xs={12} justify='flex-end'>
                                 {ruleCreated ?
                                <MDTypography variant="button" fontWeight="bold" color="text" >Rule Created Successfully</MDTypography>: null}
                        </Grid>
                        <Grid item xs = {12} key = {seed}>
                            <MDBox pt={2} px={-5}>
                                <MDTypography variant="h6" color="text">
                                Added Buckets
                                </MDTypography>
                            
                            <MDBox pt={-2} px={-5} >
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
            </MDBox>
        </DashboardLayout>
    )}
}
export default CreateRule;