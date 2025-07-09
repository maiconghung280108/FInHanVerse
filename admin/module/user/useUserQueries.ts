import ApiUser from "@api/ApiUser";
import {UserResponse} from "@app/types";
import {useQuery} from "react-query";

export const useListUserData = (params?: {
  keyword?: string;
  page?: number;
  perPage?: number;
  role?: string;
}) => {
  const listUser = (): Promise<UserResponse> => {
    return ApiUser.listUser(params);
  };

  return useQuery(["dataListUser", params], listUser, {
    refetchOnWindowFocus: false,
    retry: 2,
    keepPreviousData: true, // Keep previous data while fetching new data
  });
};
