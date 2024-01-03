"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Close, Home, Logo, MessagePlusSquare, User, VideoRecorder, Lock, File, LogOut } from "./Icons/Icons";
import { type Session } from "next-auth";
import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button, UserImage } from "./Components";

interface SidebarProps {
    isOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    closeSidebar?: boolean;
    session: Session | null;
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

export default function Sidebar({ isOpen, setSidebarOpen, closeSidebar, session }: SidebarProps) {    
    const pathname = usePathname();
    const router = useRouter();    
    const userId = session?.user.id;

    const DesktopNavigation: NavigationItem[] = [
        {
            name: "Inicio",
            path: "/",
            icon: (className) => <Home className={className} />,
            current: pathname === "/",
        },
        {
            name: "Mis Videos",
            path: userId ? `/${String(userId)}/ProfileVideos` : "sign-in",
            icon: (className) => <VideoRecorder className={className} />,
            current: pathname === `/${String(userId)}/ProfileVideos`,
        }
    ];

    const SignedInMobileNavigation: NavigationItem[] = [
        {
            name: "Ver Perfil",
            path: `/${String(userId)}/ProfileVideos`,
            icon: (className) => <User className={className} />,
            current: pathname === `/Profile`,
        },
        {
            name: "Mis Videos",
            path: userId ? `/${String(userId)}/ProfileVideos` : "sign-in",
            icon: (className) => <VideoRecorder className={className} />,
            current: pathname === `/${String(userId)}/ProfileVideos`,
        },
        {
            name: "Subir Video",
            path: `/Dashboard`,
            icon: (className) => <MessagePlusSquare className={className} />,
            current: pathname === `/CreatorStudio`,
        },
    ];

    const SignedOutMobileNavigation: NavigationItem[] = [
        {
            name: "Inicio",
            path: "/",
            icon: (className) => <Home className={className} />,
            current: pathname === "/",
        },
        {
            name: "Mis Videos",
            path: userId ? `/${String(userId)}/ProfileVideos` : "sign-in",
            icon: (className) => <VideoRecorder className={className} />,
            current: pathname === `/${String(userId)}/ProfileVideos`,
        }
    ];

    const mobileNavigation = session
        ? SignedInMobileNavigation
        : SignedOutMobileNavigation;

    useEffect(() => {
        DesktopNavigation.forEach((nav) => {
            nav.current = nav.path === pathname;
        });
        mobileNavigation.forEach((nav) => {
            nav.current = nav.path === pathname;
        });
    }, [pathname]);

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
                                    <Link 
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (item.path === "sign-in") {
                                              void router.push("/api/auth/signin");
                                            } else {
                                              void router.push(item.path || "/");
                                            }
                                          }}
                                        className={classNames(
                                            item.current
                                              ? " bg-gray-50 text-primary-600"
                                              : " text-gray-700 hover:bg-gray-50 hover:text-primary-600",
                                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                        )}
                                    >
                                        {item.current
                                            ? item.icon("h-5 w-5 shrink-0 stroke-primary-600 ")
                                            : item.icon("h-5 w-5 shrink-0  stroke-gray-500  group-hover:stroke-primary-600")
                                        }
                                        <p className={classNames(closeSidebar ? "hidden" : "")}>
                                            {item.name}
                                        </p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                </ul>
                </nav>
            </div>
        </div>
        <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>

                    <Close className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                {/* Sidebar component FOR MOBILE, swap this element with another sidebar if you like */}
                <div className=" flex grow  flex-col gap-y-5 overflow-y-auto border-r  border-gray-200 bg-white  px-6 pb-4">
                  <nav className="flex flex-1 flex-col pt-4">
                    <ul role="list" className="flex flex-1 flex-col gap-y-4">
                      <Logo className="w-24" />
                      <li className="border-t">
                        <ul role="list" className="-mx-2 space-y-1  pt-3 ">
                          {mobileNavigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.path || "/"}
                                onClick={(e) => {
                                  e.preventDefault();
                                  void router.push(item.path || "/");
                                }}
                                className={classNames(
                                  item.current
                                    ? " bg-gray-50 text-primary-600"
                                    : " text-gray-700 hover:bg-gray-50 hover:text-primary-600",
                                  "group flex gap-x-3 rounded-md px-2 py-1.5 text-sm font-semibold leading-6"
                                )}
                              >
                                {item.current
                                  ? item.icon(
                                      "h-5 w-5 shrink-0 stroke-primary-600"
                                    )
                                  : item.icon(
                                      "h-5 w-5 shrink-0  stroke-gray-500  group-hover:stroke-primary-600"
                                    )}
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <div className="mt-auto">                      
                      {session ? (

                        <div className="my-2 flex flex-row bg-blue-300">
                          <UserImage image={session?.user.image || ""} />
                          <div className="ml-2 flex w-full flex-col  justify-start truncate text-sm ">
                            <p className="font-semibold text-gray-700">
                              {session && (
                                <span>{session.user?.name}</span>
                              )}
                            </p>
                            <p className=" text-gray-600">
                              {session && (
                                <span>{session.user?.email}</span>
                              )}
                            </p>
                          </div>
                          <Button variant="tertiary-gray" href="#" size="lg">
                            <LogOut className="w-5 stroke-gray-600" />
                          </Button>
                        </div>
                      ) : (
                        <li className="space-y-2">
                          <Button
                            variant="primary"
                            size="2xl"
                            className="w-full"
                            onClick={(e) => {
                              e.preventDefault();
                              {
                                void router.push("/api/auth/signin");
                              }
                            }}
                          >
                            {" "}
                            Sign Up
                          </Button>
                          <Button
                            variant="secondary-gray"
                            size="2xl"
                            className="w-full"
                            onClick={(e) => {
                              e.preventDefault();
                              {
                                void router.push("/api/auth/signin");
                              }
                            }}
                          >
                            {" "}
                            Log In
                          </Button>
                        </li>
                      )}
                      </div>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>                                
      </>
    )
}