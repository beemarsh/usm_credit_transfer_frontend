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
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Image from "next/image";
import { AddStudentIcon } from "../../config/icons";
import { Button } from "@mui/material";
import { countries } from "./conf";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {
  isAgeValid,
  isNameValid,
  isUsmIDValid,
  isValidAddress,
  isValidPhoneNumber,
} from "../../utils/validators";
import { enqueueSnackbar } from "notistack";
import { DEBUG, SERVER_URL } from "../../config/conf";
import Loading from "../Loading";

const steps = ["Primary Information", "Transfer Credits and Courses", "Review"];

export default function DashboardAddStudent({ initials }) {
  const { majors, schools } = initials;
  const [activeStep, setActiveStep] = useState(0);
  const [first_name, set_first_name] = useState({
    value: "Bimarsh",
    error: "",
  });
  const [last_name, set_last_name] = useState({ value: "Bhusal", error: "" });
  const [usm_id, set_usm_id] = useState({ value: "10173074", error: "" });

  //
  const [age, set_age] = useState({ value: "20", error: "" });
  const [std_prev_school, set_std_prev_school] = useState({
    value: "JCC",
    error: "",
  });

  //
  const [country, set_country] = useState({ value: "US", error: "" });
  const [dob, set_dob] = useState({ value: dayjs(), error: "" });

  //
  const [phone_number, set_phone_number] = useState({
    country_code: "+1",
    value: "6013072081",
    error: "",
  });
  const [address, set_address] = useState({
    value: "College Drive, Mississippi",
    error: "",
  });
  const [major, set_major] = useState({ value: "CSC", error: "" });
  const [transfer_date, set_transfer_date] = useState({
    value: dayjs(),
    error: "",
  });
  const [graduation_date, set_graduation_date] = useState({
    value: dayjs(),
    error: "",
  });

  //Second Step States
  const [courses, setCourses] = useState([]);
  const [selectedcourses, setSelectedCourses] = useState([
    { value: "", error: "", key: "default_key_for_seleced_courses" },
  ]);

  const first_step_check = () => {
    let f_name_check = isNameValid(first_name.value);
    let l_name_check = isNameValid(last_name.value);
    let usm_id_check = isUsmIDValid(usm_id.value);
    let age_check = isAgeValid(age.value);
    let prev_school_check =
      std_prev_school.value !== "" &&
      std_prev_school.value !== null &&
      std_prev_school.value !== undefined;
    let country_check =
      country.value !== "" &&
      country.value !== null &&
      country.value !== undefined;
    let dob_check =
      dob.value !== "" && dob.value !== null && dob.value !== undefined;
    let phone_check = isValidPhoneNumber(
      phone_number.country_code + phone_number.value
    );
    let address_check = isValidAddress(address.value);
    let major_check =
      major.value !== "" && major.value !== null && major.value !== undefined;
    let trf_date_check =
      transfer_date.value !== "" &&
      transfer_date.value !== null &&
      transfer_date.value !== undefined;
    let grad_date_check =
      graduation_date.value !== "" &&
      graduation_date.value !== null &&
      graduation_date.value !== undefined;

    if (!f_name_check) {
      set_first_name((pre) => ({ ...pre, error: "Please enter a valid name" }));
    }
    if (!l_name_check) {
      set_last_name((pre) => ({ ...pre, error: "Please enter a valid name" }));
    }
    if (!usm_id_check) {
      set_usm_id((pre) => ({
        ...pre,
        error: "Please enter a valid 8 digit USM ID",
      }));
    }
    if (!age_check) {
      set_age((pre) => ({ ...pre, error: "Please enter a valid age" }));
    }
    if (!prev_school_check) {
      set_std_prev_school((pre) => ({
        ...pre,
        error: "Please select previous school",
      }));
    }
    if (!country_check) {
      set_country((pre) => ({ ...pre, error: "Please select a country" }));
    }
    if (!dob_check) {
      set_dob((pre) => ({
        ...pre,
        error: "Please select a valid Date of Birth",
      }));
    }
    if (!phone_check) {
      set_phone_number((pre) => ({
        ...pre,
        error: "Please enter a valid phone number",
      }));
    }
    if (!address_check) {
      set_address((pre) => ({ ...pre, error: "Please enter a valid address" }));
    }
    if (!major_check) {
      set_major((pre) => ({ ...pre, error: "Please select a major" }));
    }
    if (!trf_date_check) {
      set_transfer_date((pre) => ({
        ...pre,
        error: "Please select a transfer date",
      }));
    }
    if (!grad_date_check) {
      set_graduation_date((pre) => ({
        ...pre,
        error: "Please select a graduation date",
      }));
    }

    if (
      !f_name_check ||
      !l_name_check ||
      !usm_id_check ||
      !age_check ||
      !prev_school_check ||
      !country_check ||
      !dob_check ||
      !phone_check ||
      !address_check ||
      !major_check ||
      !trf_date_check ||
      !grad_date_check
    ) {
      return false;
    }
    setActiveStep(1);
    return true;
  };

  const second_step_check = () => {
    setActiveStep(2);
  };
  const back_to_first_step = () => {
    setActiveStep(0);
  };

  const back_to_second_step = () => {
    setActiveStep(1);
  };

  const confirmAndVerify = () => {};
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
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep == 0 ? (
        <FirstStep
          majors={majors}
          schools={schools}
          first_name={first_name}
          last_name={last_name}
          usm_id={usm_id}
          age={age}
          std_prev_school={std_prev_school}
          country={country}
          dob={dob}
          phone_number={phone_number}
          address={address}
          major={major}
          transfer_date={transfer_date}
          graduation_date={graduation_date}
          set_first_name={set_first_name}
          set_last_name={set_last_name}
          set_usm_id={set_usm_id}
          set_age={set_age}
          set_std_prev_school={set_std_prev_school}
          set_country={set_country}
          set_dob={set_dob}
          set_phone_number={set_phone_number}
          set_address={set_address}
          set_major={set_major}
          set_transfer_date={set_transfer_date}
          set_graduation_date={set_graduation_date}
          nextStep={first_step_check}
        />
      ) : activeStep == 1 ? (
        <SecondStep
          selected_school={std_prev_school.value}
          courses={courses}
          selectedcourses={selectedcourses}
          setCourses={setCourses}
          setSelectedCourses={setSelectedCourses}
          previousStep={back_to_first_step}
          nextStep={second_step_check}
        />
      ) : (
        <ThirdStep
          confirmAndVerify={confirmAndVerify}
          previousStep={back_to_second_step}
          first_name={first_name}
          last_name={last_name}
          usm_id={usm_id}
          age={age}
          std_prev_school={std_prev_school}
          country={country}
          dob={dob}
          phone_number={phone_number}
          address={address}
          major={major}
          transfer_date={transfer_date}
          graduation_date={graduation_date}
          courses={courses}
          majors={majors}
          schools={schools}
          selectedcourses={selectedcourses}
        />
      )}
    </Box>
  );
}

const FirstStep = ({
  majors,
  schools,
  first_name,
  last_name,
  usm_id,
  age,
  std_prev_school,
  country,
  dob,
  phone_number,
  address,
  major,
  transfer_date,
  graduation_date,
  set_first_name,
  set_last_name,
  set_usm_id,
  set_age,
  set_std_prev_school,
  set_country,
  set_dob,
  set_phone_number,
  set_address,
  set_major,
  set_transfer_date,
  set_graduation_date,
  nextStep,
  ...props
}) => {
  return (
    <>
      {/* Profile Pic */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Image */}
        <Image
          src={AddStudentIcon}
          alt="User Picture"
          height={150}
          width={150}
        />
        {/* Add Image Button */}
        <Button variant="contained">Add a Picture</Button>
      </Box>

      {/* Second name and ID row */}
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
        <TextField
          label="8 Digit USM ID"
          sx={{ m: 1 }}
          value={usm_id.value}
          onChange={(e) =>
            set_usm_id((pre) => {
              return { error: "", value: e.target.value };
            })
          }
          error={usm_id.error ? true : false}
          helperText={usm_id.error}
        />
      </Box>

      {/* Third Age and Previous School Row */}
      <Box>
        <TextField
          label="Age"
          sx={{ m: 1, width: "5rem" }}
          value={age.value}
          onChange={(e) =>
            set_age((pre) => {
              return { error: "", value: e.target.value };
            })
          }
          error={age.error ? true : false}
          helperText={age.error}
        />

        <FormControl
          sx={{ m: 1, minWidth: `calc(100% - 30%)` }}
          error={std_prev_school.error ? true : false}
        >
          <InputLabel id="demo-simple-select-helper-label">
            Please select previous institute of applicant
          </InputLabel>
          <Select
            label="Please select previous institute of applicant"
            value={std_prev_school.value}
            onChange={(e) =>
              set_std_prev_school((pre) => {
                return { error: "", value: e.target.value };
              })
            }
          >
            {schools.map(({ code, name }) => (
              <MenuItem key={code} value={code}>
                {`${name} (${code})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Fourth Country and DOB */}
      <Box sx={{ display: "flex", gap: "10px" }}>
        <FormControl
          sx={{ minWidth: "50%" }}
          error={country.error ? true : false}
        >
          <InputLabel>Please select country of applicant</InputLabel>
          <Select
            label="Please select country of applicant"
            value={country.value}
            onChange={(e) =>
              set_country((pre) => {
                return { error: "", value: e.target.value };
              })
            }
          >
            {countries.map(({ code, name, isDefault }) => (
              <MenuItem key={code} value={code} defaultChecked={isDefault}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <DatePicker
          label="Date of Birth"
          value={dayjs(dob.value)}
          openTo="year"
          onChange={(v) => {
            set_dob((pre) => {
              return { error: "", value: v };
            });
          }}
        />
      </Box>

      {/* Fifth address and phone number */}
      <Box sx={{ display: "flex", gap: "10px" }}>
        <TextField
          label="Phone Number"
          sx={{ m: 1 }}
          value={phone_number.value}
          onChange={(e) =>
            set_phone_number((pre) => {
              return {
                error: "",
                value: e.target.value,
                country_code: countries.find(
                  ({ code }) => country.value == code
                ).dial_code,
              };
            })
          }
          error={phone_number.error ? true : false}
          helperText={phone_number.error}
        />
        <TextField
          label="Address"
          sx={{ m: 1 }}
          value={address.value}
          onChange={(e) =>
            set_address((pre) => {
              return { error: "", value: e.target.value };
            })
          }
          error={address.error ? true : false}
          helperText={address.error}
        />
      </Box>

      {/* Sixth Majors and Transfer Date */}
      <Box sx={{ display: "flex", gap: "10px" }}>
        <FormControl
          sx={{ minWidth: "50%" }}
          error={major.error ? true : false}
        >
          <InputLabel id="demo-simple-select-label">
            Please select major of applicant
          </InputLabel>
          <Select
            id="demo-simple-select-label"
            label="Please select major of applicant"
            value={major.value}
            defaultOpen={false}
            onChange={(e) =>
              set_major((pre) => {
                return { error: "", value: e.target.value };
              })
            }
          >
            {majors.map(({ major_code, major_name }) => (
              <MenuItem key={major_code} value={major_code}>
                {`${major_name} (${major_code})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <DatePicker
          label="Transfer Date"
          openTo="year"
          value={dayjs(transfer_date.value)}
          onChange={(v) => {
            set_transfer_date((pre) => {
              return { error: "", value: v };
            });
          }}
        />
      </Box>

      {/* Seventh Graduation Date*/}
      <Box sx={{ display: "flex", gap: "10px" }}>
        <DatePicker
          label="Graduation Year"
          openTo="year"
          views={["year", "month"]}
          value={dayjs(graduation_date.value)}
          onChange={(v) => {
            set_graduation_date((pre) => {
              return { error: "", value: v };
            });
          }}
        />
      </Box>

      <Box sx={{ display: "flex", gap: "10px" }}>
        <Button variant="contained" onClick={nextStep}>
          Continue
        </Button>
      </Box>
    </>
  );
};

const SecondStep = ({
  selected_school,
  courses,
  setCourses,
  selectedcourses,
  setSelectedCourses,
  nextStep,
  previousStep,
}) => {
  const [loadingCourses, setLoadingCourses] = useState(false);
  useEffect(() => {
    const getSchoolsCourses = async () => {
      setLoadingCourses(true);
      try {
        const re = await fetch(`${SERVER_URL}/school_courses`, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            school: selected_school,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!re.ok) throw await re.json();

        let data = await re.json();
        setCourses(data);
      } catch (error) {
        if (DEBUG) console.log(error);
        enqueueSnackbar({
          message: error?.message
            ? error?.message
            : "Sorry! There was an error. Please try again",
        });
      }
      setLoadingCourses(false);
    };

    getSchoolsCourses();
  }, [selected_school]);

  const add_new = () => {
    setSelectedCourses((pre) => {
      let data_len = pre.length;
      pre.push({
        value: "",
        error: "",
        key: `new_default_key_for_seleced_courses-${data_len}`,
      });
      return [...pre];
    });
  };

  const delete_new = (idx) => {
    setSelectedCourses((pre) => {
      pre.splice(idx, 1);
      return [...pre];
    });
  };

  //If the courses are loading then just show a loader
  if (loadingCourses) return <Loading />;
  else
    return (
      <>
        {selectedcourses.map(({ value, error, key }, index) => {
          return (
            <Box
              sx={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                justifyContent: "center",
              }}
              key={key}
            >
              <FormControl
                sx={{ m: 1, minWidth: `calc(100% - 30%)` }}
                error={error ? true : false}
              >
                <InputLabel id="demo-simple-select-helper-label">
                  Please select courses taken by the applicant
                </InputLabel>
                <Select
                  label="Please select courses taken by the applicant"
                  value={value}
                  onChange={(e) => {
                    setSelectedCourses((pre) => {
                      pre[index] = {
                        value: e.target.value,
                        error: "",
                        key: e.target.value,
                      };
                      return [...pre];
                    });
                  }}
                >
                  {courses?.map(({ course_id, name }) => {
                    let exists_already = selectedcourses.some(
                      (obj) => obj.value === course_id
                    );
                    return (
                      <MenuItem
                        key={course_id}
                        value={course_id}
                        disabled={exists_already}
                      >
                        {`${name} (${course_id})`}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={() => delete_new(index)}
                disabled={selectedcourses.length <= 1}
              >
                Remove
              </Button>
              <Button
                variant="contained"
                onClick={add_new}
                disabled={
                  index !== selectedcourses.length - 1 ||
                  index >= courses.length - 1
                }
              >
                Add New
              </Button>
            </Box>
          );
        })}
        <Button onClick={previousStep}>Back</Button>
        <Button
          onClick={nextStep}
          disabled={
            !selectedcourses.every((obj) => {
              return obj.value !== "";
            })
          }
        >
          Continue
        </Button>
      </>
    );
};

const ThirdStep = ({
  confirmAndVerify,
  previousStep,
  first_name,
  last_name,
  usm_id,
  age,
  std_prev_school,
  country,
  dob,
  phone_number,
  address,
  major,
  transfer_date,
  graduation_date,
  courses,
  majors,
  schools,
  selectedcourses,
}) => {
  return (
    <>
      {/* Profile Pic */}
      <Typography variant="h3" textAlign={"center"}>
        Review data properly
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Image */}
        <Image
          src={AddStudentIcon}
          alt="User Picture"
          height={150}
          width={150}
        />
      </Box>

      <Box sx={{ display: "flex", gap: "40px", alignItems: "center" }}>
        <Typography variant="h6">
          Name: {first_name.value} {last_name.value}
        </Typography>
        <Typography variant="h6">USM ID: {usm_id.value}</Typography>
      </Box>

      <Box sx={{ display: "flex", gap: "40px", alignItems: "center" }}>
        <Typography variant="h6">Age: {age.value}</Typography>

        <Typography variant="h6">
          Previous School:{" "}
          {
            schools.find(({ code }) => {
              return code === std_prev_school.value;
            })?.name
          }
          {` (${std_prev_school.value})`}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: "40px", alignItems: "center" }}>
        <Typography variant="h6">Country: {country.value}</Typography>

        <Typography variant="h6">
          Date of Birth: {dayjs(dob.value).format("L")}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: "40px", alignItems: "center" }}>
        <Typography variant="h6">
          Phone Number: {phone_number.country_code} {phone_number.value}
        </Typography>

        <Typography variant="h6">Address: {address.value}</Typography>
      </Box>

      <Box sx={{ display: "flex", gap: "40px", alignItems: "center" }}>
        <Typography variant="h6">
          Major:
          {
            majors.find(({ major_code }) => {
              return major_code === major.value;
            })?.major_name
          }
          {` (${major.value})`}
        </Typography>

        <Typography variant="h6">
          Transfer Date: {dayjs(transfer_date.value).format("L")}
        </Typography>
        <Typography variant="h6">
          Graduation Date: {dayjs(graduation_date.value).format("L")}
        </Typography>
      </Box>

      <Typography variant="h4">Courses</Typography>

      {selectedcourses.map(({ value }, idx) => {
        let { course_id, credit_hours, name, usm_eqv } = courses.find(
          ({ course_id }) => {
            return course_id == value;
          }
        );
        return (
          <Box
            sx={{ display: "flex", gap: "40px", alignItems: "center" }}
            key={course_id}
          >
            <Typography>{idx + 1} </Typography>
            <Typography>
              {name} {`(${course_id})`} ---{" "}
            </Typography>
            <Typography>{`${credit_hours} hours`} </Typography>
            <Typography>{`USM Equivalent: ${usm_eqv}`}</Typography>
          </Box>
        );
      })}

      <Button variant="contained" onClick={previousStep}>
        Back
      </Button>
      <Button variant="contained" onClick={confirmAndVerify}>
        Verify and Submit
      </Button>
    </>
  );
};
