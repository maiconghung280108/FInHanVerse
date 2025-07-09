import ApiUser from "@api/ApiUser";
import {CategoryResponse} from "@app/types";
import {useQuery} from "react-query";

export const useCategory = (params?: {
  keyword?: string;
  page?: number;
  perPage?: number;
  status?: string;
}) => {
  const getListCategory = (): Promise<CategoryResponse> => {
    return ApiUser.listCategory(params);
  };

  return useQuery(["dataCategory", params], getListCategory, {
    refetchOnWindowFocus: false,
    retry: 2,
    keepPreviousData: true, // Keep previous data while fetching new data
  });
};
