import React from "react";

export interface CommonReactProps {
  children: React.ReactNode;
}

export enum IAccountRole {
  USER = 0,
  ADMIN = 1,
  ANONYMOUS = 2,
}

export enum IState {
  INACTIVE,
  ACTIVE,
  DELETED,
}

interface IPhoneNumber {
  phoneNumber: string;
  primary: boolean;
}

interface IEmail {
  email: string;
  primary: boolean;
}

export interface IPaymentMethod {
  paymentName: string;
  balance?: number;
  id?: string;
}

export interface IUserLogin {
  id?: string;
  username?: string;
  fullName?: string;
  state?: IState;
  email?: IEmail[];
  dateOfBirth?: string;
  positionId?: number;
  avatar?: string;
  banner?: string;
  wallPaper?: string;
  personId?: number;
  address?: string;
  phoneNumber?: IPhoneNumber[];
  province?: string;
  provinceName?: string;
  country?: string;
  countryName?: string;
  role?: {
    id?: IAccountRole;
    roleName?: string;
  };
  phoneNumberRelative?: string;
  baseSalary?: number;
  manageSalary?: number;
  gender?: string;
  fullyUpdateProfile?: boolean;
  payment?: IPaymentMethod[];
  cityList?: string[];
  firstName?: string;
  lastName?: string;
  personalPageLink?: string;
  allowProfileSharing?: boolean;
  allowPersonalInformationShowing?: boolean;
  allowDateOfBirthShowing?: boolean;
  allowGenderShowing?: boolean;
  allowCurrentCityShowing?: boolean;
  allowHometownShowing?: boolean;
  allowContactInforShowing?: boolean;
  allowEmailShowing?: boolean;
  allowPhoneShowing?: boolean;
  hasPassword?: boolean;
  language?: string;
}

export interface IAccountInfo {
  access_token?: string;
  refresh_token?: string;
  role?: string;
}

export interface IDashboardResponse {
  totalCourses: number;
  totalUsers: number;
  totalQuizzes: number;
}

export interface Category {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  image: string;
  content: string;
  status: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  categoryId: number;
  category: Category;
}

export interface LessonResponse {
  data: Lesson[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface QuizItem {
  id: number;
  title: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  status: "draft" | "published";
  courseId: number | null;
  createdAt: string; // ISO date string (e.g., "2025-04-19T11:26:07.474Z")
  updatedAt: string;
  totalQuestions: number;
}

export interface QuizListResponse {
  data: QuizItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface User {
  id: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  email: string;
  fullName: string;
  password: string;
  avatar: string | null;
  isVerified: boolean;
  role: "user" | "admin";
}

export interface UserResponse {
  data: User[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface CategoryResponse {
  data: Category[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
