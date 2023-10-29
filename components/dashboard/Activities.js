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
  Switch,
  FormControlLabel,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import { Button } from "@mui/material";

const rows_per_page = NUM_OF_ROWS_PER_PAGE;
import { enqueueSnackbar } from "notistack";
import { DEBUG, NUM_OF_ROWS_PER_PAGE, SERVER_URL } from "../../config/conf";
import { Close, Done, MoreVert } from "@mui/icons-material";
import { useRouter } from "next/router";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Loading from "../Loading";
const ITEM_HEIGHT = 48;

dayjs.extend(utc);
dayjs.extend(timezone);
export default function DashboardActivities({ students, total_rows }) {
  const [open, setOpen] = useState(false);
  const [search_query, set_search_query] = useState("");
  const [isSearchResultsShowing, setSearchResultsShowing] = useState(false);
  const [search_results, set_search_results] = useState([]);

  const [row_count, set_row_count] = useState(total_rows);
  const [rowCountState, setRowCountState] = useState(row_count);
  const [current_student_data, set_current_student_data] = useState({});
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

  const [show_verified, set_show_verified] = useState(false);

  useEffect(() => {
    set_row_count(total_rows);
  }, [total_rows]);

  const view_student = (std_data) => {
    set_current_student_data(std_data);
    handleOpen();
  };

  const columns = [
    {
      field: "view",
      headerName: "View",
      sortable: false,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => (
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={() => view_student(params.row)}
        >
          <LaunchIcon />
        </IconButton>
      ),
    },
    {
      field: "student_id",
      headerName: "Student ID",
      sortable: false,
      minWidth: 150,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Student Name",
      sortable: false,
      minWidth: 150,
      flex: 1,
    },
    {
      field: "major",
      headerName: "Major",
      sortable: false,
      minWidth: 50,
      flex: 1,
    },
    {
      field: "created_by",
      headerName: "Created BY",
      sortable: false,
      minWidth: 160,
    },
    {
      field: "updated_by",
      headerName: "Updated BY",
      sortable: false,
      minWidth: 160,
    },
    {
      field: "transfer_date",
      headerName: "Transfer Date",
      sortable: false,
      minWidth: 160,
    },
    {
      field: "graduation_year",
      headerName: "Graduation Date",
      sortable: false,
      minWidth: 160,
    },
    {
      field: "created_at",
      headerName: "Created Date",
      sortable: false,
      minWidth: 160,
      valueGetter: (params) => {
        const pre = dayjs(params.row.created_at).tz().toDate().toLocaleString();
        return `${pre}`;
      },
    },
    {
      field: "last_updated",
      headerName: "Last Updated Date",
      sortable: false,
      minWidth: 160,
      valueGetter: (params) => {
        const pre = dayjs(params.row.last_updated)
          .tz()
          .toDate()
          .toLocaleString();
        return `${pre}`;
      },
    },

    {
      field: "action",
      headerName: "Action",
      sortable: false,
      minWidth: 50,
      flex: 1,
      renderCell: (params) => <GridActionButton params={params} />,
    },
  ];

  const move_page = async (page_data) => {
    setPaginationModel((pre) => ({ ...pre, ...page_data }));
    await search(page_data?.page + 1);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const search = async (curr_page = 1) => {
    setLoading(true);
    if (search_query == "") {
      // setSearchResultsShowing(false);
      // curr_page = 1;
      // return;
    }
    try {
      const re = await fetch(`${SERVER_URL}/get_students`, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
          q: search_query,
          page: curr_page,
          verified: show_verified,
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

  useEffect(() => {
    search();
  }, [show_verified]);

  const my_data_grid = (
    <DataGrid
      getRowId={(row) => row.student_id}
      rows={isSearchResultsShowing ? search_results : students}
      rowCount={rowCountState}
      loading={isLoading}
      columns={columns}
      pageSizeOptions={[
        isSearchResultsShowing
          ? search_results?.length === 0
            ? 0
            : students?.length === 0
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
      <FormControlLabel
        control={
          <Switch
            defaultChecked
            checked={show_verified}
            onChange={(e) => {
              set_show_verified(e.target.checked);
            }}
          />
        }
        label="Show student records that were completed"
      />

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
        student_data={current_student_data}
      />

      <Box sx={{ overflow: "hidden" }}>
        {isSearchResultsShowing ? (
          search_results?.length === 0 ? (
            <div>No Data Found</div>
          ) : (
            my_data_grid
          )
        ) : students?.length === 0 ? (
          <div>No Data Found</div>
        ) : (
          my_data_grid
        )}
      </Box>
    </Box>
  );
}

function GridActionButton({ params }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };

  const handleRequest = async (isDelete = false) => {
    try {
      const re = await fetch(
        `${SERVER_URL}/${isDelete ? `delete_student` : `mark_all_course`}`,
        {
          credentials: "include",
          method: isDelete ? "DELETE" : "POST",
          body: JSON.stringify({
            student_id: params.row?.student_id,
            status: !params.row.total_verified,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!re.ok) throw await re.json();

      enqueueSnackbar({
        message: `Succesfully ${isDelete ? `deleted` : `updated`} the student`,
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
        <MenuItem onClick={() => handleRequest(false)}>
          {params.row.total_verified
            ? `Mark as Incomplete`
            : `Mark as Complete`}
        </MenuItem>
        <MenuItem onClick={() => handleRequest(true)}>Delete</MenuItem>
      </Menu>
    </div>
  );
}

function UserDialog({ open, onClose, student_data }) {
  const { student_id } = student_data;

  const [selected_rows, set_selected_rows] = useState([]);
  const [fetched_student_data, set_fetched_student_data] = useState({
    courses_taken: [],
    created_at: "",
    created_by: "",
    graduation_year: "",
    last_updated: "",
    major: "",
    name: "",
    transfer_date: "",
    updated_by: "",
    total_verified: false,
  });

  const course_columns = [
    {
      field: "course_id",
      headerName: "Course ID",
      sortable: false,
      minWidth: 100,
      flex: 1,
    },
    {
      field: "course_name",
      headerName: "Course Name",
      sortable: false,
      minWidth: 150,
      flex: 1,
    },
    {
      field: "school",
      headerName: "School",
      sortable: false,
      minWidth: 50,
      flex: 1,
      valueGetter: (params) => {
        return `${params.row.school} ${
          params.row.school_name ? `(${params.row.school_name})` : ``
        }`;
      },
    },
    {
      field: "usm_eqv",
      headerName: "USM Equivalent",
      sortable: false,
      minWidth: 160,
      valueGetter: (params) => {
        return `${params.row.usm_eqv || ""} ${
          params.row.usm_eqv_course_name
            ? `(${params.row.usm_eqv_course_name})`
            : ``
        }`;
      },
    },
    {
      field: "verified",
      headerName: "Completed",
      sortable: false,
      type: "boolean",
      minWidth: 50,
    },
    // {
    //   field: "action",
    //   headerName: "Action",
    //   sortable: false,
    //   minWidth: 50,
    //   flex: 1,
    //   renderCell: (params) => <GridActionButton params={params} />,
    // },
  ];

  const fetch_student_courses = async () => {
    try {
      const re = await fetch(`${SERVER_URL}/get_student_all_courses`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: student_id }),
      });

      if (!re.ok) throw await re.json();

      let results = await re.json();
      set_fetched_student_data(results);
    } catch (error) {
      if (DEBUG) console.log(error);
      enqueueSnackbar({
        message: error?.message
          ? error?.message
          : "Sorry! Couldn't fetch students properly",
      });
    }
  };

  useEffect(() => {
    if (student_id) {
      fetch_student_courses();
    }
  }, [student_id]);

  const format_id_school = (re) => {
    let my_data = { student_id, courses: [] };
    if (re?.length === 0) throw { msg: "Please select a course" };
    re.map((key) => {
      let [c_course_id, c_school] = key.split(",");
      my_data.courses.push({ course_id: c_course_id, school: c_school });
    });
    return my_data;
  };

  const delete_selected = async () => {
    try {
      const re = await fetch(`${SERVER_URL}/delete_marked_course`, {
        credentials: "include",
        method: "DELETE",
        body: JSON.stringify({
          ...format_id_school(selected_rows),
          student_id: student_id,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!re.ok) throw await re.json();

      await fetch_student_courses();
      enqueueSnackbar({
        message: `Succesfully updated the student data`,
      });
    } catch (error) {
      if (DEBUG) console.log(error);
      enqueueSnackbar({
        message: error?.message
          ? error?.message
          : "Sorry! Couldn't process your request",
      });
    }
  };
  const complete_selected = async (is_active) => {
    try {
      const re = await fetch(`${SERVER_URL}/mark_selected_course`, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
          ...format_id_school(selected_rows),
          status: is_active,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!re.ok) throw await re.json();

      await fetch_student_courses();
      enqueueSnackbar({
        message: `Succesfully updated the student data`,
      });
    } catch (error) {
      if (DEBUG) console.log(error);
      enqueueSnackbar({
        message: error?.message
          ? error?.message
          : "Sorry! Couldn't process your request",
      });
    }
  };
  const complete_all = async (status = true) => {
    try {
      const re = await fetch(`${SERVER_URL}/mark_all_course`, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
          student_id,
          status,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!re.ok) throw await re.json();

      await fetch_student_courses();
      enqueueSnackbar({
        message: `Succesfully updated the student data`,
      });
    } catch (error) {
      if (DEBUG) console.log(error);
      enqueueSnackbar({
        message: error?.message
          ? error?.message
          : "Sorry! Couldn't process your request",
      });
    }
  };

  if (fetched_student_data?.courses_taken?.length === 0) return <Loading />;

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
      <DialogTitle>{fetched_student_data?.name}</DialogTitle>
      <Button
        onClick={() =>
          complete_all(fetched_student_data?.total_verified ? false : true)
        }
      >
        {fetched_student_data?.total_verified
          ? "Mark Student as Incomplete"
          : "Mark Student as Completed"}
      </Button>
      <Typography variant="subtitle">{`Student ID: ${student_id}`}</Typography>
      <Typography variant="subtitle">{`Major: ${fetched_student_data?.major}`}</Typography>
      <Typography variant="subtitle">{`Transfer: ${fetched_student_data?.transfer_date}`}</Typography>
      <Typography variant="subtitle">{`Graduation: ${fetched_student_data?.graduation_year}`}</Typography>
      <Typography variant="subtitle">{`Register Date: ${dayjs(
        fetched_student_data?.created_at
      )
        .tz()
        .toDate()
        .toLocaleString()}`}</Typography>
      <Typography variant="subtitle">{`Register User: ${fetched_student_data?.created_by}`}</Typography>
      <Typography variant="subtitle">{`Last Update Date: ${dayjs(
        fetched_student_data?.last_updated
      )
        .tz()
        .toDate()
        .toLocaleString()}`}</Typography>

      <Typography variant="subtitle">{`Last Update User: ${fetched_student_data?.updated_by}`}</Typography>

      <Typography variant="h6">{`Courses Taken:`}</Typography>

      <Box sx={{ display: "flex" }}>
        <Button disabled={selected_rows.length === 0} onClick={delete_selected}>
          Delete Selected
        </Button>
        <Button
          disabled={selected_rows.length === 0}
          onClick={() => complete_selected(true)}
        >
          Mark Selected as Complete
        </Button>
        <Button
          disabled={selected_rows.length === 0}
          onClick={() => complete_selected(false)}
        >
          Mark Selected as Inomplete
        </Button>
      </Box>
      <DataGrid
        getRowId={(row) => `${row.course_id},${row.school}`}
        rows={fetched_student_data?.courses_taken}
        columns={course_columns}
        disableColumnMenu={true}
        checkboxSelection
        onRowSelectionModelChange={(row) => set_selected_rows(row)}
      />
    </Dialog>
  );
}

//Delete Student and Mark student as Incomplete Remains
