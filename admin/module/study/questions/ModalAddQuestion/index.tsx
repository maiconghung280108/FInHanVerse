import {FormControlLabel, Radio, RadioGroup, TextField} from "@mui/material";
import {Modal} from "antd";
import React, {useEffect} from "react";
import {Controller, SubmitHandler, useForm} from "react-hook-form";

interface IFormInputs {
  nameQuestion: string;
  category: string;
  points: number;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: string;
  explanation?: string;
}

interface IModalAddQuestionProps {
  isModalOpen: boolean;
  handleOk: (data: IFormInputs) => void;
  handleCancel: () => void;
  initialData?: IFormInputs;
}

export default function ModalAddQuestion({
  isModalOpen,
  handleOk,
  handleCancel,
  initialData,
}: IModalAddQuestionProps) {
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<IFormInputs>({
    defaultValues: {
      nameQuestion: "",
      category: "",
      points: 0,
      answerA: "",
      answerB: "",
      answerC: "",
      answerD: "",
      correctAnswer: "A",
      explanation: "",
    },
  });

  useEffect(() => {
    if (isModalOpen) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({
          nameQuestion: "",
          category: "",
          points: 0,
          answerA: "",
          answerB: "",
          answerC: "",
          answerD: "",
          correctAnswer: "A",
          explanation: "",
        });
      }
    }
  }, [isModalOpen, initialData, reset]);

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    handleOk(data);
  };

  const handleModalCancel = () => {
    handleCancel();
    reset({
      nameQuestion: "",
      category: "",
      points: 0,
      answerA: "",
      answerB: "",
      answerC: "",
      answerD: "",
      correctAnswer: "A",
      explanation: "",
    });
  };

  return (
    <Modal
      title={initialData ? "Chỉnh sửa câu hỏi" : "Tạo câu hỏi"}
      width={700}
      closable={{"aria-label": "Custom Close Button"}}
      open={isModalOpen}
      onOk={handleSubmit(onSubmit)}
      onCancel={handleModalCancel}
      okText={initialData ? "Cập nhật" : "Tạo câu hỏi"}
      cancelText="Hủy bỏ"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="nameQuestion"
          control={control}
          rules={{required: "Câu hỏi là bắt buộc"}}
          render={({field}) => (
            <TextField
              {...field}
              label="Câu hỏi"
              multiline
              rows={4}
              fullWidth
              className="border border-[#919EAB52]"
              margin="normal"
              error={!!errors.nameQuestion}
              helperText={errors.nameQuestion?.message}
            />
          )}
        />
        <Controller
          name="answerA"
          control={control}
          rules={{required: "Đáp án A là bắt buộc"}}
          render={({field}) => (
            <TextField
              {...field}
              placeholder="Nhập đáp án"
              label="Đáp án A"
              fullWidth
              className="border border-[#919EAB52]"
              margin="normal"
              error={!!errors.answerA}
              helperText={errors.answerA?.message}
            />
          )}
        />
        <Controller
          name="answerB"
          control={control}
          rules={{required: "Đáp án B là bắt buộc"}}
          render={({field}) => (
            <TextField
              {...field}
              placeholder="Nhập đáp án"
              label="Đáp án B"
              fullWidth
              className="border border-[#919EAB52]"
              margin="normal"
              error={!!errors.answerB}
              helperText={errors.answerB?.message}
            />
          )}
        />
        <Controller
          name="answerC"
          control={control}
          rules={{required: "Đáp án C là bắt buộc"}}
          render={({field}) => (
            <TextField
              {...field}
              placeholder="Nhập đáp án"
              label="Đáp án C"
              fullWidth
              className="border border-[#919EAB52]"
              margin="normal"
              error={!!errors.answerC}
              helperText={errors.answerC?.message}
            />
          )}
        />
        <Controller
          name="answerD"
          control={control}
          rules={{required: "Đáp án D là bắt buộc"}}
          render={({field}) => (
            <TextField
              {...field}
              placeholder="Nhập đáp án"
              label="Đáp án D"
              fullWidth
              className="border border-[#919EAB52]"
              margin="normal"
              error={!!errors.answerD}
              helperText={errors.answerD?.message}
            />
          )}
        />
        <div className="font-semibold mt-2">Đáp án đúng</div>
        <Controller
          name="correctAnswer"
          control={control}
          rules={{required: "Vui lòng chọn đáp án đúng"}}
          render={({field}) => (
            <div className="flex flex-row justify-start items-center">
              <RadioGroup {...field} row>
                <FormControlLabel
                  value="A"
                  control={<Radio color="success" />}
                  label="Đáp án A"
                />
                <FormControlLabel
                  value="B"
                  control={<Radio color="success" />}
                  label="Đáp án B"
                />
                <FormControlLabel
                  value="C"
                  control={<Radio color="success" />}
                  label="Đáp án C"
                />
                <FormControlLabel
                  value="D"
                  control={<Radio color="success" />}
                  label="Đáp án D"
                />
              </RadioGroup>
            </div>
          )}
        />
        <Controller
          name="explanation"
          control={control}
          render={({field}) => (
            <TextField
              {...field}
              placeholder="Nhập giải thích (nếu có)"
              label="Giải thích"
              fullWidth
              className="border border-[#919EAB52]"
              margin="normal"
            />
          )}
        />
      </form>
    </Modal>
  );
}
