"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import path from 'path';
import { Home } from "./Icons/Icons";

interface SidebarProps {
    // isOpen: boolean;
    // setSidebarOpen: (open: boolean) => void;
    closeSidebar?: boolean;
}

interface NavigationItem {
    name: string;
    path?: string;
    icon: (className: string) => JSX.Element;
    current: boolean;
}
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function Sidebar({ /*isOpen, setSidebarOpen,*/ closeSidebar }: SidebarProps) {    
    const pathname = usePathname();

    const DesktopNavigation: NavigationItem[] = [
        {
            name: "Home",
            path: "/",
            icon: (className) => <Home className={className} />,
            current: pathname === "/",
        }
    ]
    return(
        <>
        <div 
            className={classNames(
                closeSidebar ? "lg:w-20" : "lg:w-56",
                "bottom-0 top-16  hidden lg:fixed lg:z-40 lg:flex lg:flex-col"
            )}
        >
            <div className="flex grow flex-col gap-y-5 overflow-y-auto border border-gray-200 bg-white px-6 pb-4">
                <nav className="flex flex-1 flex-col pt-8">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-1">
                            {DesktopNavigation.map((item) => (
                                <li key={item.name}>
                                    <Link href="#">
                                    {item.current
                                        ? item.icon("h-5 w-5 shrink-0 stroke-primary-600 ")
                                        : item.icon("h-5 w-5 shrink-0  stroke-gray-500  group-hover:stroke-primary-600")
                                    }
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                    <li className="mt-auto">

                    </li>
                </ul>
                </nav>
            </div>
        </div>
        </>
    )
}