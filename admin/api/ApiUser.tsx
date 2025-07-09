import store from "../redux/store";
import {
  CategoryResponse,
  IAccountInfo,
  IAccountRole,
  IDashboardResponse,
  IUserLogin,
  LessonResponse,
  QuizListResponse,
  UserResponse,
} from "../types";
import {fetcher} from "./Fetcher";

export interface ILoginBody {
  email: string;
  password: string;
}

export interface ICreateCategoryBody {
  title: string;
  description: string;
  status: string;
}

export interface IUpdateCategoryBody {
  title: string;
  description: string;
  status: string;
}

export interface ICreateQuizData {
  title: string;
  level: string;
  status: string;
  questions: Array<{
    text: string;
    isMultiple: boolean;
    explanation?: string | null;
    image?: string | null;
    answers: Array<{
      text: string;
      isCorrect: boolean;
    }>;
  }>;
}

export interface ICreateCourseData {
  title: string;
  description: string;
  content: string;
  categoryId: number;
  status: string;
  quizzes?: Array<{
    title: string;
    questions: Array<{
      text: string;
      isMultiple: boolean;
      answers: Array<{
        text: string;
        isCorrect: boolean;
      }>;
    }>;
  }>;
  questions?: Array<{
    title: string;
    questions: Array<{
      text: string;
      isMultiple: boolean;
      answers: Array<{
        text: string;
        isCorrect: boolean;
      }>;
    }>;
  }>;
}

export interface ICourseDetailResponse {
  id: number;
  title: string;
  description: string;
  content: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  image?: string;
  category: {
    id: number;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  quizzes: Array<{
    id: number;
    title: string;
    questions: Array<{
      id: number;
      text: string;
      isMultiple: boolean;
      answers: Array<{
        id: number;
        text: string;
        isCorrect: boolean;
      }>;
    }>;
  }>;
}

export interface IQuizDetailResponse {
  id: number;
  title: string;
  courseId: number | null;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  questions: Array<{
    id: number;
    text: string;
    quizId: number;
    isMultiple: boolean;
    explanation: string | null;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    answers: Array<{
      id: number;
      text: string;
      isCorrect: boolean;
      questionId: number;
      createdAt: string;
      updatedAt: string;
    }>;
  }>;
}

const path = {
  auth: "/auth",
  user: "/user",
  dashboard: "/dashboard",
  courses: "/courses",
  quiz: "/quiz",
  admin: "/admin",
  categories: "/categories",
};

function getMe(): Promise<IUserLogin> {
  return fetcher({url: path.user + "/me", method: "get"});
}

function getDashBoard(): Promise<IDashboardResponse> {
  return fetcher({url: path.dashboard + "/stats", method: "get"});
}

function listCourse(params?: {
  keyword?: string;
  page?: number;
  perPage?: number;
  status?: string;
}): Promise<LessonResponse> {
  return fetcher({url: path.courses, method: "get", params});
}

function listQuiz(params?: {
  keyword?: string;
  page?: number;
  perPage?: number;
  status?: string;
  level?: string;
}): Promise<QuizListResponse> {
  return fetcher({url: path.quiz + "/index", method: "get", params: params});
}

function listCategory(params?: {
  keyword?: string;
  page?: number;
  perPage?: number;
  status?: string;
}): Promise<CategoryResponse> {
  return fetcher({url: path.categories, method: "get", params});
}

function createCategory(body: ICreateCategoryBody): Promise<any> {
  return fetcher({url: path.categories, method: "post", data: body});
}

function updateCategory(
  id: string | number,
  body: IUpdateCategoryBody,
): Promise<any> {
  return fetcher({
    url: `${path.categories}/${id}`,
    method: "patch",
    data: body,
  });
}

function deleteCategory(id: string | number): Promise<any> {
  return fetcher({
    url: `${path.categories}/${id}`,
    method: "delete",
  });
}

function listUser(params?: {
  keyword?: string;
  page?: number;
  perPage?: number;
  role?: string;
}): Promise<UserResponse> {
  return fetcher({
    url: path.admin + "/users",
    method: "get",
    params,
  });
}

function login(body: ILoginBody): Promise<IAccountInfo> {
  return fetcher(
    {url: path.auth + "/signin", method: "post", data: body},
    {displayError: true},
  );
}

function isLogin(): boolean {
  return !!getAuthToken();
}

function getAuthToken(): string | undefined {
  const {user} = store.getState();
  return user?.access_token;
}

function getUserRole(): IAccountRole | undefined {
  const {user} = store.getState();
  return user?.role === "admin" ? IAccountRole.ADMIN : IAccountRole.USER;
}

function createQuizWithQuestions(data: ICreateQuizData | FormData): Promise<any> {
  return fetcher({
    url: path.quiz + "/create-with-questions",
    method: "post",
    data,
  });
}

function getQuizDetail(id: string | number): Promise<IQuizDetailResponse> {
  return fetcher({
    url: `${path.quiz}/${id}`,
    method: "get",
  });
}

function updateQuizWithQuestions(
  id: string | number,
  data: ICreateQuizData | FormData,
): Promise<any> {
  return fetcher({
    url: `${path.quiz}/${id}/update-with-questions`,
    method: "post",
    data,
  });
}

function deleteQuiz(id: string | number): Promise<any> {
  return fetcher({
    url: `${path.quiz}/${id}`,
    method: "delete",
  });
}

function createCourse(data: ICreateCourseData | FormData): Promise<any> {
  const config: any = {
    url: path.courses,
    method: "post",
    data,
  };

  // If data is FormData, set appropriate headers
  if (data instanceof FormData) {
    config.headers = {
      "Content-Type": "multipart/form-data",
    };
  }

  return fetcher(config);
}

function getCourseDetail(id: string | number): Promise<ICourseDetailResponse> {
  return fetcher({
    url: `${path.courses}/${id}`,
    method: "get",
  });
}

function updateCourse(
  id: string | number,
  data: ICreateCourseData | FormData,
): Promise<any> {
  const config: any = {
    url: `${path.courses}/${id}`,
    method: "post", // Changed to POST as per API documentation
    data,
  };

  // If data is FormData, set appropriate headers
  if (data instanceof FormData) {
    config.headers = {
      "Content-Type": "multipart/form-data",
    };
  }

  return fetcher(config);
}

function deleteCourse(id: string | number): Promise<any> {
  return fetcher({
    url: `${path.courses}/${id}`,
    method: "delete",
  });
}

export default {
  login,
  isLogin,
  getAuthToken,
  getUserRole,
  getMe,
  getDashBoard,
  listCourse,
  listQuiz,
  listUser,
  listCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  createQuizWithQuestions,
  getQuizDetail,
  updateQuizWithQuestions,
  deleteQuiz,
  createCourse,
  getCourseDetail,
  updateCourse,
  deleteCourse,
};
