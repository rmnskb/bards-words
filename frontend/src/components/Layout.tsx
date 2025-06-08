import { Outlet } from "react-router";

import Header from "./Header.tsx"


// TODO: Add common header and footer
const Layout = () => {
  return (
    <div className="
      min-h-screen font-baskerville
      bg-[#F5F0E1] dark:bg-[#2A2F3E]
    ">
      <Header/>
      <Outlet/>
    </div>
  );
};

export default Layout;
