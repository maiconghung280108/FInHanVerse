import ListLesson from "./ListLesson";
import CreateUpdateLesson from "@module/study/list/CreateUpdateLesson";
import React, {useState} from "react";

interface CommonProps {
  changeTab: (tab: string) => void;
  setCourseId?: (id: string) => void;
  courseId?: string;
}

export function ListStudy() {
  const [tab, setTab] = useState("listLesson");
  const [courseId, setCourseId] = useState<string>("");

  const handleChangeTab = (newTab: string) => {
    if (newTab === "listLesson") {
      setCourseId(""); // Reset courseId when going back to list
    }
    setTab(newTab);
  };

  const handleSetCourseId = (id: string) => {
    setCourseId(id);
    setTab("createUpdateLesson"); // Auto switch to edit mode
  };

  const tabList = {
    listLesson: {
      component: ListLesson as React.ComponentType<CommonProps>,
    },
    createUpdateLesson: {
      component: CreateUpdateLesson as React.ComponentType<CommonProps>,
    },
  };

  return (
    <div className="">
      <div className="form w-full">
        {React.createElement(tabList[tab as keyof typeof tabList].component, {
          changeTab: handleChangeTab,
          setCourseId: handleSetCourseId,
          courseId: courseId,
        })}
      </div>
    </div>
  );
}
