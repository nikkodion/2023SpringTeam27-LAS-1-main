import React, { useEffect, useState } from "react";
import Rule from "./Rule";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Navigate } from "react-router-dom";
import Cookies from 'universal-cookie';
function Rules () {
    const [rule, setRule] = useState([]);
    const cookies = new Cookies();
    useEffect(() => {
        rules()
    }, [])

    const rules = async () => {
        const res = await fetch('http://localhost:8000/Rules/');
        setRule(await res.json());
    }
    let columns = [
        {Header: "id", accessor: "id"},
        {Header: "name", accessor: "name"},
        {Header: "buckets", accessor: "buckets"},
        {Header: "Rule", accessor: "rule"},
        {Header: "Status", accessor: "status"}]
    let rows = rule.map((data) => {
        return (
            {id: <a href={'rule/' + data.id}>{data.id}</a>, name: data.name, buckets: data.buckets, rule: data.rule, status: data.status == 1 ? "Active" : "Inactive"}
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
                        Rules
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
export default Rules;