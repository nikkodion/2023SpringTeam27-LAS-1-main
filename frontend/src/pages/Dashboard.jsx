import React, { useEffect, useState } from "react";
import { NavLink, Navigate, Link} from "react-router-dom"

import Grid from "@mui/material/Grid";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Divider from "@mui/material/Divider";
import MDBox from "components/MDBox";
import { ReactComponent as Bucket_Icon } from "assets/images/noun-water-bucket-2165740.svg";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import SvgIcon from "@mui/material/SvgIcon";
import { ResponsivePie } from '@nivo/pie'
import { useMaterialUIController} from "context";
import Cookies from 'universal-cookie';

import maplibregl from 'maplibre-gl';
import {Map} from "react-map-gl";
import DeckGL from '@deck.gl/react';
import {ScatterplotLayer} from '@deck.gl/layers';
import {HeatmapLayer} from '@deck.gl/aggregation-layers';
import { Responsive, WidthProvider } from "react-grid-layout";
import { ResponsiveTreeMap } from '@nivo/treemap'
function Dashboard() {
    const [bucket, setBucket] = useState([]);
    const [rule, setRule] = useState([]);
    const [seed, setSeed] = useState(1);
    const cookies = new Cookies();
    var count_active = 0;
    var count_inactive = 0;
    useEffect(() => {
        buckets()
        rules()
        remove_zeroes()
    }, [])
    const rules = async () => {
        const res = await fetch('http://localhost:8000/Rules/');
        setRule(await res.json());
    }
    const buckets = async () => {
        const res = await fetch('http://localhost:8000/Buckets/');
        setBucket(await res.json());
        
    }
    /* stuff for the grid */
    const ResponsiveGridLayout = WidthProvider(Responsive);
    const layout = {lg : [ 
        {i: 'buckets', x: 0, y: 0, w: 4, h: 2, static:true},
        {i: 'rules', x: 4, y: 0, w: 4, h: 2, static:true},
        {i: 'active-inactive', x: 9, y: 0, w: 8, h: 10, static:true},
        {i: 'map', x: 0, y: 11, w: 16, h: 14, static:true},
        {i: 'treemap', x: 0, y: 2, w: 8, h: 8, static:true},
        ]}
    /* end stuff for the grid */
    /*stuff for the map*/
    console.log(rule[0])
    let coords = rule.map((data) => {return ([parseFloat(data.lat),parseFloat(data.long)])});
    console.log(coords);
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
            threshold: 0.1,})
    ]
    /* end map stuff */
    const count_active_rules = () => {
        for (let i = 0; i < rule.length; i++) {
            if (rule[i].status === 1) {
                count_active += 1;
            }
        }
        active_inactive_data[0].value = count_active;
    }

    const count_inactive_rules = () => {
        for (let i = 0; i < rule.length; i++) {
            if (rule[i].status === 0) {
                count_inactive += 1;
            }
        }
        active_inactive_data[1].value = count_inactive;
    }
    const active_inactive_data = [{id: "Active", label: 'Active', value: 0, color: "hsl(90, 70%, 50%)"}, {id: "Inactive", label: 'Inactive', value: 0, color: "hsl(56, 70%, 50%)"}]

    
    /* stuff for treemap */
    let treeData = { "name" : "Buckets",
                    "color" : "hsl(0, 100%, 40%)",
                    "children" : bucket.map((data) => 
                                {return ({"name": data.name, "color": "hsl(0, 90%, 40%)", "loc": data.rules.length})})}
    console.log(treeData)
    /* end stuff for treemap */
    console.log(cookies.get('authenticated'));
    if (cookies.get('authenticated') == 'false' ) {
        return <Navigate to="/login" />;
    } else {
    return (
        <DashboardLayout>
        <DashboardNavbar />
        <MDBox py={3}>
            
                <ResponsiveGridLayout 
                    className="layout"
                    layouts={layout}
                    
                    rowHeight={30}
                    breakpoints={{lg: 1000}}
                    cols={{lg: 16}}
                    >
                <Card key='buckets'>
                    <MDBox mb={1.5}>
                    <MDBox display="flex" justifyContent="space-between" pt={1} px={2}>
                        <MDBox textAlign="right" lineHeight={1.25}>
                        <MDTypography variant="button" fontWeight="light" color="text">
                            Buckets
                        </MDTypography>
                        <MDTypography variant="h4">{bucket.length}</MDTypography>
                        </MDBox>
                    </MDBox>
                    </MDBox>
                </Card> 
                
                <Card key='rules'>
                    <MDBox mb={1.5}>
                    <MDBox display="flex" justifyContent="space-between" pt={1} px={2}>
                        <MDBox textAlign="right" lineHeight={1.25}>
                        <MDTypography variant="button" fontWeight="light" color="text">
                            Rules
                        </MDTypography>
                        <MDTypography variant="h4">{rule.length}</MDTypography>
                        </MDBox>
                    </MDBox>
                    </MDBox>
                </Card> 
                
                <Card key='active-inactive'>
                    <MDBox mb={1.5} >
                        <div style={{height: 400}}>
                        {rule.length > 0 ? count_active_rules() : null}
                        {rule.length > 0 ? count_inactive_rules() : null}
                        <ResponsivePie 
                            data = {active_inactive_data}
                            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                            innerRadius={0.5}
                            padAngle={0.7}
                            cornerRadius={3}
                            activeOuterRadiusOffset={8}
                            borderWidth={1}
                            borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
                            arcLinkLabelsSkipAngle={10}
                            arcLinkLabelsTextColor="#000000"
                            arcLinkLabelsThickness={2}
                            arcLinkLabelsColor={{ from: 'color' }}
                            arcLabelsSkipAngle={10}
                            arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
                            legends={[
                                {
                                    anchor: 'bottom',
                                    direction: 'row',
                                    justify: false,
                                    translateX: 0,
                                    translateY: 56,
                                    itemsSpacing: 0,
                                    itemWidth: 100,
                                    itemHeight: 18,
                                    itemTextColor: '#999',
                                    itemDirection: 'left-to-right',
                                    itemOpacity: 1,
                                    symbolSize: 18,
                                    symbolShape: 'circle',
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemTextColor: '#000'
                                            }
                                        }
                                    ]
                                }
                            ]}
                            />
                        </div>
                    </MDBox>
                </Card>
                <Card key = 'map'>
                    <MDBox mb={1.5} >
                    <div style={{height: 400}} key = {seed}>
                    <DeckGL layers={layers} initialViewState={INITIAL_VIEW_STATE} controller={true}>
                        <Map reuseMaps mapLib={maplibregl} mapStyle={'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'} preventStyleDiffing={true} />
                    </DeckGL>
                    </div>
                    </MDBox>
                </Card>
                <Card key='treemap'>
                    <MDBox mb={1.5} >
                        <div style={{height: 300}}>
                        <ResponsiveTreeMap
                                data={treeData}
                                identity="name"
                                value="loc"
                                valueFormat=".02s"
                                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                                labelSkipSize={12}
                                labelTextColor={{
                                    from: 'color',
                                    modifiers: [
                                        [
                                            'darker',
                                            1.2
                                        ]
                                    ]
                                }}
                                parentLabelPosition="left"
                                parentLabelTextColor={{
                                    from: 'color',
                                    modifiers: [
                                        [
                                            'darker',
                                            2
                                        ]
                                    ]
                                }}
                                borderColor={{
                                    from: 'color',
                                    modifiers: [
                                        [
                                            'darker',
                                            0.1
                                        ]
                                    ]
                                }}
                            />
                        </div>
                    </MDBox>
                </Card>
                </ResponsiveGridLayout>

        </MDBox>
        
        
        </DashboardLayout>
    );}
}

export default Dashboard;
