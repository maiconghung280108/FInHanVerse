import "./index.scss";
import {bgLogin} from "@app/config/images";
import {ForgotPassword} from "@module/login/ForgotPassword";
import {SignIn} from "@module/login/SignIn";
import Image from "next/image";
import React, {useState} from "react";

export function Login(): JSX.Element {
  const [tab, setTab] = useState("signIn");
  // const user = useSelector((state: IRootState) => state.user);

  const tabList = {
    signIn: {
      component: SignIn,
    },
    forgotPassword: {
      component: ForgotPassword,
    },
  };

  return (
    <div className="flex">
      <Image
        src={bgLogin}
        alt="bg-logn"
        className="h-screen w-[70%] object-cover hidden md:block"
      />
      <div className="p-6 md:p-[30px] flex items-center md:w-[30%] w-full">
        <div className="form w-full">
          {React.createElement(tabList[tab as keyof typeof tabList].component, {
            changeTab: setTab,
          })}
        </div>
      </div>
    </div>
  );
}
