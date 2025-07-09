import ApiUser from "@api/ApiUser";
import GlobalButton from "@app/components/GlobalButton";
import Config from "@app/config";
import {logo} from "@app/config/images";
import FormGlobal from "@components/Form/FormGlobal";
import TextInputForm from "@components/Form/TextInputForm";
import {
  ISignInForm,
  getValidationSignInSchema,
} from "@module/login/SignIn/form-config";
import {loginUser} from "@slices/UserSlice";
import Image from "next/image";
import {useRouter} from "next/router";
import React from "react";
import {useMutation} from "react-query";
import {useDispatch} from "react-redux";

export interface ISignInProps {
  changeTab: (tab: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SignIn({changeTab}: ISignInProps) {
  const requestLoginMutation = useMutation(ApiUser.login);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleNextScreen = (value: ISignInForm) => {
    const data = {
      email: value.email,
      password: value.password,
    };
    requestLoginMutation.mutate(data, {
      onSuccess: (res) => {
        console.log(res);
        // Store user data in Redux
        dispatch(loginUser(res));
        // Navigate to home page
        router.push(Config.PATHNAME.HOME);
      },
    });
  };

  return (
    <FormGlobal<ISignInForm>
      resolver={getValidationSignInSchema()}
      onSubmit={handleNextScreen}
      render={({handleSubmitForm, watch}) => {
        const disabledButton = watch().email && watch().password;

        return (
          <div className="flex flex-col justify-center items-center w-full">
            <Image src={logo} alt="logo" className="mb-4 h-[150px] w-[150px]" />
            <div className="text-[#212B36] font-semibold text-2xl md:text-3xl mb-10">
              Chào mừng bạn trở lại
            </div>
            <TextInputForm
              className="mb-2"
              placeholder="Nhập email"
              name="email"
              onPressEnter={handleSubmitForm}
            />
            <TextInputForm
              placeholder="Nhập mật khẩu"
              name="password"
              onPressEnter={handleSubmitForm}
            />
            <div className="flex justify-end items-end w-full">
              <div className="underline mt-4 text-xs">Quên mật khẩu?</div>
            </div>
            <GlobalButton
              disabled={!disabledButton}
              onClick={handleSubmitForm}
              className="mt-6 primary"
            >
              <span className="text-lg-semibold">Đăng nhập</span>
            </GlobalButton>
          </div>
        );
      }}
    />
  );
}
