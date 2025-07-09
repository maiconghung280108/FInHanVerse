import "./styles.css";
import {
  useCourseList,
  useDashboardData,
  useQuizList,
} from "./useDashboardQueries";
import Config from "@app/config";
import {Lesson, QuizItem} from "@app/types";
import {formatISODate, renderLevelName} from "@app/utils";
import IconLesson from "@components/Icon/home/IconLesson";
import IconQuestion from "@components/Icon/home/IconQuestion";
import IconUser from "@components/Icon/home/IconUser";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Box,
  Card,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {useRouter} from "next/router";
import React from "react";

// Status chip component
function StatusChip({status}: {status: string}) {
  const isPublished = status === "published";
  return (
    <Chip
      label={status === "published" ? "Đã xuất bản" : "Bản nháp"}
      size="small"
      className={isPublished ? "status-chip-published" : "status-chip-draft"}
    />
  );
}

export function Home(): JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const {data: dataDashBoard, isLoading, isError, refetch} = useDashboardData();

  const {
    data: dataListCourse,
    isLoading: isLoadingListCourse,
    refetch: refetchListCourse,
  } = useCourseList();

  const {
    data: dataListQuiz,
    isLoading: isLoadingListQuiz,
    refetch: refetchListQuiz,
  } = useQuizList();

  // Display loading state
  if (isLoading && isLoadingListCourse && isLoadingListQuiz) {
    return (
      <Box className="w-full p-5 flex justify-center items-center min-h-[50vh]">
        <Typography>Đang tải dữ liệu...</Typography>
      </Box>
    );
  }

  // Display error state
  if (isError) {
    return (
      <Box className="w-full p-5 flex flex-col justify-center items-center min-h-[50vh]">
        <Typography color="error" className="mb-3">
          Có lỗi xảy ra khi tải dữ liệu
        </Typography>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {
            refetch();
            refetchListCourse();
            refetchListQuiz();
          }}
        >
          Thử lại
        </button>
      </Box>
    );
  }

  // Mock data for stats
  const stats = [
    {
      title: "Tổng bài học",
      value: dataDashBoard?.totalCourses,
      icon: <IconLesson />,
      color: "bg-[#C8E6C9]",
    },
    {
      title: "Tổng câu hỏi",
      value: dataDashBoard?.totalQuizzes,
      icon: <IconQuestion />,
      color: "bg-pink-100",
    },
    {
      title: "Tổng khách hàng",
      value: dataDashBoard?.totalUsers,
      icon: <IconUser />,
      color: "bg-purple-100",
    },
  ];

  return (
    <Box className="w-full p-5 bg-white">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="col-span-1">
            <div className={`stats-card ${stat.color}`}>
              <Box className="flex justify-between">
                <Box>
                  <Typography className="text-sm font-semibold text-gray-700 mb-1">
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" className="font-semibold">
                    {stat.value}
                  </Typography>
                </Box>
                <Box className="text-gray-700">{stat.icon}</Box>
              </Box>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Lessons Section */}
      <Card className="data-card">
        <Box className="p-5 pb-3">
          <Typography variant="h6" className="font-medium text-gray-800 mb-4">
            Bài học
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="text-xs font-medium text-gray-500 uppercase">
                    Bài học
                  </TableCell>
                  {!isMobile && (
                    <>
                      <TableCell className="text-xs font-medium text-gray-500 uppercase">
                        Ngày tạo
                      </TableCell>
                      <TableCell className="text-xs font-medium text-gray-500 uppercase">
                        Trạng thái
                      </TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataListCourse?.data
                  .slice(0, 5)
                  .map((lesson: Lesson, index: number) => (
                    <TableRow key={lesson.id} hover>
                      <TableCell>
                        <Box className="flex items-center">
                          <Typography
                            component="div"
                            className="text-sm text-gray-900"
                          >
                            <div className="font-semibold">
                              Bài {index + 1}: {lesson.title}
                              <div className="font-light text-gray-500">
                                {lesson.category.title}
                              </div>
                            </div>
                          </Typography>
                        </Box>
                      </TableCell>
                      {!isMobile && (
                        <>
                          <TableCell>
                            <Box>
                              <Typography className="text-xs text-gray-500">
                                {formatISODate(lesson.createdAt).date}
                              </Typography>
                              <Typography className="text-xs text-gray-500">
                                {formatISODate(lesson.createdAt).time}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <StatusChip status={lesson.status} />
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box className="px-5 py-3 text-right">
          <Box
            className="flex items-center justify-end text-sm font-semibold cursor-pointer"
            onClick={() => router.push(Config.PATHNAME.LESSON)}
          >
            Xem tất cả <ChevronRightIcon fontSize="small" />
          </Box>
        </Box>
      </Card>

      {/* Courses Section */}
      <Card className="data-card">
        <Box className="p-5 pb-3">
          <Typography variant="h6" className="font-medium text-gray-800 mb-4">
            Thực hành
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className=" font-medium text-gray-500">
                    Tên
                  </TableCell>
                  {!isMobile && (
                    <>
                      <TableCell className=" font-medium text-gray-500">
                        Cấp độ
                      </TableCell>
                      <TableCell className=" font-medium text-gray-500">
                        Ngày tạo
                      </TableCell>
                      <TableCell className=" font-medium text-gray-500">
                        Số câu hỏi
                      </TableCell>
                      <TableCell className=" font-medium text-gray-500">
                        Trạng thái
                      </TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataListQuiz?.data.slice(0, 5).map((course: QuizItem) => (
                  <TableRow key={course.id} hover>
                    <TableCell className="text-sm font-medium text-gray-900">
                      {course.title}
                    </TableCell>
                    {!isMobile && (
                      <>
                        <TableCell>{renderLevelName(course.level)}</TableCell>
                        <TableCell>
                          <Box>
                            <Typography className="text-xs text-gray-500">
                              {formatISODate(course.createdAt).date}
                            </Typography>
                            <Typography className="text-xs text-gray-500">
                              {formatISODate(course.createdAt).time}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{course.totalQuestions}</TableCell>
                        <TableCell>
                          <StatusChip status={course.status} />
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box className="px-5 py-3 text-right">
          <Box
            className="flex items-center justify-end text-sm font-semibold cursor-pointer"
            onClick={() => router.push(Config.PATHNAME.QUIZ)}
          >
            Xem tất cả <ChevronRightIcon fontSize="small" />
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
