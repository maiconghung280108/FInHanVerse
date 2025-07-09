"use client";

import ApiUser, {IQuizDetailResponse} from "../../../../api/ApiUser";
import Tag from "@app/utils";
import {yupResolver} from "@hookform/resolvers/yup";
import {useQuizDetail} from "@module/home/useDashboardQueries";
import ModalAddQuestionCourse, {
  IFormInputs,
} from "@module/study/list/ModalAddQuestionCourse";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "react-query";
import * as yup from "yup";

interface Question {
  id?: number;
  nameQuestion: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: string;
  explanation?: string;
  image?: string | null;
}

interface QuizFormData {
  title: string;
  level: string;
  isActive: boolean;
  questions: Question[];
}

// Helper function để transform data từ API về form format
const transformApiDataToForm = (apiData: IQuizDetailResponse): QuizFormData => {
  return {
    title: apiData.title,
    level: apiData.level,
    isActive: apiData.status === "published",
    questions: apiData.questions.map((question) => {
      const {answers} = question;
      const correctAnswer = answers.find((answer) => answer.isCorrect);
      const correctIndex = answers.indexOf(correctAnswer!);
      const correctLetter = ["A", "B", "C", "D"][correctIndex];

      return {
        id: question.id,
        nameQuestion: question.text,
        answerA: answers[0]?.text || "",
        answerB: answers[1]?.text || "",
        answerC: answers[2]?.text || "",
        answerD: answers[3]?.text || "",
        correctAnswer: correctLetter,
        explanation: question.explanation || "",
        image: question.image || null,
      };
    }),
  };
};

const questionSchema = yup.object({
  nameQuestion: yup.string().required("Câu hỏi không được bỏ trống"),
  answerA: yup.string().required("Đáp án A không được bỏ trống"),
  answerB: yup.string().required("Đáp án B không được bỏ trống"),
  answerC: yup.string().required("Đáp án C không được bỏ trống"),
  answerD: yup.string().required("Đáp án D không được bỏ trống"),
  correctAnswer: yup
    .string()
    .required("Đáp án đúng không được bỏ trống")
    .oneOf(["A", "B", "C", "D"], "Đáp án không hợp lệ"),
  explanation: yup.string().optional(),
  image: yup.string().nullable().optional(),
});

const schema = yup.object({
  title: yup
    .string()
    .required("Tiêu đề không được bỏ trống")
    .max(200, "Tiêu đề không được vượt quá 200 ký tự"),
  level: yup
    .string()
    .required("Cấp độ không được bỏ trống")
    .oneOf(["BEGINNER", "INTERMEDIATE", "ADVANCED"], "Cấp độ không hợp lệ"),
  isActive: yup.boolean().default(false),
  questions: yup
    .array()
    .of(questionSchema)
    .min(1, "Cần ít nhất một câu hỏi")
    .required("Cần ít nhất một câu hỏi"),
});

interface CreateUpdateQuestionProps {
  changeTab?: (tab: string) => void;
  initialData?: QuizFormData;
  quizId?: string;
}

export default function CreateUpdateQuestion({
  changeTab,
  initialData,
  quizId,
}: CreateUpdateQuestionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<{
    data: Question;
    index: number;
  } | null>(null);
  const queryClient = useQueryClient();

  // Fetch quiz detail nếu có quizId
  const {data: quizDetailData, isLoading: isLoadingQuizDetail} =
    useQuizDetail(quizId);

  const createQuizMutation = useMutation(
    (data: QuizFormData) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("level", data.level);
      formData.append("status", data.isActive ? "published" : "draft");

      // Convert questions to JSON string and append
      const questionsData = data.questions.map((question) => ({
        text: question.nameQuestion,
        isMultiple: false,
        explanation: question.explanation || "",
        image: question.image || null,
        answers: [
          {text: question.answerA, isCorrect: question.correctAnswer === "A"},
          {text: question.answerB, isCorrect: question.correctAnswer === "B"},
          {text: question.answerC, isCorrect: question.correctAnswer === "C"},
          {text: question.answerD, isCorrect: question.correctAnswer === "D"},
        ],
      }));
      formData.append("questions", JSON.stringify(questionsData));

      return ApiUser.createQuizWithQuestions(formData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("quizzes");
        queryClient.invalidateQueries("dataListQuiz");
        if (changeTab) {
          changeTab("listQuestion");
        }
      },
      onError: (error) => {
        console.error("Error creating quiz:", error);
      },
    },
  );

  const updateQuizMutation = useMutation(
    (data: QuizFormData) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("level", data.level);
      formData.append("status", data.isActive ? "published" : "draft");

      // Convert questions to JSON string and append, including IDs for existing questions
      const questionsData = data.questions.map((question, index) => {
        // Find the original question from quizDetailData to get its ID
        const originalQuestion = quizDetailData?.questions[index];
        return {
          id: originalQuestion?.id, // Include the original question ID if it exists
          text: question.nameQuestion,
          isMultiple: false,
          explanation: question.explanation || "",
          image: question.image || null,
          answers: [
            {text: question.answerA, isCorrect: question.correctAnswer === "A"},
            {text: question.answerB, isCorrect: question.correctAnswer === "B"},
            {text: question.answerC, isCorrect: question.correctAnswer === "C"},
            {text: question.answerD, isCorrect: question.correctAnswer === "D"},
          ],
        };
      });
      formData.append("questions", JSON.stringify(questionsData));

      return ApiUser.updateQuizWithQuestions(quizId!, formData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("quizzes");
        queryClient.invalidateQueries("dataListQuiz");
        queryClient.invalidateQueries(["quizDetail", quizId]);
        if (changeTab) {
          changeTab("listQuestion");
        }
      },
      onError: (error) => {
        console.error("Error updating quiz:", error);
      },
    },
  );

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    watch,
    reset,
  } = useForm<QuizFormData>({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      title: "",
      level: "",
      isActive: false,
      questions: [],
    },
  });

  // Reset form khi có data từ API
  useEffect(() => {
    if (quizDetailData) {
      const formData = transformApiDataToForm(quizDetailData);
      reset(formData);
    }
  }, [quizDetailData, reset]);

  const onSubmit: SubmitHandler<QuizFormData> = (data) => {
    if (quizId) {
      updateQuizMutation.mutate(data);
    } else {
      createQuizMutation.mutate(data);
    }
  };

  const questions = watch("questions") || [];

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setValue("questions", newQuestions);
  };

  const handleAddQuestion = (questionData: IFormInputs) => {
    setIsModalOpen(false);
    if (editingQuestion !== null) {
      const newQuestions = [...questions];
      newQuestions[editingQuestion.index] = {
        id: questions[editingQuestion.index].id,
        nameQuestion: questionData.nameQuestion,
        answerA: questionData.answerA,
        answerB: questionData.answerB,
        answerC: questionData.answerC,
        answerD: questionData.answerD,
        correctAnswer: questionData.correctAnswer,
        explanation: questionData.explanation,
        image: questionData.image || null,
      };
      setValue("questions", newQuestions);
      setEditingQuestion(null);
    } else {
      setValue("questions", [
        ...questions,
        {
          nameQuestion: questionData.nameQuestion,
          answerA: questionData.answerA,
          answerB: questionData.answerB,
          answerC: questionData.answerC,
          answerD: questionData.answerD,
          correctAnswer: questionData.correctAnswer,
          explanation: questionData.explanation,
          image: questionData.image || null,
        },
      ]);
    }
  };

  const handleEditQuestion = (index: number) => {
    setEditingQuestion({
      data: questions[index],
      index,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const isLoading =
    createQuizMutation.isLoading || updateQuizMutation.isLoading;
  const isEdit = !!quizId;

  if (isLoadingQuizDetail) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <>
      <div className="p-4">
        <Box>
          <h4 className="font-bold mb-1 text-2xl">
            {isEdit ? "Chỉnh sửa bài kiểm tra" : "Tạo bài kiểm tra"}
          </h4>
          <div className="text-gray-400 text-sm flex mt-2">
            <span className="text-[#212B36]">Bảng điều khiển</span> <Tag />{" "}
            <span className="text-[#212B36]">Bài học</span> <Tag />{" "}
            {isEdit ? "Chỉnh sửa bài kiểm tra" : "Tạo bài kiểm tra"}
          </div>
        </Box>
      </div>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto p-4"
      >
        <Accordion defaultExpanded className="mb-4 shadow-sm border">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="div">
              <div className="font-semibold text-lg">Chi tiết</div>
              <div className="text-[#637381] font-light">
                Tiêu đề, cấp độ...
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Controller
              name="title"
              control={control}
              render={({field}) => (
                <TextField
                  {...field}
                  label="Tiêu đề"
                  fullWidth
                  margin="normal"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  placeholder="Vd: Bài kiểm tra 1"
                  className="border border-[#919EAB52]"
                />
              )}
            />

            <Controller
              name="level"
              control={control}
              render={({field}) => (
                <FormControl
                  fullWidth
                  margin="normal"
                  className="border border-[#919EAB52]"
                >
                  <InputLabel>Cấp độ</InputLabel>
                  <Select label="Cấp độ" {...field} error={!!errors.level}>
                    <MenuItem value="BEGINNER">Cơ bản</MenuItem>
                    <MenuItem value="INTERMEDIATE">Trung cấp</MenuItem>
                    <MenuItem value="ADVANCED">Nâng cao</MenuItem>
                  </Select>
                  {errors.level && (
                    <Typography color="error" variant="caption" sx={{mt: 1}}>
                      {errors.level.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion className="mb-4 shadow-sm border">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="div">
              <div className="font-semibold text-lg">Câu hỏi</div>
              <div className="text-[#637381] font-light">
                Các câu hỏi trong bộ câu hỏi...
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box className="mb-4">
              {questions.map((question, index) => (
                <Box
                  key={index}
                  className="mb-4 border rounded-md p-3 relative flex justify-between"
                >
                  <div className="flex items-center gap-2">
                    <IconButton size="small" style={{cursor: "grab"}}>
                      <MenuIcon fontSize="small" />
                    </IconButton>
                    <div className="flex flex-col">
                      <div className="font-semibold text-lg">
                        {question?.nameQuestion}
                      </div>
                    </div>
                  </div>
                  <div>
                    {!quizId && (
                      <IconButton
                        size="small"
                        onClick={() => removeQuestion(index)}
                        color="error"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    )}

                    <IconButton
                      size="small"
                      onClick={() => handleEditQuestion(index)}
                      color="primary"
                    >
                      <DriveFileRenameOutlineIcon fontSize="small" />
                    </IconButton>
                  </div>
                </Box>
              ))}

              {!quizId && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2 bg-[#919EAB14] flex gap-2 w-full items-center justify-center py-2 rounded-lg"
                  type="button"
                >
                  <AddIcon className="text-[#212B36]" />
                  <div className="text-[#212B36] font-semibold">Câu hỏi</div>
                </button>
              )}
            </Box>
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
                if (changeTab) {
                  changeTab("listQuestion");
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
                ? isEdit
                  ? "Đang cập nhật..."
                  : "Đang tạo..."
                : isEdit
                ? "Cập nhật bài kiểm tra"
                : "Tạo bài kiểm tra"}
            </button>
          </div>
        </Box>
      </Box>
      <ModalAddQuestionCourse
        isModalOpen={isModalOpen}
        handleOk={handleAddQuestion}
        handleCancel={handleCloseModal}
        initialData={editingQuestion?.data as any}
      />
    </>
  );
}
