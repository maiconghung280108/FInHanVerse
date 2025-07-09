import ApiUser from "@api/ApiUser";
import {lessonBanner} from "@app/config/images";
import {Lesson} from "@app/types";
import Tag, {formatISODate} from "@app/utils";
import IconSearch from "@components/Icon/IconSearch";
import TagFilter from "@components/TagFilter";
import {useCourseList} from "@module/home/useDashboardQueries";
import {useCategory} from "@module/study/useStudyQueries";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import {
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
import Image from "next/image";
import React, {useEffect, useMemo, useState} from "react";
import {useMutation, useQueryClient} from "react-query";

export interface IListStudyProps {
  changeTab: (tab: string) => void;
  setCourseId?: (id: string) => void;
}

const STATUS_OPTIONS = [
  {label: "Đã xuất bản", value: "published"},
  {label: "Bản nháp", value: "draft"},
];

const getAvatarUrl = (avatar?: string | null): string => {
  if (!avatar) {
    return lessonBanner as unknown as string;
  }

  // If it's a base64 data URL or blob URL (from file upload), use as is
  if (avatar.startsWith("data:") || avatar.startsWith("blob:")) {
    return avatar;
  }

  // If avatar is already a full URL, use as is
  if (avatar.startsWith("http")) {
    return avatar;
  }

  // If it's already a Cloudinary URL, avoid duplication
  if (avatar.includes("res.cloudinary.com")) {
    return avatar;
  }

  // If it looks like a Cloudinary path (starts with version number)
  if (avatar.match(/^v\d+\//)) {
    // This is a Cloudinary path, construct full URL
    return `${process.env.NEXT_PUBLIC_CLOUNDINARY_UPLOAD}/${avatar}`;
  }

  // If it's a relative path, construct it for local storage
  return avatar.startsWith("/") ? avatar : `/${avatar}`;
};

export default function ListLesson({changeTab, setCourseId}: IListStudyProps) {
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Lesson | null>(null);
  const [orderBy, setOrderBy] = useState<"title" | "createdAt" | "status">(
    "title",
  );
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const queryClient = useQueryClient();

  const deleteCourseMutation = useMutation(ApiUser.deleteCourse, {
    onSuccess: () => {
      queryClient.invalidateQueries("dataListCourse");
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting course:", error);
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
  const apiParams = useMemo(
    () => ({
      keyword: debouncedSearch || undefined,
      page: page + 1, // API uses 1-based pagination
      perPage: rowsPerPage,
      status: status || undefined,
      categoryId: category ? Number(category) : undefined,
    }),
    [debouncedSearch, page, rowsPerPage, status, category],
  );

  const {
    data: dataCategory,
    isLoading: loadingCategory,
    isError: isErrorCategory,
  } = useCategory(undefined);

  const {data: dataListCourse, isLoading: isLoadingListCourse} =
    useCourseList(apiParams);

  const categoryOptions =
    dataCategory?.data?.map((cat) => ({
      label: cat.title,
      value: cat.id.toString(),
    })) || [];

  // Remove client-side filtering since it's now handled by the API
  const displayedLessons = dataListCourse?.data || [];

  const sortedLessons = useMemo(() => {
    const sorted = [...displayedLessons];
    sorted.sort((a, b) => {
      if (orderBy === "title") {
        return order === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      if (orderBy === "createdAt") {
        return order === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (orderBy === "status") {
        return order === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });
    return sorted;
  }, [displayedLessons, order, orderBy]);

  const finalDisplayedLessons = sortedLessons;

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, status, category]);

  const handleChangePage = (_: any, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (course: Lesson) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (courseToDelete) {
      deleteCourseMutation.mutate(courseToDelete.id);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCourseToDelete(null);
  };

  // Calculate totals for pagination
  const totalItems = dataListCourse?.total || 0;

  const handleSort = (property: "title" | "createdAt" | "status") => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <div>
      <Box className="w-full h-max bg-white p-4 md:p-8 rounded-xl shadow-md">
        <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <Box>
            <h4 className="font-bold mb-1 text-2xl">Danh sách bài học</h4>
            <div className="text-gray-400 text-sm flex mt-2">
              <span className="text-[#212B36]">Bảng điều khiển</span> <Tag />{" "}
              <span className="text-[#212B36]">Bài học</span> <Tag /> Danh sách
              bài học
            </div>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className="!bg-black !rounded-xl !py-2 !font-semibold !px-6"
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
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Danh mục"
              size="medium"
              disabled={loadingCategory}
              className="capitalize"
            >
              <MenuItem value="">Tất cả</MenuItem>
              {loadingCategory ? (
                <MenuItem disabled>Đang tải...</MenuItem>
              ) : isErrorCategory ? (
                <MenuItem disabled>Lỗi tải dữ liệu</MenuItem>
              ) : (
                categoryOptions.map((cat) => (
                  <MenuItem
                    key={cat.value}
                    value={cat.value}
                    className="capitalize"
                  >
                    {cat.label}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          <FormControl className="w-full md:w-48">
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Trạng thái"
              size="medium"
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
            size="medium"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <IconSearch />
              </InputAdornment>
            }
          />
        </Paper>

        {/* Filter tags (nếu có) */}
        {(category || status) && (
          <div className="flex flex-col gap-2 mb-3">
            <Typography className="text-sm mr-2" component="div">
              {finalDisplayedLessons?.length || 0}{" "}
              <span className="text-[#637381]"> kết quả được tìm thấy</span>
            </Typography>
            <Box className="flex flex-wrap gap-2 mb-2 items-center">
              {category && (
                <TagFilter
                  onClick={() => setCategory("")}
                  label="Danh mục"
                  value={
                    categoryOptions.find((cat) => cat.value === category)
                      ?.label || category
                  }
                />
              )}
              {status && (
                <TagFilter
                  label="Trạng thái"
                  value={STATUS_OPTIONS.find((s) => s.value === status)?.label}
                  onClick={() => setStatus("")}
                />
              )}
            </Box>
          </div>
        )}

        {/* Loading state */}
        {isLoadingListCourse && (
          <Box className="flex justify-center items-center py-8">
            <Typography>Đang tải dữ liệu...</Typography>
          </Box>
        )}

        {/* Table */}
        {!isLoadingListCourse && (
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
                      Bài học
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
                {finalDisplayedLessons.map((lesson) => (
                  <TableRow key={lesson.id} hover>
                    <TableCell>
                      <Box className="flex items-center gap-3">
                        <Image
                          src={getAvatarUrl(lesson.image)}
                          alt={lesson.title}
                          className="!h-10 !w-10 rounded-xl flex-shrink-0"
                          width={40}
                          height={40}
                        />
                        <Box>
                          <Typography className="font-semibold text-sm md:text-base">
                            {lesson.title}
                          </Typography>
                          <Typography
                            className="text-xs text-gray-500 capitalize"
                            component="div"
                          >
                            <div className="text-sm font-light">
                              {lesson.category.title}
                            </div>
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography className="text-xs md:text-sm">
                        {formatISODate(lesson.createdAt).date}
                      </Typography>
                      <Typography className="text-xs text-gray-400">
                        {formatISODate(lesson.createdAt).time}
                      </Typography>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {lesson.status === "published" ? (
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
                          if (setCourseId) {
                            setCourseId(lesson.id.toString());
                          }
                        }}
                        size="small"
                        color="primary"
                      >
                        <DriveFileRenameOutlineIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(lesson)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {finalDisplayedLessons.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
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
        {!isLoadingListCourse && (
          <Box className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 gap-2">
            <Typography className="text-sm text-gray-500" component="div">
              Hàng mỗi trang:
              <Select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(0);
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
                {Math.min((page + 1) * rowsPerPage, totalItems)} của{" "}
                {totalItems}
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
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Xác nhận xóa bài học</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bạn có chắc chắn muốn xóa bài học &#34;{courseToDelete?.title}
            &#34;? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteCancel}
            color="primary"
            disabled={deleteCourseMutation.isLoading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteCourseMutation.isLoading}
          >
            {deleteCourseMutation.isLoading ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
