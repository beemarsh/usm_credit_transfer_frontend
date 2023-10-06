import { useAuthCheck } from "../../hooks/useAuthCheck";
import { DashBoardLayout } from "../../layouts";
import { Loading } from "../../components";
import { DEBUG, SERVER_URL } from "../../config/conf";
import { enqueueSnackbar } from "notistack";
import USMCourses from "../../components/dashboard/admin/UsmCourses";

export default function UsersAdmin({ usm_courses, total_rows, departments }) {
  const { isAuthenticated, user, authenticating } = useAuthCheck();
  if (authenticating) {
    // Loading state while verifying tokens
    return <Loading />;
  } else {
    // Render the protected content
    return (
      <DashBoardLayout user={user}>
        <USMCourses
          usm_courses={usm_courses}
          total_rows={total_rows}
          departments={departments}
        />
      </DashBoardLayout>
    );
  }
}

export async function getServerSideProps(ctx) {
  let usm_courses = [];
  let total_rows = 0;
  let departments = [];

  try {
    const re = await fetch(`${SERVER_URL}/get_usm_courses`, {
      credentials: "include",
      method: "POST",
      headers: { ...ctx.req.headers, "Content-Type": "application/json" },
      body: JSON.stringify({ q: "" }),
    });

    if (!re.ok) throw await re.json();

    let result = await re.json();
    usm_courses = result?.data;
    total_rows = result?.total_rows;
  } catch (error) {
    if (DEBUG) console.log(error);
    enqueueSnackbar({
      message: error?.message
        ? error?.message
        : "Sorry! Couldn't fetch USM Courses properly",
    });
  }

  try {
    const re = await fetch(`${SERVER_URL}/get_departments`, {
      credentials: "include",
      method: "POST",
      headers: { ...ctx.req.headers, "Content-Type": "application/json" },
      body: JSON.stringify({ q: "", all: true }),
    });

    if (!re.ok) throw await re.json();

    let result = await re.json();
    departments = result?.data;
  } catch (error) {
    if (DEBUG) console.log(error);
    enqueueSnackbar({
      message: error?.message
        ? error?.message
        : "Sorry! Couldn't fetch departments properly",
    });
  }

  return {
    props: {
      usm_courses,
      total_rows,
      departments,
    },
  };
}
