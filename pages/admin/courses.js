import { useAuthCheck } from "../../hooks/useAuthCheck";
import { DashBoardLayout } from "../../layouts";
import { Loading } from "../../components";
import Courses from "../../components/dashboard/admin/Courses";
import { DEBUG, SERVER_URL } from "../../config/conf";
import { enqueueSnackbar } from "notistack";

export default function UsersAdmin({ courses, schools, total_rows }) {
  const { isAuthenticated, user, authenticating } = useAuthCheck();
  if (authenticating) {
    // Loading state while verifying tokens
    return <Loading />;
  } else {
    // Render the protected content
    return (
      <DashBoardLayout user={user}>
        <Courses courses={courses} schools={schools} total_rows={total_rows} />
      </DashBoardLayout>
    );
  }
}

export async function getServerSideProps(ctx) {
  let schools = [];
  let courses = [];
  let total_rows = 0;

  try {
    const re = await fetch(`${SERVER_URL}/add_initials`, {
      credentials: "include",
      method: "POST",
      headers: { ...ctx.req.headers },
    });

    if (!re.ok) throw await re.json();

    let data = await re.json();
    schools = data?.schools;
  } catch (error) {
    if (DEBUG) console.log(error);
    enqueueSnackbar({
      message: error?.message
        ? error?.message
        : "Sorry! Couldn't fetch schools properly",
    });
  }

  try {
    const re = await fetch(`${SERVER_URL}/get_other_courses`, {
      credentials: "include",
      method: "POST",
      headers: { ...ctx.req.headers, "Content-Type": "application/json" },
      body: JSON.stringify({ q: "" }),
    });

    if (!re.ok) throw await re.json();

    let result = await re.json();
    courses = result?.data;
    total_rows = result?.total_rows;
  } catch (error) {
    if (DEBUG) console.log(error);
    enqueueSnackbar({
      message: error?.message
        ? error?.message
        : "Sorry! Couldn't fetch users properly",
    });
  }

  return {
    props: {
      courses,
      total_rows,
      schools,
    },
  };
}
