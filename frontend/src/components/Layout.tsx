import {Outlet} from "react-router";

// TODO: Add common header and footer
const Layout = () => {
    return (
        <div className="min-h-screen bg-[#F5F0E1]">
            <Outlet/>
        </div>
    );
};

export default Layout;
