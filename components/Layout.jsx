import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Head from 'next/head';

// type Props = {
//   children: ReactNode;
// };

const Layout = (props) => (
  <div className="  w-full">
    <Head>
      <link rel="shortcut icon" href="/images/favicon.ico" />
    </Head>
    <Header />
    <div className="layout md:px-6 lg:px-7 pb-20 ">{props.children}</div>
    <Footer />
  </div>
);

export default Layout;
