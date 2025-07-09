import * as Yup from "yup";

export interface ICategoryForm {
  nameCategory: string;
  shortDescription?: string;
  isActive: boolean;
}

export function getValidationCategorySchema(): Yup.ObjectSchema<ICategoryForm> {
  return Yup.object().shape({
    nameCategory: Yup.string()
      .max(100, "Tên danh mục không được vượt quá 100 ký tự")
      .required("Tên danh mục là bắt buộc"),

    shortDescription: Yup.string().max(
      500,
      "Mô tả ngắn không được vượt quá 500 ký tự",
    ),

    isActive: Yup.boolean().required(),
  });
}
