import ApiUser from "@api/ApiUser";
import {Category} from "@app/types";
import Tag from "@app/utils";
import TagFilter from "@components/TagFilter";
import {useCategory} from "@module/study/useStudyQueries";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import SearchIcon from "@mui/icons-material/Search";
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
import React, {useEffect, useMemo, useState} from "react";
import {useMutation, useQueryClient} from "react-query";

export interface IListCategoryProps {
  changeTab: (tab: string) => void;
  setDataActive: (data: Category) => void;
}

const STATUS_OPTIONS = [
  {label: "Đã xuất bản", value: "published"},
  {label: "Bản nháp", value: "draft"},
];

export default function ListCategory({
  changeTab,
  setDataActive,
}: IListCategoryProps) {
  // State
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [orderBy, setOrderBy] = useState<"title" | "createdAt" | "status">(
    "title",
  );
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const queryClient = useQueryClient();

  const deleteCategoryMutation = useMutation(ApiUser.deleteCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries("dataCategory");
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
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
    }),
    [debouncedSearch, page, rowsPerPage, status],
  );

  const {
    data: dataCategory,
    isLoading: loadingCategory,
    isError: isErrorCategory,
    refetch: refreshCategory,
  } = useCategory(apiParams);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, status]);

  const categories = dataCategory?.data || [];

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      deleteCategoryMutation.mutate(categoryToDelete.id);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const sortedCategories = useMemo(() => {
    const sorted = [...categories];
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
  }, [categories, order, orderBy]);

  const handleSort = (property: "title" | "createdAt" | "status") => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <Box className="w-full min-h-screen bg-white p-4 md:p-8 rounded-xl shadow-md">
      {/* Header + Add button */}
      <Box className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <Box>
          <h4 className="font-bold mb-1 text-2xl">Danh mục bài học</h4>
          <div className="text-gray-400 text-sm flex mt-2">
            <span className="text-[#212B36]">Bảng điều khiển</span> <Tag />{" "}
            <span className="text-[#212B36]">Bài học</span> <Tag /> Danh mục bài
            học
          </div>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className="!bg-black !rounded-lg !py-2 !px-6"
          onClick={() => changeTab && changeTab("createUpdateCategory")}
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
      </Paper>

      {/* Filter tags (nếu có) */}
      {(status || debouncedSearch) && (
        <div className="flex flex-col gap-2 mb-3">
          <Typography className="text-sm mr-2" component="div">
            {dataCategory?.total || 0}{" "}
            <span className="text-[#637381]"> kết quả được tìm thấy</span>
          </Typography>
          <Box className="flex flex-wrap gap-2 mb-2 items-center">
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
                label="Từ khóa"
                value={debouncedSearch}
              />
            )}
          </Box>
        </div>
      )}

      {/* Error state */}
      {isErrorCategory && (
        <Box className="p-4 mb-4 text-red-600 bg-red-50 rounded-lg">
          <Typography>
            Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.
          </Typography>
          <Button
            onClick={() => refreshCategory()}
            size="small"
            className="mt-2"
          >
            Thử lại
          </Button>
        </Box>
      )}

      {/* Table */}
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
                  Danh mục
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
              <TableCell>
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={() => handleSort("status")}
                  hideSortIcon={false}
                >
                  Trạng thái
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCategories.map((category: Category) => (
              <TableRow key={category.id} hover>
                <TableCell>
                  <Typography className="font-medium capitalize">
                    {category.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography className="text-xs md:text-sm">
                    {new Date(category.createdAt).toLocaleDateString("vi-VN")}
                  </Typography>
                  <Typography className="text-xs text-gray-400">
                    {new Date(category.createdAt).toLocaleTimeString("vi-VN")}
                  </Typography>
                </TableCell>
                <TableCell>
                  {category.status === "published" ? (
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
                      setDataActive(category);
                      changeTab("createUpdateCategory");
                    }}
                    size="small"
                    color="primary"
                  >
                    <DriveFileRenameOutlineIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(category)}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography className="text-gray-400 py-8">
                    {loadingCategory
                      ? "Đang tải dữ liệu..."
                      : "Không có dữ liệu"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
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
            {dataCategory?.total
              ? `${page * rowsPerPage + 1} - ${Math.min(
                  (page + 1) * rowsPerPage,
                  dataCategory.total,
                )} của ${dataCategory.total}`
              : "Không có dữ liệu"}
          </span>
        </Typography>
        <TablePagination
          component="div"
          count={dataCategory?.total || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
          labelRowsPerPage=""
          className="!p-0"
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Xác nhận xóa danh mục
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bạn có chắc chắn muốn xóa danh mục &#34;{categoryToDelete?.title}
            &#34;? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteCancel}
            color="primary"
            disabled={deleteCategoryMutation.isLoading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteCategoryMutation.isLoading}
          >
            {deleteCategoryMutation.isLoading ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
