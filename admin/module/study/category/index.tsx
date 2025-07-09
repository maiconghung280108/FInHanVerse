import {Category} from "@app/types";
import CreateUpdateCategory from "@module/study/category/CreateUpdateCategory";
import ListCategory from "@module/study/category/ListCategory";
import React, {useState} from "react";

interface CommonProps {
  changeTab: (tab: string) => void;
  setDataActive: (data: Category) => void;
  dataActive?: Category;
}

export function CategoryStudy() {
  const [tab, setTab] = useState("listCategory");
  const [dataActive, setDataActive] = useState<Category>();

  const handleChangeTab = (newTab: string) => {
    setTab(newTab);
  };

  const tabList = {
    listCategory: {
      component: ListCategory as React.ComponentType<CommonProps>,
    },
    createUpdateCategory: {
      component: CreateUpdateCategory as React.ComponentType<CommonProps>,
    },
  };

  return (
    <div className="">
      <div className="form w-full">
        {React.createElement(tabList[tab as keyof typeof tabList].component, {
          changeTab: handleChangeTab,
          setDataActive: setDataActive,
          dataActive: dataActive,
        })}
      </div>
    </div>
  );
}
