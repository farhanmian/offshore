import React, { Fragment } from "react";
import { useRouter } from "next/router";

import SideBar from "./SideBar";
import Header from "./Header";
import Footer from "./Footer";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  const condition =
    router.pathname !== "/admin" &&
    router.pathname !== "admin/dashboard" &&
    router.pathname !== "/admin/signIn";

  const sideBarCondition = router.pathname.includes("/admin");

  return (
    <Fragment>
      {condition && <Header />}

      {condition && sideBarCondition && <SideBar />}
      <main
        className={`${
          condition ? `${sideBarCondition && "pl-65"} pt-20` : ""
        } flex-1 min-h-[90vh]`}
      >
        {children}
      </main>
      {condition && <Footer />}
    </Fragment>
  );
};
export default Layout;
