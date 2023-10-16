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

const rows_per_page = NUM_OF_ROWS_PER_PAGE;
import { enqueueSnackbar } from "notistack";
import { DEBUG, NUM_OF_ROWS_PER_PAGE, SERVER_URL } from "../../../config/conf";
import { MoreVert } from "@mui/icons-material";
import { useRouter } from "next/router";
import { DataGrid } from "@mui/x-data-grid";
const ITEM_HEIGHT = 48;

export default function USMMajors({ majors, total_rows, departments }) {
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
      field: "major_name",
      headerName: "Major Name",
      sortable: false,
      minWidth: 150,
      flex: 1,
    },
    {
      field: "major_code",
      headerName: "Major Code",
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
      const re = await fetch(`${SERVER_URL}/get_majors`, {
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
      getRowId={(row) => row.major_code}
      rows={isSearchResultsShowing ? search_results : majors}
      rowCount={rowCountState}
      loading={isLoading}
      columns={columns}
      pageSizeOptions={[
        isSearchResultsShowing
          ? search_results?.length === 0
            ? 0
            : majors?.length === 0
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
        Add User
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
        ) : majors?.length === 0 ? (
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
      const re = await fetch(`${SERVER_URL}/delete_major`, {
        credentials: "include",
        method: "DELETE",
        body: JSON.stringify({
          major_code: params.row?.major_code,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!re.ok) throw await re.json();

      enqueueSnackbar({
        message: `Succesfully deleted the major`,
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
  const [major_name, set_major_name] = useState({
    value: "",
    error: "",
  });
  const [major_code, set_major_code] = useState({
    value: "",
    error: "",
  });
  const [pre_major_code, set_prev_major_code] = useState("");
  const [selected_department, set_selected_department] = useState({
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
      set_major_name({ value: defaultVal?.major_name, error: "" });
      set_major_code({ value: defaultVal?.major_code, error: "" });
      set_selected_department({
        value: defaultVal?.department_code,
        error: "",
      });
      set_prev_major_code(defaultVal?.major_code);
    } else {
      set_major_name({ value: "", error: "" });
      set_major_code({ value: "", error: "" });
      set_selected_department({ value: "", error: "" });
    }
  }, [edit, defaultVal]);

  const send_req_user = async () => {
    const major_name_valid = isLongNameValid(major_name.value);
    const major_code_valid = isValidCourseID(major_code.value);
    const department_valid = selected_department.value ? true : false;
    if (!major_name_valid) {
      set_major_name((pre) => ({
        ...pre,
        error: "Please enter a valid major name",
      }));
    }
    if (!major_code_valid) {
      set_major_code((pre) => ({
        ...pre,
        error: "Please enter a valid major code",
      }));
    }

    if (!department_valid) {
      set_selected_department((pre) => ({
        ...pre,
        error: "Please select a valid department",
      }));
    }

    if (!major_name_valid || !major_code_valid || !department_valid) {
      return;
    }

    try {
      const re = await fetch(
        `${SERVER_URL}/${edit ? `update_major` : `add_major`}`,
        {
          credentials: "include",
          method: "POST",
          body: JSON.stringify({
            major_name: major_name.value,
            major_code: major_code.value,
            department: selected_department.value,
            pre_major_code: pre_major_code,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!re.ok) throw await re.json();

      enqueueSnackbar({
        message: `Succesfully ${edit ? `updated` : `created`} the major`,
      });
      onClose();
      refreshData();
    } catch (error) {
      if (DEBUG) console.log(error);
      enqueueSnackbar({
        message: error?.message
          ? error?.message
          : "Sorry! Couldn't update the major",
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
      <DialogTitle>{edit ? `Edit Major` : `Add New Major`}</DialogTitle>

      {/* Second name and Email */}
      <Box sx={{ display: "flex" }}>
        <TextField
          label="Major Name"
          sx={{ m: 1 }}
          value={major_name.value}
          onChange={(e) =>
            set_major_name((pre) => {
              return { error: "", value: e.target.value };
            })
          }
          error={major_name.error ? true : false}
          helperText={major_name.error}
        />
        <TextField
          label="Major Code"
          sx={{ m: 1 }}
          value={major_code.value}
          onChange={(e) =>
            set_major_code((pre) => {
              return { error: "", value: e.target.value };
            })
          }
          error={major_code.error ? true : false}
          helperText={major_code.error}
        />
      </Box>
      {/* Role and Department */}

      <Box>
        <FormControl
          sx={{ minWidth: "50%" }}
          error={selected_department.error ? true : false}
        >
          <InputLabel>Please select the users Department</InputLabel>
          <Select
            label="Please select the users Department"
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
