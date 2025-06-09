import { Outlet, useLocation } from "react-router";

import Header from "./Header.tsx"


// TODO: Add common header and footer
const Layout = () => {
  const location = useLocation();
  const showHeader = location.pathname !== "/";

  return (
    <div className="
      min-h-screen font-baskerville
      bg-parchment dark:bg-leather
      text-quill dark:text-moonlight
    ">
      {showHeader && <Header />}
      <Outlet />
    </div>
  );
};

export default Layout;
