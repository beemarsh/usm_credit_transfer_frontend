import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  MenuItem,
  Input,
  FilledInput,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormHelperText,
  FormControl,
  TextField,
  Select,
  InputBase,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Dialog,
  DialogTitle,
  Menu,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Image from "next/image";
import { AddStudentIcon } from "../../../config/icons";
import { Button } from "@mui/material";
import {
  isAgeValid,
  isLongNameValid,
  isNameValid,
  isSchoolCodeValid,
  isUsmIDValid,
  isValidAddress,
  isValidCourseID,
  isValidEmail,
  isValidHours,
  isValidPassword,
  isValidPhoneNumber,
} from "../../../utils/validators";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const rows_per_page = 2;
import { enqueueSnackbar } from "notistack";
import { DEBUG, SERVER_URL } from "../../../config/conf";
import { MoreVert } from "@mui/icons-material";
import { useRouter } from "next/router";
import { DataGrid } from "@mui/x-data-grid";
const ITEM_HEIGHT = 48;

export default function USMCourses({ usm_courses, total_rows, departments }) {
  const [open, setOpen] = useState(false);
  const [current_default_value, set_current_default_value] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [search_query, set_search_query] = useState("");
  const [isSearchResultsShowing, setSearchResultsShowing] = useState(false);
  const [search_results, set_search_results] = useState([]);

  const [row_count, set_row_count] = useState(total_rows);
  const [rowCountState, setRowCountState] = useState(row_count);
  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      row_count !== undefined ? row_count : prevRowCountState
    );
  }, [row_count, setRowCountState]);

  const [isLoading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: rows_per_page,
  });
  const handleEditOpen = (v) => {
    set_current_default_value({ ...v });
    setIsEdit(true);
    setOpen(true);
  };

  useEffect(() => {
    set_row_count(total_rows);
  }, [total_rows]);

  const handleClickOpen = () => {
    setIsEdit(false);
    set_current_default_value({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
  };

  const columns = [
    {
      field: "course_name",
      headerName: "Course Name",
      sortable: false,
      minWidth: 150,
      flex: 1,
    },
    {
      field: "course_id",
      headerName: "Course ID",
      sortable: false,
      minWidth: 150,
      flex: 1,
    },
    {
      field: "course_hours",
      headerName: "Course Hours",
      sortable: false,
      minWidth: 150,
      flex: 1,
    },
    {
      field: "department",
      headerName: "Department",
      sortable: false,
      minWidth: 160,
      flex: 1,
      valueGetter: (params) =>
        `${params.row.department_code || ""} (${
          params.row.department_name || ""
        })`,
    },

    {
      field: "action",
      headerName: "Action",
      sortable: false,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => (
        <GridActionButton params={params} handleEditOpen={handleEditOpen} />
      ),
    },
  ];

  const move_page = async (page_data) => {
    setPaginationModel((pre) => ({ ...pre, ...page_data }));
    await search(page_data?.page + 1);
  };

  const search = async (curr_page = 1) => {
    setLoading(true);
    if (search_query == "") {
      // setSearchResultsShowing(false);
      // curr_page = 1;
      // return;
    }
    try {
      const re = await fetch(`${SERVER_URL}/get_usm_courses`, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
          q: search_query,
          page: curr_page,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!re.ok) throw await re.json();
      const data = await re.json();
      set_search_results(data?.data);
      setSearchResultsShowing(true);
      set_row_count(data?.total_rows);
    } catch (error) {
      if (DEBUG) console.log(error);
      enqueueSnackbar({
        message: error?.message
          ? error?.message
          : "Sorry! Couldn't process your request",
      });
    }
    setLoading(false);
  };

  const my_data_grid = (
    <DataGrid
      getRowId={(row) => row.course_id}
      rows={isSearchResultsShowing ? search_results : usm_courses}
      rowCount={rowCountState}
      loading={isLoading}
      columns={columns}
      pageSizeOptions={[
        isSearchResultsShowing
          ? search_results?.length === 0
            ? 0
            : usm_courses?.length === 0
            ? 0
            : rows_per_page
          : rows_per_page,
      ]}
      initialState={{
        pagination: {
          paginationModel: { pageSize: rows_per_page },
        },
      }}
      paginationModel={paginationModel}
      paginationMode="server"
      disableRowSelectionOnClick={true}
      disableColumnMenu={true}
      onPaginationModelChange={(data) => {
        move_page(data);
      }}
    />
  );
  return (
    <Box
      sx={{
        display: "flex",
        py: 2,
        mt: 4,
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <Button variant="outlined" onClick={handleClickOpen}>
        Add USM Course
      </Button>

      <Box>
        <TextField
          label="Search"
          sx={{ m: 1 }}
          value={search_query}
          onChange={(e) => set_search_query(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              search();
            }
          }}
        />
      </Box>
      <UserDialog
        open={open}
        onClose={handleClose}
        departments={departments}
        edit={isEdit}
        defaultVal={current_default_value}
      />

      <Box sx={{ overflow: "hidden" }}>
        {isSearchResultsShowing ? (
          search_results?.length === 0 ? (
            <div>No Data Found</div>
          ) : (
            my_data_grid
          )
        ) : usm_courses?.length === 0 ? (
          <div>No Data Found</div>
        ) : (
          my_data_grid
        )}
      </Box>
    </Box>
  );
}

function GridActionButton({ params, handleEditOpen }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleEditOpen(params.row);
  };

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };

  const handleRequest = async () => {
    try {
      const re = await fetch(`${SERVER_URL}/delete_usm_course`, {
        credentials: "include",
        method: "DELETE",
        body: JSON.stringify({
          course_id: params.row?.course_id,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!re.ok) throw await re.json();

      enqueueSnackbar({
        message: `Succesfully deleted the course`,
      });
      refreshData();
    } catch (error) {
      if (DEBUG) console.log(error);
      enqueueSnackbar({
        message: error?.message
          ? error?.message
          : "Sorry! Couldn't process your request",
      });
    }
    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
            },
          },
        }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleRequest}>Delete</MenuItem>
      </Menu>
    </div>
  );
}

function UserDialog({
  open,
  onClose,
  departments,
  edit = false,
  defaultVal = {},
}) {
  const [course_name, set_course_name] = useState({
    value: "",
    error: "",
  });
  const [course_id, set_course_id] = useState({
    value: "",
    error: "",
  });
  const [pre_course_id, set_prev_course_id] = useState("");
  const [selected_department, set_selected_department] = useState({
    value: "",
    error: "",
  });
  const [course_hours, set_course_hours] = useState({
    value: "",
    error: "",
  });

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    //If the user or edit status changes,we have to update the state
    if (edit) {
      set_course_name({ value: defaultVal?.course_name, error: "" });
      set_course_id({ value: defaultVal?.course_id, error: "" });
      set_selected_department({
        value: defaultVal?.department_code,
        error: "",
      });
      set_prev_course_id(defaultVal?.course_id);
    } else {
      set_course_name({ value: "", error: "" });
      set_course_id({ value: "", error: "" });
      set_selected_department({ value: "", error: "" });
    }
  }, [edit, defaultVal]);

  const send_req_user = async () => {
    const major_name_valid = isLongNameValid(course_name.value);
    const major_code_valid = isValidCourseID(course_id.value);
    const department_valid = selected_department.value ? true : false;
    const credit_hours_valid = isValidHours(course_hours.value);
    if (!major_name_valid) {
      set_course_name((pre) => ({
        ...pre,
        error: "Please enter a valid course name",
      }));
    }
    if (!major_code_valid) {
      set_course_id((pre) => ({
        ...pre,
        error: "Please enter a valid course ID",
      }));
    }

    if (!department_valid) {
      set_selected_department((pre) => ({
        ...pre,
        error: "Please select a valid department",
      }));
    }
    if (!credit_hours_valid) {
      set_course_hours((pre) => ({
        ...pre,
        error: "Please enter a valid course hours",
      }));
    }

    if (
      !major_name_valid ||
      !major_code_valid ||
      !department_valid ||
      !credit_hours_valid
    ) {
      return;
    }

    try {
      const re = await fetch(
        `${SERVER_URL}/${edit ? `update_usm_course` : `add_usm_course`}`,
        {
          credentials: "include",
          method: "POST",
          body: JSON.stringify({
            course_name: course_name.value,
            course_id: course_id.value,
            department: selected_department.value,
            pre_course_id: pre_course_id,
            course_hours: course_hours.value,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!re.ok) throw await re.json();

      enqueueSnackbar({
        message: `Succesfully ${edit ? `updated` : `created`} the course`,
      });
      onClose();
      refreshData();
    } catch (error) {
      if (DEBUG) console.log(error);
      enqueueSnackbar({
        message: error?.message
          ? error?.message
          : "Sorry! Couldn't update the course",
      });
    }
  };

  return (
    <Dialog
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          px: "10px",
          py: "20px",
        },
      }}
    >
      <DialogTitle>{edit ? `Edit Course` : `Add New Course`}</DialogTitle>

      {/* Second name and Email */}
      <Box sx={{ display: "flex" }}>
        <TextField
          label="Course Name"
          sx={{ m: 1 }}
          value={course_name.value}
          onChange={(e) =>
            set_course_name((pre) => {
              return { error: "", value: e.target.value };
            })
          }
          error={course_name.error ? true : false}
          helperText={course_name.error}
        />
        <TextField
          label="Course ID"
          sx={{ m: 1 }}
          value={course_id.value}
          onChange={(e) =>
            set_course_id((pre) => {
              return { error: "", value: e.target.value };
            })
          }
          error={course_id.error ? true : false}
          helperText={course_id.error}
        />
      </Box>

      <Box sx={{ display: "flex" }}>
        <TextField
          label="Course Hours"
          sx={{ m: 1 }}
          type="number"
          value={course_hours.value}
          onChange={(e) =>
            set_course_hours((pre) => {
              return { error: "", value: e.target.value };
            })
          }
          error={course_hours.error ? true : false}
          helperText={course_hours.error}
        />
      </Box>
      {/* Role and Department */}

      <Box>
        <FormControl
          sx={{ minWidth: "50%" }}
          error={selected_department.error ? true : false}
        >
          <InputLabel>Please select the course Department</InputLabel>
          <Select
            label="Please select the course Department"
            value={selected_department.value}
            onChange={(e) =>
              set_selected_department((pre) => {
                return { error: "", value: e.target.value };
              })
            }
          >
            {departments?.map(({ department_code, department_name }) => (
              <MenuItem value={department_code} key={department_code}>
                {department_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", gap: "10px" }}>
        <Button variant="contained" onClick={send_req_user}>
          {edit ? "Update" : "Create"}
        </Button>
        <Button variant="contained" onClick={onClose}>
          Cancel
        </Button>
      </Box>
    </Dialog>
  );
}
