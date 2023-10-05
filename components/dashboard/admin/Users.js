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
  isNameValid,
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

export default function Users({ departments, users, total_pages, total_rows }) {
  const [open, setOpen] = useState(false);
  const [current_default_value, set_current_default_value] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [search_query, set_search_query] = useState("");
  const [isSearchResultsShowing, setSearchResultsShowing] = useState(false);
  const [search_results, set_search_results] = useState([]);
  const [page_count, set_page_count] = useState(total_pages);

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
    set_page_count(total_pages);
  }, [total_pages]);
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
      field: "name",
      headerName: "Full Name",
      sortable: false,
      minWidth: 150,
      flex: 1,
      valueGetter: (params) =>
        `${params.row.first_name || ""} ${params.row.last_name || ""}`,
    },
    {
      field: "email",
      headerName: "Email",
      type: "email",
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
        `${params.row.department || ""} (${params.row.department_name || ""})`,
    },
    {
      field: "created_by",
      headerName: "Created By",
      sortable: false,
      width: 140,
      valueGetter: (params) => `${params.row.created_by || ""}`,
    },
    {
      field: "role",
      headerName: "Role",
      sortable: false,
      minWidth: 80,
      flex: 1,
      valueGetter: (params) =>
        `${params.row.role === 0 ? "Organizer" : "Admin"}`,
    },
    {
      field: "is_active",
      headerName: "Status",
      sortable: false,
      minWidth: 80,
      flex: 1,
      valueGetter: (params) =>
        `${params.row.is_active ? "Active" : "Deactivated"}`,
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
      const re = await fetch(`${SERVER_URL}/get_users`, {
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
      set_page_count(data?.total);
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
      getRowId={(row) => row.email}
      rows={isSearchResultsShowing ? search_results : users}
      rowCount={rowCountState}
      loading={isLoading}
      columns={columns}
      pageSizeOptions={[
        isSearchResultsShowing
          ? search_results?.length === 0
            ? 0
            : users?.length === 0
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
        ) : users?.length === 0 ? (
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

  const handleRequest = async (isDelete = true) => {
    try {
      const re = await fetch(
        `${SERVER_URL}/${isDelete ? `delete_user` : `update_user_status`}`,
        {
          credentials: "include",
          method: isDelete ? "DELETE" : "POST",
          body: JSON.stringify({
            email: params.row?.email,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!re.ok) throw await re.json();

      enqueueSnackbar({
        message: `Succesfully ${
          isDelete ? `deleted` : `changed status of`
        } the user`,
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
        <MenuItem onClick={() => handleRequest(false)}>
          {params.row.is_active ? "Deactivate" : "Activate"}
        </MenuItem>
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
  const [first_name, set_first_name] = useState({
    value: "",
    error: "",
  });
  const [last_name, set_last_name] = useState({
    value: "",
    error: "",
  });
  const [email, set_email] = useState({ value: "", error: "" });
  const [role, set_role] = useState({
    value: "",
    error: "",
  });
  const [password, set_password] = useState({ value: "", error: "" });
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
      set_first_name({ value: defaultVal?.first_name, error: "" });
      set_last_name({ value: defaultVal?.last_name, error: "" });
      set_role({ value: defaultVal?.role, error: "" });
      set_selected_department({ value: defaultVal?.department, error: "" });
      set_email({ value: defaultVal?.email, error: "" });
    } else {
      set_first_name({ value: "", error: "" });
      set_last_name({ value: "", error: "" });
      set_role({ value: "", error: "" });
      set_selected_department({ value: "", error: "" });
      set_email({ value: "", error: "" });
      set_password({ value: "", error: "" });
    }
  }, [edit, defaultVal]);

  const send_req_user = async () => {
    const f_name_valid = isNameValid(first_name.value);
    const l_name_valid = isNameValid(last_name.value);
    const email_valid = isValidEmail(email.value);
    const role_valid = role.value === 0 || role.value === 1 ? true : false;
    const department_valid = selected_department.value ? true : false;
    const password_valid = isValidPassword(password.value);
    if (!f_name_valid) {
      set_first_name((pre) => ({ ...pre, error: "Please enter a valid name" }));
    }
    if (!l_name_valid) {
      set_last_name((pre) => ({ ...pre, error: "Please enter a valid name" }));
    }

    if (!edit) {
      if (!email_valid) {
        set_email((pre) => ({ ...pre, error: "Please enter a valid email" }));
      }

      if (!password_valid) {
        set_password((pre) => ({
          ...pre,
          error: "Password should be at least 6 characters long with a number",
        }));
      }
    }
    if (!role_valid) {
      set_role((pre) => ({ ...pre, error: "Please select a valid role" }));
    }

    if (!department_valid) {
      set_selected_department((pre) => ({
        ...pre,
        error: "Please select a valid department",
      }));
    }

    if (!f_name_valid || !l_name_valid || !role_valid || !department_valid) {
      return;
    }
    if (!edit) {
      if (!email_valid || !password_valid) return; //Check email and password if creating new user
    }

    try {
      const re = await fetch(
        `${SERVER_URL}/${edit ? `update_user` : `add_user`}`,
        {
          credentials: "include",
          method: "POST",
          body: JSON.stringify({
            first_name: first_name.value,
            last_name: last_name.value,
            email: email.value,
            password: password.value,
            role: role.value,
            department: selected_department.value,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!re.ok) throw await re.json();

      enqueueSnackbar({
        message: `Succesfully ${edit ? `updated` : `created`} the user`,
      });
      onClose();
      refreshData();
    } catch (error) {
      if (DEBUG) console.log(error);
      enqueueSnackbar({
        message: error?.message
          ? error?.message
          : "Sorry! Couldn't add the user",
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
      <DialogTitle>{edit ? `Edit User` : `Add New User`}</DialogTitle>

      {/* Second name and Email */}
      <Box sx={{ display: "flex" }}>
        <TextField
          label="First Name"
          sx={{ m: 1 }}
          value={first_name.value}
          onChange={(e) =>
            set_first_name((pre) => {
              return { error: "", value: e.target.value };
            })
          }
          error={first_name.error ? true : false}
          helperText={first_name.error}
        />
        <TextField
          label="Last Name"
          sx={{ m: 1 }}
          value={last_name.value}
          onChange={(e) =>
            set_last_name((pre) => {
              return { error: "", value: e.target.value };
            })
          }
          error={last_name.error ? true : false}
          helperText={last_name.error}
        />
      </Box>
      {!edit ? (
        <Box>
          <TextField
            label="Email"
            type="email"
            sx={{ m: 1 }}
            value={email.value}
            onChange={(e) =>
              set_email((pre) => {
                return { error: "", value: e.target.value };
              })
            }
            error={email.error ? true : false}
            helperText={email.error}
          />
          <TextField
            label="Password"
            type="password"
            sx={{ m: 1 }}
            value={password.value}
            onChange={(e) =>
              set_password((pre) => {
                return { error: "", value: e.target.value };
              })
            }
            error={password.error ? true : false}
            helperText={password.error}
          />
        </Box>
      ) : null}

      {/* Role and Department */}
      <Box sx={{ display: "flex", gap: "10px" }}>
        <FormControl sx={{ minWidth: "50%" }} error={role.error ? true : false}>
          <InputLabel>Please select the users role</InputLabel>
          <Select
            label="Please select the users role"
            value={role.value}
            onChange={(e) =>
              set_role((pre) => {
                return { error: "", value: e.target.value };
              })
            }
          >
            <MenuItem value={0}>Organizer / Staff</MenuItem>
            <MenuItem value={1}>Administrator</MenuItem>
          </Select>
        </FormControl>
      </Box>

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
