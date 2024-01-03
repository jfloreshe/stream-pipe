"use client";
import { Navbar, Sidebar } from "./Components";
import React, { useState } from "react";
import { Menu } from "./Icons/Icons";
import { Session } from "next-auth";

interface LayoutProps {
  children: JSX.Element;
  closeSidebar?: boolean;
  session: Session | null;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
export default function Layout({ children, closeSidebar, session }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar
        session={session}
      >
        <button
          type="button"
          className="-mx-2 inline-flex items-center  justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          onClick={() => setSidebarOpen(true)}          
        >
          <Menu className="h-6 w-6 stroke-gray-400" aria-hidden="true" />
        </button>
      </Navbar>

      <Sidebar
        isOpen={sidebarOpen}
        closeSidebar={closeSidebar}
        setSidebarOpen={setSidebarOpen}
        session={session}
      ></Sidebar>

      <div className={classNames(closeSidebar ? "lg:pl-20" : "lg:pl-56")}>
        <main className="py-24">
          <div className=" mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-x-4">{children}</div>
          </div>
        </main>
      </div>
    </>
  );
}
