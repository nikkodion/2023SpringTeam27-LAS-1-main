
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Bucket from './pages/Bucket';
import Buckets from './pages/Buckets';
import Rule from './pages/Rule';
import CreateRule from 'pages/CreateRule';
import Rules from './pages/Rules';
import ImportExport from './pages/ImportExport';
import Cookies from 'universal-cookie';
// @mui icons
import Icon from "@mui/material/Icon";
const Cookie = new Cookies();
let routes = []
if (Cookie.get('permissions') == 1) {
    routes = [
        {
            type: "collapse",
            name: "Dashboard",
            key: "dashboard",
            icon: <Icon fontSize="small">dashboard</Icon>,
            route: "/dashboard",
            component: <Dashboard />,
        },
        {
            
            route: "/login",
            component: <Login />,
        },
        {
            
            route: "/bucket/:id",
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
            
            route: "/rule/:id",
            component: <Rule />,
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
            name: "Create Rule",
            key: "createrule",
            icon: <Icon fontSize="small">createrule</Icon>,
            route: "/createrule",
            component: <CreateRule />,
        },
        {
            type: "collapse",
            name: "Import/Export Config",
            key: "importexport",
            icon: <Icon fontSize="small">import/export</Icon>,
            route: "/importexport",
            component: <ImportExport />,
        },
        
        
    ] } else {
    routes = [
        {
            type: "collapse",
            name: "Dashboard",
            key: "dashboard",
            icon: <Icon fontSize="small">dashboard</Icon>,
            route: "/dashboard",
            component: <Dashboard />,
        },
        {
            
            route: "/login",
            component: <Login />,
        },
        {
            
            route: "/bucket/:id",
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
            
            route: "/rule/:id",
            component: <Rule />,
        },
        {
            type: "collapse",

            name: "Rules",
            key: "rules",
            icon: <Icon fontSize="small">rules</Icon>,
            route: "/rules",
            component: <Rules />,
        },
        
        
    ] }

export default routes;