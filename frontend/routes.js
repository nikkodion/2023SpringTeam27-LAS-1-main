import Nav from './pages/Nav';
import Login from './pages/Login';
import Home from './pages/Home';
import Bucket from './pages/Bucket';
import Buckets from './pages/Buckets';
import Rule from './pages/Rule';
import RuleEdit from './pages/RuleEdit'
import Rules from './pages/Rules';
import ImportExport from './pages/ImportExport';

import Icon from "@mui/material/Icon";
const routes = [
    {
        type: "collapse",
        name: "Nav",
        key: "nav",
        icon: <Icon fontSize="small">nav</Icon>,
        route: "/nav",
        component: <Nav />,
    },
    {
        type: "collapse",
        name: "Home",
        key: "home",
        icon: <Icon fontSize="small">home</Icon>,
        route: "/home",
        component: <Home />,
    },
    {
        type: "collapse",
        name: "Bucket",
        key: "bucket",
        icon: <Icon fontSize="small">bucket</Icon>,
        route: "/bucket",
        component: <Bucket />,
    },
    {
        type: "collapse",
        name: "Buckets",
        key: "buckets",
        icon: <Icon fontSize="small">buckets</Icon>,
        route: "/buckets",
        component: <Buckets />,
    },
    {
        type: "collapse",
        name: "Rule",
        key: "rule",
        icon: <Icon fontSize="small">rule</Icon>,
        route: "/rule",
        component: <Rule />,
    },
    {
        type: "collapse",
        name: "RuleEdit",

        key: "rule-edit",
        icon: <Icon fontSize="small">rule-edit</Icon>,
        route: "/rule-edit",
        component: <RuleEdit />,
    },
    {
        type: "collapse",
        name: "Rules",
        key: "rules",
        icon: <Icon fontSize="small">rules</Icon>,
        route: "/rules",
        component: <Rules />,
    },
    {
        type: "collapse",
        name: "ImportExport",
        key: "import-export",
        icon: <Icon fontSize="small">import-export</Icon>,
        route: "/import-export",
        component: <ImportExport />,
    },
];

