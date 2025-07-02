"use client";

import React from "react";
import { Sidebar } from "flowbite-react";
import SidebarContent from "./Sidebaritems";
import NavItems from "./NavItems";
import NavCollapse from "./NavCollapse";
import SimpleBar from "simplebar-react";
import FullLogo from "../../shared/logo/FullLogo";
import { Icon } from "@iconify/react";
import { useAuth } from "@/contexts/AuthContext";
import { PERMISSION_ACTIONS } from "@/utils/permissions";
import type { MenuItem, ChildItem } from "./Sidebaritems";

const SidebarLayout = () => {
  const { hasPermission, user } = useAuth();

  const filterMenu = (items: MenuItem[]): MenuItem[] =>
    items
      .map((item: MenuItem) => ({
        ...item,
        children: item.children
          ? item.children.filter((child: ChildItem) => {
            if (child.module) {
              return hasPermission(child.module.toUpperCase(), PERMISSION_ACTIONS.READ);
            }
            if (child.role) {
              return user?.role?.name === child.role;
            }
            return true;
          })
          : [],
      }))
      .filter((item: MenuItem) => !item.children || item.children.length > 0);

  return (
    <>
      <div className="xl:block hidden">
        <div className="flex">
          <Sidebar
            className="fixed menu-sidebar pt-6 bg-white dark:bg-darkgray z-[10]"
            aria-label="Sidebar with multi-level dropdown example"
          >
            <div className="mb-7 px-6 brand-logo">
              <FullLogo />
            </div>

            <SimpleBar className="h-[calc(100vh_-_120px)]">
              <Sidebar.Items className="px-6">
                <Sidebar.ItemGroup className="sidebar-nav">
                  {filterMenu(SidebarContent).map((item, index) => (
                    <React.Fragment key={index}>
                      <h5 className="text-link text-xs caption">
                        <span className="hide-menu">{item.heading}</span>
                      </h5>
                      <Icon
                        icon="solar:menu-dots-bold"
                        className="text-ld block mx-auto mt-6 leading-6 dark:text-opacity-60 hide-icon"
                        height={18}
                      />

                      {item.children?.map((child, index) => (
                        <React.Fragment key={child.id && index}>
                          {child.children ? (
                            <div className="collpase-items">
                              <NavCollapse item={child} />
                            </div>
                          ) : (
                            <NavItems item={child} />
                          )}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </SimpleBar>
          </Sidebar>
        </div>
      </div>
    </>
  );
};

export default SidebarLayout;
