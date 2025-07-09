import CreateUpdateQuestion from "@module/study/questions/CreateUpdateQuestion";
import ListQuestion from "@module/study/questions/ListLesson";
import React, {useState} from "react";

interface CommonProps {
  changeTab: (tab: string) => void;
  quizId?: string;
  setQuizId?: (quizId: string) => void;
}

export function QuestionsStudy() {
  const [tab, setTab] = useState("listQuestion");
  const [quizId, setQuizId] = useState<string>("");

  const handleChangeTab = (newTab: string) => {
    setTab(newTab);
    // Reset quizId khi chuyển về tạo mới
    if (newTab === "createUpdateLesson" && tab === "listQuestion") {
      setQuizId("");
    }
  };

  const handleSetQuizId = (id: string) => {
    setQuizId(id);
    setTab("createUpdateLesson");
  };

  const tabList = {
    listQuestion: {
      component: ListQuestion as React.ComponentType<CommonProps>,
    },
    createUpdateLesson: {
      component: CreateUpdateQuestion as React.ComponentType<CommonProps>,
    },
  };

  return (
    <div className="">
      <div className="form w-full">
        {React.createElement(tabList[tab as keyof typeof tabList].component, {
          changeTab: handleChangeTab,
          quizId: quizId || undefined,
          setQuizId: handleSetQuizId,
        })}
      </div>
    </div>
  );
}
