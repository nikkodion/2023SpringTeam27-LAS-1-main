import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Cookies from 'universal-cookie';
function Buckets () {
    const cookies = new Cookies();
    const [bucket, setBucket] = useState([]);

    useEffect(() => {
        buckets()
    }, [])

    const buckets = async () => {
        const res = await fetch('http://localhost:8000/Buckets/');
        setBucket(await res.json());
    }
    let columns = [
            {Header: "id", accessor: "id"},
            {Header: "name", accessor: "name"},
            {Header: "Number of Rules", accessor: "num_rules"},
            {Header: "Dailey Size Limit", accessor: "daily_size_limit"},
            {Header: "Age Off Policy", accessor: "age_off_policy"}]
    let rows = bucket.map((data) => {
        return (
            {id: <a href={'bucket/' + data.id}>{data.id}</a>, name: data.name, num_rules: data.num_rules, daily_size_limit: data.daily_size_limit, age_off_policy: data.age_off_policy}
        )
    })
    if (cookies.get('authenticated') != "true") {
        return <Navigate to="/login" />;
    } else {
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Card>
                    <MDBox
                        mx={2}
                        mt={-3}
                        py={3}
                        px={2}
                        variant="gradient"
                        bgColor="info"
                        borderRadius="lg"
                        coloredShadow="info"
                    >
                        <MDTypography variant="h6" color="white">
                        Buckets
                        </MDTypography>
                    </MDBox>
                    <MDBox pt={3}>
                        <DataTable
                        table={{ columns, rows }}
                        isSorted={false}
                        entriesPerPage={false}
                        showTotalEntries={false}
                        noEndBorder
                        />
                    </MDBox>
                    </Card>
                </Grid>
            </Grid>

            </MDBox>
        </DashboardLayout>
        
    )}

}

export default Buckets;