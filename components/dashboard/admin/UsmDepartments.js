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

const rows_per_page = 2;
import { enqueueSnackbar } from "notistack";
import { DEBUG, SERVER_URL } from "../../../config/conf";
import { MoreVert } from "@mui/icons-material";
import { useRouter } from "next/router";
import { DataGrid } from "@mui/x-data-grid";
const ITEM_HEIGHT = 48;

export default function Schools({ departments, total_rows }) {
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
      field: "department_name",
      headerName: "Department Name",
      sortable: false,
      minWidth: 150,
      flex: 1,
    },
    {
      field: "department_code",
      headerName: "Department Code",
      sortable: false,
      minWidth: 150,
      flex: 1,
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
      const re = await fetch(`${SERVER_URL}/get_departments`, {
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
      getRowId={(row) => row.department_code}
      rows={isSearchResultsShowing ? search_results : departments}
      rowCount={rowCountState}
      loading={isLoading}
      columns={columns}
      pageSizeOptions={[
        isSearchResultsShowing
          ? search_results?.length === 0
            ? 0
            : departments?.length === 0
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
        Add Department
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
        ) : departments?.length === 0 ? (
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
      const re = await fetch(`${SERVER_URL}/delete_department`, {
        credentials: "include",
        method: "DELETE",
        body: JSON.stringify({
          department_code: params.row?.department_code,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!re.ok) throw await re.json();

      enqueueSnackbar({
        message: `Succesfully deleted the department`,
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

function UserDialog({ open, onClose, edit = false, defaultVal = {} }) {
  const [name, set_name] = useState({
    value: "",
    error: "",
  });
  const [code, set_code] = useState({ value: "", error: "" });
  const [pre_code, set_pre_code] = useState({ value: "", error: "" });

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    //If the user or edit status changes,we have to update the state
    if (edit) {
      set_name({ value: defaultVal?.department_name, error: "" });
      set_code({ value: defaultVal?.department_code, error: "" });
      set_pre_code({ value: defaultVal?.department_code, error: "" });
    } else {
      set_name({ value: "", error: "" });
      set_code({ value: "", error: "" });
    }
  }, [edit, defaultVal]);

  const send_req_user = async () => {
    const department_name_valid = isLongNameValid(name.value);
    const code_valid = isSchoolCodeValid(code.value);

    if (!department_name_valid) {
      set_name((pre) => ({
        ...pre,
        error: "Please enter a valid department name",
      }));
    }
    if (!code_valid) {
      set_code((pre) => ({ ...pre, error: "Please enter a valid code" }));
    }

    if (!department_name_valid || !code_valid) {
      return;
    }

    try {
      const re = await fetch(
        `${SERVER_URL}/${edit ? `update_department` : `add_department`}`,
        {
          credentials: "include",
          method: "POST",
          body: JSON.stringify({
            department_name: name.value,
            department_code: code.value,
            pre_department_code: pre_code.value,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!re.ok) throw await re.json();

      enqueueSnackbar({
        message: `Succesfully ${edit ? `updated` : `created`} the department`,
      });
      onClose();
      refreshData();
    } catch (error) {
      if (DEBUG) console.log(error);
      enqueueSnackbar({
        message: error?.message
          ? error?.message
          : "Sorry! Couldn't process your request",
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
      <DialogTitle>
        {edit ? `Edit Department` : `Add New Department`}
      </DialogTitle>

      {/* Second name and code */}
      <Box sx={{ display: "flex" }}>
        <TextField
          label="Department Name"
          sx={{ m: 1 }}
          value={name.value}
          onChange={(e) =>
            set_name((pre) => {
              return { error: "", value: e.target.value };
            })
          }
          error={name.error ? true : false}
          helperText={name.error}
        />
      </Box>
      <Box>
        <TextField
          label="Department Code"
          sx={{ m: 1 }}
          value={code.value}
          onChange={(e) =>
            set_code((pre) => {
              return { error: "", value: e.target.value };
            })
          }
          error={code.error ? true : false}
          helperText={code.error}
        />
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
