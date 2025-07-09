import {IAccountRole} from "../types";
import IconDashboard2 from "@components/Icon/sidebar/IconDashboard2";
import IconDashboardActive from "@components/Icon/sidebar/IconDashboardActive";
import IconLesson from "@components/Icon/sidebar/IconLesson";
import IconLessonActive from "@components/Icon/sidebar/IconLessonActive";
import IconUser from "@components/Icon/sidebar/IconUser";
import IconUserActive from "@components/Icon/sidebar/IconUserActive";
import {ReactElement} from "react";

// Extended Route type for internal use
export interface ExtendedRoute {
  isHeader?: boolean;
  path: string;
  name: string;
  role?: Array<IAccountRole>;
  icon?: ReactElement;
  iconActive?: ReactElement;
  isSidebar?: boolean;
  isPrivate?: boolean;
  isPublic?: boolean;
  isUpdating?: boolean;
  isAuth?: boolean;
  isSSR?: boolean;
  children?: ExtendedRoute[];
}

const routes: ExtendedRoute[] = [
  {
    path: "/header-overview",
    name: "TỔNG QUAN",
    icon: undefined,
    isHeader: true,
    isSidebar: true,
  },
  {
    path: "/",
    name: "Bảng điều khiển",
    icon: <IconDashboard2 />,
    iconActive: <IconDashboardActive />,
    isSSR: true,
    isSidebar: true,
  },
  {
    path: "/header-admin",
    name: "QUẢN LÝ",
    icon: undefined,
    isHeader: true,
    isSidebar: true,
  },
  {
    path: "/user",
    name: "Người dùng",
    icon: <IconUser />,
    iconActive: <IconUserActive />,
    isSidebar: true,
  },
  {
    path: "/study",
    name: "Bài học",
    icon: <IconLesson />,
    iconActive: <IconLessonActive />,
    isSidebar: true,
    children: [
      {
        path: "/list",
        name: "Danh sách bài học",
        isSidebar: true,
      },
      {
        path: "/categories",
        name: "Danh mục bài học",
        isSidebar: true,
      },
      {
        path: "/questions",
        name: "Bộ câu hỏi",
        isSidebar: true,
      },
    ],
  },
];

export default routes;
