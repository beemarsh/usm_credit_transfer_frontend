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
  isValidEmail
} from "../../utils/validators";
import { enqueueSnackbar } from "notistack";
import { DEBUG, SERVER_URL } from "../../config/conf";
import Loading from "../Loading";
import { useRouter } from "next/router";

const steps = ["Primary Information", "Transfer Credits and Courses", "Review"];

export default function DashboardAddStudent({ initials }) {
  const { majors, schools } = initials;
  const [activeStep, setActiveStep] = useState(0);

  const [pp, setPP] = useState({ value: null, error: "" });
  const [first_name, set_first_name] = useState({
    value: "",
    error: "",
  });
  const [last_name, set_last_name] = useState({ value: "", error: "" });
  const [usm_id, set_usm_id] = useState({ value: "", error: "" });

  //
  const [std_prev_school, set_std_prev_school] = useState([
    {
      value: "",
      error: "",
      key: "default_key_for_prev_schools",
    },
  ]);

  //
  const [country, set_country] = useState({ value: "US", error: "" });

  //
  const [email, set_email] = useState({
    value: "",
    error: "",
  });
  const [major, set_major] = useState({ value: "", error: "" });
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

  const [selectedcourses, setSelectedCourses] = useState([]);

  const [fetching, setFetching] = useState(false);
  const [verified, setVerifiedStatus] = useState(false);
  const first_step_check = () => {
    let f_name_check = isNameValid(first_name.value);
    let l_name_check = isNameValid(last_name.value);
    let usm_id_check = isUsmIDValid(usm_id.value);
    let prev_school_check = std_prev_school.every((item) => item.value !== "");
    let country_check =
      country.value !== "" &&
      country.value !== null &&
      country.value !== undefined;
    let email_check = isValidEmail(email.value);
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
    if (!prev_school_check) {
      set_std_prev_school((pre) => {
        pre.forEach((item) => {
          if (item.value === "") {
            item.error = "Please select a valid school.";
          }
        });
        return [...pre];
      });
    }

    if (!country_check) {
      set_country((pre) => ({ ...pre, error: "Please select a country" }));
    }
    if (!email_check) {
      set_email((pre) => ({
        ...pre,
        error: "Please enter a valid student email",
      }));
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
      !prev_school_check ||
      !country_check ||
      !email_check ||
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
    let is_correct = selectedcourses.every(({ course_list }) => {
      return course_list?.every(({ value }) => value !== "");
    });

    if (!is_correct) {
      let new_selectedcourses_with_error = selectedcourses?.map((arr) => {
        return {
          ...arr,
          course_list: arr.course_list?.map((item) => {
            if (item.value === "") item["error"] = "Please select a course";
            return item;
          }),
        };
      });

      setSelectedCourses(new_selectedcourses_with_error);
    } else {
      setActiveStep(2);
    }
  };
  const back_to_first_step = () => {
    setActiveStep(0);
  };

  const back_to_second_step = () => {
    setActiveStep(1);
  };

  const confirmAndVerify = async () => {
    setFetching(true);
    try {
      let student_data = {
        first_name: first_name.value,
        last_name: last_name.value,
        id: usm_id.value,
        country: country.value,
        email: email.value,
        major: major.value,
        transfer_date: transfer_date.value.toISOString(),
        graduation_date: graduation_date.value.toISOString(),
        courses_taken: selectedcourses,
      };
      const formdata = new FormData();
      formdata.append("pp", pp.value);
      formdata.append("student_data", JSON.stringify(student_data));

      const re = await fetch(`${SERVER_URL}/add_student`, {
        method: "POST",
        credentials: "include",
        body: formdata,
      });

      if (!re.ok) throw await re.json();

      setVerifiedStatus(true);
    } catch (error) {
      if (DEBUG) console.log(error);
      enqueueSnackbar({
        message: error?.message
          ? error?.message
          : "Sorry! There was an error. Please try again",
      });
    }
    setFetching(false);
  };

  if (verified)
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
        <VerifiedScreen />
      </Box>
    );
  else
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
          {steps?.map((label, index) => {
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
            pp={pp}
            setPP={setPP}
            first_name={first_name}
            last_name={last_name}
            usm_id={usm_id}
            std_prev_school={std_prev_school}
            country={country}
            email={email}
            major={major}
            transfer_date={transfer_date}
            graduation_date={graduation_date}
            set_first_name={set_first_name}
            set_last_name={set_last_name}
            set_usm_id={set_usm_id}
            set_std_prev_school={set_std_prev_school}
            set_country={set_country}
            set_email={set_email}
            set_major={set_major}
            set_transfer_date={set_transfer_date}
            set_graduation_date={set_graduation_date}
            nextStep={first_step_check}
          />
        ) : activeStep == 1 ? (
          <SecondStep
            selected_school={std_prev_school}
            retrievedCourses={courses}
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
            std_prev_school={std_prev_school}
            country={country}
            email={email}
            major={major}
            transfer_date={transfer_date}
            graduation_date={graduation_date}
            courses={courses}
            majors={majors}
            schools={schools}
            selectedcourses={selectedcourses}
            pp={pp}
          />
        )}
      </Box>
    );
}

const FirstStep = ({
  majors,
  schools,
  pp,
  setPP,
  first_name,
  last_name,
  usm_id,
  std_prev_school,
  country,
  email,
  major,
  transfer_date,
  graduation_date,
  set_first_name,
  set_last_name,
  set_usm_id,
  set_std_prev_school,
  set_country,
  set_email,
  set_major,
  set_transfer_date,
  set_graduation_date,
  nextStep,
}) => {
  const add_school = () => {
    set_std_prev_school((pre) => {
      let data_len = pre.length;
      pre.push({
        value: "",
        error: "",
        key: `new_default_key_for_previous_schools-${data_len}`,
      });
      return [...pre];
    });
  };

  const delete_school = (idx) => {
    set_std_prev_school((pre) => {
      pre.splice(idx, 1);
      return [...pre];
    });
  };

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
          src={pp?.value ? URL.createObjectURL(pp?.value) : AddStudentIcon}
          alt="User Picture"
          height={150}
          width={150}
        />
        {/* Add Image Button */}
        <>
          <input
            accept="image/*"
            type="file"
            id="image-button-file"
            style={{ display: "none" }}
            onChange={(e) => {
              setPP((pre) => ({ value: e.target.files[0], error: "" }));
            }}
          />
          <label htmlFor="image-button-file">
            <Button
              variant="contained"
              component="span"
              size="large"
              color="primary"
            >
              Upload
            </Button>
          </label>
        </>
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

      {/* and Previous School Row */}
      <Box>
        {std_prev_school?.map(({ value, error, key }, index) => {
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
                  Please select previous institute of applicant
                </InputLabel>
                <Select
                  label="Please select previous institute of applicant"
                  value={value}
                  onChange={(e) => {
                    set_std_prev_school((pre) => {
                      pre[index] = {
                        value: e.target.value,
                        error: "",
                        key: e.target.value,
                      };
                      return [...pre];
                    });
                  }}
                >
                  {schools?.map(({ code, name }) => {
                    let exists_already = std_prev_school?.some(
                      (obj) => obj.value === code
                    );
                    return (
                      <MenuItem
                        key={code}
                        value={code}
                        disabled={exists_already}
                      >
                        {`${name} (${code})`}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={() => delete_school(index)}
                disabled={std_prev_school.length <= 1}
              >
                Remove
              </Button>
              <Button
                variant="contained"
                onClick={add_school}
                disabled={
                  index !== std_prev_school.length - 1 ||
                  index >= schools?.length - 1
                }
              >
                Add New
              </Button>
            </Box>
          );
        })}
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
            {countries?.map(({ code, name, isDefault }) => (
              <MenuItem key={code} value={code} defaultChecked={isDefault}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Fifth address and phone number */}
      <Box sx={{ display: "flex", gap: "10px" }}>
        <TextField
          label="Student Email"
          sx={{ m: 1 }}
          value={email.value}
          onChange={(e) =>
            set_email((pre) => {
              return {
                error: "",
                value: e.target.value,
              };
            })
          }
          error={email.error ? true : false}
          helperText={email.error}
        />
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
            {majors?.map(({ major_code, major_name }) => (
              <MenuItem key={major_code} value={major_code}>
                {`${major_name} (${major_code})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Sixth Graduation and Transfer Date */}
      <Box sx={{ display: "flex", gap: "10px" }}>
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
  retrievedCourses,
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
            schools: selected_school?.map((item) => ({
              school_code: item.value,
            })),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!re.ok) throw await re.json();

        let data = await re.json();
        setCourses(data);
        //Now setting the state so that we have proper format
        let new_selected_course_format = [];
        data?.map(({ school_name, school_code }) => {
          let school_already_exists = selectedcourses.find(
            (item) => item?.school_code === school_code
          );
          new_selected_course_format.push({
            school_name: school_name,
            school_code: school_code,
            course_list: school_already_exists
              ? [
                  ...selectedcourses[
                    selectedcourses?.indexOf(school_already_exists)
                  ]?.course_list,
                ]
              : [
                  {
                    value: "",
                    error: "",
                    key: `default_${school_code}_course_key`,
                  },
                ],
          });
        });

        setSelectedCourses(new_selected_course_format);
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

  const add_new = (idx) => {
    setSelectedCourses((pre) => {
      let data_len = pre.length;
      pre[idx]?.course_list?.push({
        value: "",
        error: "",
        key: `new_default_key_for_seleced_courses-${data_len}`,
      });
      return [...pre];
    });
  };

  const delete_new = (idx, course_idx) => {
    setSelectedCourses((pre) => {
      pre[idx]?.course_list?.splice(course_idx, 1);
      return [...pre];
    });
  };

  //If the courses are loading then just show a loader
  if (loadingCourses) return <Loading />;
  else
    return (
      <>
        {selectedcourses?.map(
          ({ school_code, school_name, course_list }, index) => {
            return (
              <Box key={`${school_code}-${school_name}`}>
                <Typography>{`${school_name} (${school_code})`}</Typography>
                <hr />

                {course_list?.map(({ value, error, key }, course_idx) => {
                  return (
                    <Box
                      key={key}
                      sx={{
                        display: "flex",
                        gap: "20px",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
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
                              pre[index].course_list[course_idx] = {
                                value: e.target.value,
                                error: "",
                                key: `${school_code}-${e.target.value}-${course_idx}-${index}`,
                              };
                              return [...pre];
                            });
                          }}
                        >
                          {retrievedCourses
                            .find((item) => item.school_code === school_code)
                            ?.courses?.map(
                              ({ name, usm_eqv, course_id, credit_hours }) => {
                                let exists_already = selectedcourses[
                                  index
                                ].course_list.some(
                                  (obj) => obj.value === course_id
                                );
                                return (
                                  <MenuItem
                                    key={course_id}
                                    value={course_id}
                                    disabled={exists_already}
                                  >
                                    {`${name} (${course_id})  (${credit_hours} hrs)  || USM:  ${usm_eqv}`}
                                  </MenuItem>
                                );
                              }
                            )}
                        </Select>
                      </FormControl>

                      <Button
                        variant="contained"
                        onClick={() => delete_new(index, course_idx)}
                        disabled={
                          selectedcourses[index]?.course_list?.length <= 1
                        }
                      >
                        Remove
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => add_new(index)}
                        disabled={
                          course_idx !==
                            selectedcourses[index]?.course_list?.length - 1 ||
                          course_idx >=
                            retrievedCourses[index]?.courses?.length - 1
                        }
                      >
                        Add New
                      </Button>
                    </Box>
                  );
                })}
              </Box>
            );
          }
        )}

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
  std_prev_school,
  country,
  email,
  major,
  transfer_date,
  graduation_date,
  courses,
  majors,
  schools,
  selectedcourses,
  pp,
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
          src={pp?.value ? URL.createObjectURL(pp?.value) : AddStudentIcon}
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
        <Typography variant="h6">Country: {country.value}</Typography>
      </Box>

      <Box sx={{ display: "flex", gap: "40px", alignItems: "center" }}>
        <Typography variant="h6">Phone Number: {email.value}</Typography>
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

      {selectedcourses?.map(({ school_code, school_name, course_list }, idx) => {
        let target_school_courses = courses?.find(
          (obj) => obj.school_code === school_code
        )?.courses;
        return (
          <Box key={school_code}>
            <Typography>{`${
              idx + 1
            }. ${school_name} (${school_code})`}</Typography>
            {course_list?.map(({ value, key }, course_idx) => {
              const { name, usm_eqv, course_id, credit_hours } =
                target_school_courses?.find(
                  ({ course_id }) => value === course_id
                );
              return (
                <Box
                  sx={{ display: "flex", gap: "40px", alignItems: "center" }}
                  key={key}
                >
                  <Typography>{`${course_idx + 1}. `}</Typography>
                  <Typography>{name}</Typography>
                  <Typography>{course_id}</Typography>
                  <Typography>{`${credit_hours} hours`} </Typography>
                  <Typography>{`USM Equivalent: ${usm_eqv}`}</Typography>
                </Box>
              );
            })}
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

const VerifiedScreen = () => {
  const router = useRouter();
  return (
    <>
      <Typography>Successfully added student</Typography>
      <Button onClick={() => router.reload()}>Add New Student</Button>
    </>
  );
};
