import ApiUser from "../../../../api/ApiUser";
import {QuizItem} from "../../../../types";
import Tag, {formatISODate, renderLevelName} from "@app/utils";
import TagFilter from "@components/TagFilter";
import {useQuizList} from "@module/home/useDashboardQueries";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import clsx from "clsx";
import React, {useEffect, useMemo, useState} from "react";
import {useMutation, useQueryClient} from "react-query";

export interface IListStudyProps {
  changeTab: (tab: string) => void;
  setQuizId: (quizId: string) => void;
}

const LEVELS = [
  {label: "Cơ bản", value: "BEGINNER"},
  {label: "Trung cấp", value: "INTERMEDIATE"},
  {label: "Nâng cao", value: "ADVANCED"},
];

const STATUS_OPTIONS = [
  {label: "Đã xuất bản", value: "published"},
  {label: "Bản nháp", value: "draft"},
];

export default function ListQuestion({changeTab, setQuizId}: IListStudyProps) {
  // State
  const [level, setLevel] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<QuizItem | null>(null);
  const [orderBy, setOrderBy] = useState<
    "title" | "createdAt" | "level" | "status"
  >("title");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const queryClient = useQueryClient();

  const deleteQuizMutation = useMutation(ApiUser.deleteQuiz, {
    onSuccess: () => {
      queryClient.invalidateQueries("dataListQuiz");
      setDeleteDialogOpen(false);
      setQuizToDelete(null);
      // Nếu quiz đang được xóa nằm trong danh sách selected, remove nó
      if (quizToDelete) {
        setSelected((prev) => prev.filter((id) => id !== quizToDelete.id));
      }
    },
    onError: (error) => {
      console.error("Error deleting quiz:", error);
    },
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Prepare API parameters
  const apiParams = useMemo(() => {
    const params: any = {
      page: page + 1, // API uses 1-based pagination
      perPage: rowsPerPage,
    };

    // Only add parameters if they have values
    if (debouncedSearch && debouncedSearch.trim()) {
      params.keyword = debouncedSearch.trim();
    }

    if (status) {
      params.status = status;
    }

    if (level) {
      params.level = level;
    }

    return params;
  }, [debouncedSearch, page, rowsPerPage, status, level]);

  const {data: dataListQuiz, isLoading: isLoadingListQuiz} =
    useQuizList(apiParams);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, status, level]);

  const quizList = dataListQuiz?.data || [];
  const totalItems = dataListQuiz?.total || 0;

  const sortedQuizList = useMemo(() => {
    const sorted = [...quizList];
    sorted.sort((a, b) => {
      if (orderBy === "title") {
        const titleA = a.title || "";
        const titleB = b.title || "";
        return order === "asc"
          ? titleA.localeCompare(titleB)
          : titleB.localeCompare(titleA);
      }
      if (orderBy === "createdAt") {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return order === "asc" ? dateA - dateB : dateB - dateA;
      }
      if (orderBy === "level") {
        const levelA = a.level || "";
        const levelB = b.level || "";
        return order === "asc"
          ? levelA.localeCompare(levelB)
          : levelB.localeCompare(levelA);
      }
      if (orderBy === "status") {
        const statusA = a.status || "";
        const statusB = b.status || "";
        return order === "asc"
          ? statusA.localeCompare(statusB)
          : statusB.localeCompare(statusA);
      }
      return 0;
    });
    return sorted;
  }, [quizList, order, orderBy]);

  const handleSort = (property: "title" | "createdAt" | "level" | "status") => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleDelete = () => {
    if (selected.length === 0) return;

    const selectedQuizzes = quizList.filter((quiz) =>
      selected.includes(quiz.id),
    );
    if (selectedQuizzes.length === 1) {
      // Nếu chỉ có 1 quiz được chọn, hiển thị dialog xác nhận
      handleDeleteClick(selectedQuizzes[0]);
    } else {
      // Nếu có nhiều quiz, có thể tạo dialog riêng hoặc xóa trực tiếp
      const confirmDelete = window.confirm(
        `Bạn có chắc chắn muốn xóa ${selected.length} bài kiểm tra đã chọn?`,
      );
      if (confirmDelete) {
        // Xóa từng quiz một cách tuần tự
        selected.forEach((quizId) => {
          deleteQuizMutation.mutate(quizId);
        });
        setSelected([]);
      }
    }
  };

  const handleDeleteClick = (quiz: QuizItem) => {
    setQuizToDelete(quiz);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (quizToDelete) {
      deleteQuizMutation.mutate(quizToDelete.id);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setQuizToDelete(null);
  };

  const handleChangePage = (_: any, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box className="w-full min-h-screen bg-white p-4 md:p-8 rounded-xl shadow-md">
      {/* Header + Add button */}
      <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <Box>
          <h4 className="font-bold mb-1 text-2xl">Danh sách câu hỏi</h4>
          <div className="text-gray-400 text-sm flex mt-2">
            <span className="text-[#212B36]">Bảng điều khiển</span> <Tag />{" "}
            <span className="text-[#212B36]">Bài học</span> <Tag /> Danh sách
            câu hỏi
          </div>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className="!bg-black !rounded-lg !py-2 !px-6"
          onClick={() => changeTab("createUpdateLesson")}
        >
          Thêm mới
        </Button>
      </Box>

      {/* Filter bar */}
      <Paper
        className="flex flex-col md:flex-row md:items-center gap-2 py-3 mb-4 bg-gray-50"
        elevation={0}
      >
        <FormControl className="w-full md:w-48">
          <InputLabel>Cấp độ</InputLabel>
          <Select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            label="Cấp độ"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {LEVELS.map((lvl) => (
              <MenuItem key={lvl.value} value={lvl.value}>
                {lvl.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className="w-full md:w-48">
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="Trạng thái"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {STATUS_OPTIONS.map((st) => (
              <MenuItem key={st.value} value={st.value}>
                {st.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <OutlinedInput
          className="w-full md:w-72"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
        {selected.length > 0 && (
          <Button
            variant="text"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            className="!ml-0 md:!ml-2"
          >
            Xóa
          </Button>
        )}
      </Paper>

      {/* Filter tags (nếu có) */}
      {(level || status || debouncedSearch) && (
        <div className="flex flex-col gap-2 mb-3">
          <Typography className="text-sm mr-2" component="div">
            {quizList?.length || 0}{" "}
            <span className="text-[#637381]"> kết quả được tìm thấy</span>
          </Typography>
          <Box className="flex flex-wrap gap-2 mb-2 items-center">
            {level && (
              <TagFilter
                onClick={() => setLevel("")}
                label="Cấp độ"
                value={LEVELS.find((l) => l.value === level)?.label}
              />
            )}
            {status && (
              <TagFilter
                onClick={() => setStatus("")}
                label="Trạng thái"
                value={STATUS_OPTIONS.find((s) => s.value === status)?.label}
              />
            )}
            {debouncedSearch && (
              <TagFilter
                onClick={() => setSearch("")}
                label="Tìm kiếm"
                value={debouncedSearch}
              />
            )}
          </Box>
        </div>
      )}

      {/* Loading state */}
      {isLoadingListQuiz && (
        <Box className="flex justify-center items-center py-8">
          <Typography>
            {search !== debouncedSearch
              ? "Đang tìm kiếm..."
              : "Đang tải dữ liệu..."}
          </Typography>
        </Box>
      )}

      {/* Table */}
      {!isLoadingListQuiz && (
        <TableContainer component={Paper} className="rounded-xl shadow-sm">
          <Table size="small">
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "title"}
                    direction={orderBy === "title" ? order : "asc"}
                    onClick={() => handleSort("title")}
                    hideSortIcon={false}
                  >
                    Câu hỏi
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "level"}
                    direction={orderBy === "level" ? order : "asc"}
                    onClick={() => handleSort("level")}
                    hideSortIcon={false}
                  >
                    Cấp độ
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "createdAt"}
                    direction={orderBy === "createdAt" ? order : "asc"}
                    onClick={() => handleSort("createdAt")}
                    hideSortIcon={false}
                  >
                    Ngày tạo
                  </TableSortLabel>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <TableSortLabel
                    active={orderBy === "status"}
                    direction={orderBy === "status" ? order : "asc"}
                    onClick={() => handleSort("status")}
                    hideSortIcon={false}
                  >
                    Trạng thái
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedQuizList.map((quiz) => (
                <TableRow
                  key={quiz.id}
                  hover
                  selected={selected.includes(quiz.id)}
                  className={clsx(selected.includes(quiz.id) && "bg-gray-50")}
                >
                  <TableCell>
                    <Box className="flex items-center gap-3">
                      <Avatar>{quiz.title.charAt(0)}</Avatar>
                      <Box>
                        <Typography className="font-medium text-sm md:text-base">
                          {quiz.title}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography className="text-xs md:text-sm" component="div">
                      {renderLevelName(quiz.level)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography className="text-xs md:text-sm">
                      {formatISODate(quiz.createdAt).date}
                    </Typography>
                    <Typography className="text-xs text-gray-400">
                      {formatISODate(quiz.createdAt).time}
                    </Typography>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {quiz.status === "published" ? (
                      <Chip
                        label="Đã xuất bản"
                        color="success"
                        size="small"
                        className="!bg-green-50 !text-green-700"
                      />
                    ) : (
                      <Chip
                        label="Bản nháp"
                        color="default"
                        size="small"
                        className="!bg-gray-100 !text-gray-500"
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => {
                        setQuizId(quiz.id.toString());
                      }}
                      size="small"
                      color="primary"
                    >
                      <DriveFileRenameOutlineIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(quiz)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {quizList.length === 0 && !isLoadingListQuiz && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography className="text-gray-400 py-8">
                      Không có dữ liệu
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      {!isLoadingListQuiz && totalItems > 0 && (
        <Box className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 gap-2">
          <Typography className="text-sm text-gray-500" component="div">
            Hàng mỗi trang:
            <Select
              value={rowsPerPage}
              onChange={(e) => {
                const value =
                  typeof e.target.value === "string"
                    ? parseInt(e.target.value, 10)
                    : e.target.value;
                handleChangeRowsPerPage({
                  target: {value: value.toString()},
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              size="small"
              className="!ml-2 !w-16"
            >
              {[5, 10, 20].map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </Select>
            <span className="ml-2">
              {page * rowsPerPage + 1} -
              {Math.min((page + 1) * rowsPerPage, totalItems)} của {totalItems}
            </span>
          </Typography>
          <TablePagination
            component="div"
            count={totalItems}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20]}
            labelRowsPerPage=""
            className="!p-0"
          />
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Xác nhận xóa bài kiểm tra
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bạn có chắc chắn muốn xóa bài kiểm tra &#34;{quizToDelete?.title}
            &#34;? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteCancel}
            color="primary"
            disabled={deleteQuizMutation.isLoading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteQuizMutation.isLoading}
          >
            {deleteQuizMutation.isLoading ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
