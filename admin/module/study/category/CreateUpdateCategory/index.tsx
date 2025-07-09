"use client";

import ApiUser from "../../../../api/ApiUser";
import {ICategoryForm, getValidationCategorySchema} from "./form-config";
import {Category} from "@app/types";
import Tag from "@app/utils";
import {yupResolver} from "@hookform/resolvers/yup";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, {useEffect} from "react";
import {Controller, useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "react-query";

export interface ICreateUpdateCategoryProps {
  changeTab?: (tab: string) => void;
  dataActive?: Category;
  setDataActive?: (data: Category | undefined) => void;
}

export default function CreateUpdateCategory({
  changeTab,
  dataActive,
  setDataActive,
}: ICreateUpdateCategoryProps) {
  const createCategoryMutation = useMutation(ApiUser.createCategory);
  const updateCategoryMutation = useMutation(
    ({id, data}: {id: string | number; data: any}) =>
      ApiUser.updateCategory(id, data),
  );
  const queryClient = useQueryClient();

  const isEditMode = !!dataActive;

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<ICategoryForm>({
    defaultValues: {
      nameCategory: "",
      shortDescription: "",
      isActive: false,
    },
    resolver: yupResolver(getValidationCategorySchema()),
  });

  useEffect(() => {
    if (dataActive) {
      reset({
        nameCategory: dataActive.title || "",
        shortDescription: dataActive.description || "",
        isActive: dataActive.status === "published",
      });
    } else {
      reset({
        nameCategory: "",
        shortDescription: "",
        isActive: false,
      });
    }
  }, [dataActive, reset]);

  const onSubmit = (data: ICategoryForm) => {
    const categoryData = {
      title: data.nameCategory,
      description: data.shortDescription || "",
      status: data.isActive ? "published" : "draft",
    };

    if (isEditMode && dataActive) {
      updateCategoryMutation.mutate(
        {id: dataActive.id, data: categoryData},
        {
          onSuccess: (response) => {
            console.log("Category updated successfully:", response);
            queryClient.invalidateQueries("dataCategory");
            if (changeTab) {
              changeTab("listCategory");
            }
          },
          onError: (error) => {
            console.error("Error updating category:", error);
          },
        },
      );
    } else {
      createCategoryMutation.mutate(categoryData, {
        onSuccess: (response) => {
          console.log("Category created successfully:", response);
          queryClient.invalidateQueries("dataCategory");
          if (changeTab) {
            changeTab("listCategory");
          }
        },
        onError: (error) => {
          console.error("Error creating category:", error);
        },
      });
    }
  };

  const isLoading =
    createCategoryMutation.isLoading || updateCategoryMutation.isLoading;

  return (
    <>
      <div className="p-4">
        <Box>
          <h4 className="font-bold mb-1 text-2xl">
            {isEditMode ? "Cập nhật danh mục" : "Thêm danh mục"}
          </h4>
          <div className="text-gray-400 text-sm flex mt-2">
            <span className="text-[#212B36]">Bảng điều khiển</span> <Tag />{" "}
            <span className="text-[#212B36]">Bài học</span> <Tag />{" "}
            {isEditMode ? "Cập nhật danh mục" : "Thêm danh mục"}
          </div>
        </Box>
      </div>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto p-4"
      >
        <Accordion defaultExpanded className="mb-6 shadow-sm border">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="div">
              <div className="font-semibold text-lg">Chi tiết</div>
              <div className="text-[#637381] font-light">
                Tiêu đề, mô tả ngắn
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Controller
              name="nameCategory"
              control={control}
              render={({field}) => (
                <TextField
                  {...field}
                  label="Tên danh mục"
                  fullWidth
                  margin="normal"
                  className="border border-[#919EAB52]"
                  error={!!errors.nameCategory}
                  helperText={errors.nameCategory?.message}
                />
              )}
            />
            <Controller
              name="shortDescription"
              control={control}
              render={({field}) => (
                <TextField
                  {...field}
                  label="Mô tả ngắn"
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  className="border border-[#919EAB52]"
                  error={!!errors.shortDescription}
                  helperText={errors.shortDescription?.message}
                />
              )}
            />
          </AccordionDetails>
        </Accordion>

        <Box className="flex justify-between">
          <div className="flex gap-2 items-center">
            <Controller
              name="isActive"
              control={control}
              render={({field}) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      onBlur={field.onBlur}
                    />
                  }
                  label="Xuất bản"
                />
              )}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (setDataActive) {
                  setDataActive(undefined);
                }
                if (changeTab) {
                  changeTab("listCategory");
                }
              }}
              className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#212B36] text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-900 disabled:opacity-50"
            >
              {isLoading
                ? isEditMode
                  ? "Đang cập nhật..."
                  : "Đang tạo..."
                : isEditMode
                ? "Cập nhật danh mục"
                : "Tạo danh mục"}
            </button>
          </div>
        </Box>
      </Box>
    </>
  );
}
