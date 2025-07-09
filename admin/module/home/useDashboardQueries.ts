import ApiUser from "@api/ApiUser";
import {IDashboardResponse, LessonResponse, QuizListResponse} from "@app/types";
import {useQuery} from "react-query";

export const useDashboardData = () => {
  const getDashBoard = (): Promise<IDashboardResponse> => {
    return ApiUser.getDashBoard();
  };

  return useQuery("dataUser", getDashBoard, {
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useQuizDetail = (quizId?: string) => {
  return useQuery(
    ["quizDetail", quizId],
    () => ApiUser.getQuizDetail(quizId!),
    {
      enabled: !!quizId,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  );
};

export const useCourseDetail = (courseId?: string) => {
  return useQuery(
    ["courseDetail", courseId],
    () => ApiUser.getCourseDetail(courseId!),
    {
      enabled: !!courseId,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  );
};

export const useCourseList = (params?: {
  keyword?: string;
  page?: number;
  perPage?: number;
  status?: string;
}) => {
  const getListCourse = (): Promise<LessonResponse> => {
    return ApiUser.listCourse(params);
  };

  return useQuery(["dataListCourse", params], getListCourse, {
    refetchOnWindowFocus: false,
    retry: 2,
    keepPreviousData: true,
  });
};

export const useQuizList = (params?: {
  keyword?: string;
  page?: number;
  perPage?: number;
  status?: string;
  level?: string;
}) => {
  const getListQuiz = (): Promise<QuizListResponse> => {
    return ApiUser.listQuiz(params);
  };

  return useQuery(["dataListQuiz", params], getListQuiz, {
    refetchOnWindowFocus: false,
    retry: 2,
    keepPreviousData: true,
  });
};
