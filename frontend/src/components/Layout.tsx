import { Outlet } from "react-router";

import Header from "./Header.tsx"


// TODO: Add common header and footer
const Layout = () => {
  return (
    <div className="
      min-h-screen font-baskerville
      bg-parchment dark:bg-leather
      text-quill dark:text-moonlight
    ">
      <Header/>
      <Outlet/>
    </div>
  );
};

export default Layout;
