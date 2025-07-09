import "./index.scss";
import {UserOutlined} from "@ant-design/icons";
import {logoutUser} from "@slices/UserSlice";
import {Avatar, Popconfirm, Tooltip} from "antd";
import {useRouter} from "next/router";
import React from "react";
import {useDispatch} from "react-redux";

export default function Navbar(): JSX.Element {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div className="navbar flex items-center justify-end px-4 py-2 bg-white shadow-sm">
      <div className="group-user-info">
        <Popconfirm
          placement="bottomRight"
          title="Bạn có chắc muốn đăng xuất?"
          okText="Đăng xuất"
          cancelText="Huỷ"
          onConfirm={() => {
            dispatch(logoutUser());
            router.push("/login");
          }}
        >
          <Tooltip title="Tài khoản của bạn">
            <div className="cursor-pointer flex items-center gap-2 hover:bg-gray-100 p-2 rounded transition-all duration-200">
              <Avatar
                size="large"
                icon={<UserOutlined />}
                style={{backgroundColor: "#87d068"}}
              />
              <span className="hidden md:inline font-medium text-sm">
                Admin
              </span>
            </div>
          </Tooltip>
        </Popconfirm>
      </div>
    </div>
  );
}
