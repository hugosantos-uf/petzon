"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Provider store={store}>
          <NavBar />
          {children}
          <Footer />
        </Provider>
      </div>
    </>
  );
}
