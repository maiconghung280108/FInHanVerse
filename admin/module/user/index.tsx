import {useListUserData} from "@module/user/useUserQueries";
import {Add as AddIcon, Search as SearchIcon} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
} from "@mui/material";
import React from "react";

// Default placeholder avatar (a simple gray circle SVG data URL)
const DEFAULT_AVATAR =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMiIgeT0iOCI+CjxwYXRoIGQ9Ik04IDBDNS43OTA4NiAwIDQgMS43OTA4NiA0IDRDNCA2LjIwOTE0IDUuNzkwODYgOCA4IDhDMTAuMjA5MSA4IDEyIDYuMjA5MTQgMTIgNEMxMiAxLjc5MDg2IDEwLjIwOTEgMCA4IDBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yIDE0QzIgMTEuNzkwOSA0LjQ2ODYyIDEwIDcuNSAxMEg4LjVDMTEuNTMxNCAxMCAxNCAxMS43OTA5IDE0IDE0VjE2SDJWMTRaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo8L3N2Zz4K";

// Helper function to get avatar URL
const getAvatarUrl = (avatar?: string | null): string => {
  if (!avatar) {
    return DEFAULT_AVATAR;
  }

  // If avatar is already a full URL, extract the path and use proxy
  if (avatar.startsWith("http")) {
    try {
      const url = new URL(avatar);
      return url.pathname; // This will go through Next.js proxy
    } catch (error) {
      console.warn("Invalid avatar URL:", avatar);
      return DEFAULT_AVATAR;
    }
  }

  // If it's a relative path, construct it
  return avatar.startsWith("/") ? avatar : `/${avatar}`;
};

export function User() {
  const [search, setSearch] = React.useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = React.useState<string>("");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [orderBy, setOrderBy] = React.useState<"fullName" | "email" | "role">(
    "fullName",
  );
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Prepare API parameters
  const apiParams = React.useMemo(() => {
    const params: any = {
      page: page,
      perPage: rowsPerPage,
    };

    // Only add keyword if search has value
    if (debouncedSearch && debouncedSearch.trim()) {
      params.keyword = debouncedSearch.trim();
    }

    return params;
  }, [debouncedSearch, page, rowsPerPage]);

  const {data: dataListUser, isLoading, isError} = useListUserData(apiParams);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const sortedUsers = React.useMemo(() => {
    if (!dataListUser?.data) return [];

    const sorted = [...dataListUser.data];
    sorted.sort((a, b) => {
      if (orderBy === "fullName") {
        const nameA = a.fullName || "";
        const nameB = b.fullName || "";
        return order === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      if (orderBy === "email") {
        const emailA = a.email || "";
        const emailB = b.email || "";
        return order === "asc"
          ? emailA.localeCompare(emailB)
          : emailB.localeCompare(emailA);
      }
      if (orderBy === "role") {
        const roleA = a.role || "";
        const roleB = b.role || "";
        return order === "asc"
          ? roleA.localeCompare(roleB)
          : roleB.localeCompare(roleA);
      }
      return 0;
    });
    return sorted;
  }, [dataListUser?.data, order, orderBy]);

  const handleSort = (property: "fullName" | "email" | "role") => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Xử lý tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e?.target?.value);
  };

  // Xử lý đổi số hàng/trang
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  // Xử lý đổi trang
  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  return (
    <Box className="p-6 bg-white rounded-xl shadow-md">
      {/* Header */}
      <Box className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Người Dùng</h1>
        </div>
        <Button
          disabled
          variant="contained"
          startIcon={<AddIcon />}
          className="!bg-black !text-white"
        >
          Thêm mới
        </Button>
      </Box>

      {/* Tabs & Filters */}
      <Box className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
        <TextField
          placeholder="Tìm kiếm..."
          variant="outlined"
          className="min-w-[250px]"
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Table */}
      <TableContainer className="rounded-lg border">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "fullName"}
                  direction={orderBy === "fullName" ? order : "asc"}
                  onClick={() => handleSort("fullName")}
                  hideSortIcon={false}
                >
                  Tên
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "role"}
                  direction={orderBy === "role" ? order : "asc"}
                  onClick={() => handleSort("role")}
                  hideSortIcon={false}
                >
                  Vai trò
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Đã xảy ra lỗi khi tải dữ liệu
                </TableCell>
              </TableRow>
            ) : sortedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              sortedUsers.map((u, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Box className="flex items-center gap-2">
                      <Avatar
                        src={getAvatarUrl(u?.avatar)}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = DEFAULT_AVATAR;
                        }}
                      />
                      <div>
                        <div className="font-semibold">{u.fullName}</div>
                        <div className="text-xs text-gray-400">{u.email}</div>
                      </div>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {u.role === "admin" ? "Admin" : "Khách hàng"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          Số hàng mỗi trang
          <TextField
            select
            size="small"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="w-16 mx-2"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </TextField>
          {dataListUser?.total && dataListUser.total > 0 && (
            <span>
              {(page - 1) * rowsPerPage + 1}-
              {Math.min(page * rowsPerPage, dataListUser.total)} của{" "}
              {dataListUser.total}
            </span>
          )}
        </div>
        <Pagination
          count={dataListUser?.totalPages || 1}
          page={page}
          onChange={handlePageChange}
        />
      </Box>
    </Box>
  );
}
