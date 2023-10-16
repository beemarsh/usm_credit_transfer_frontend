import { useAuthCheck } from "../hooks/useAuthCheck";
import { DashBoardLayout } from "../layouts";
import { Loading } from "../components";
import { DEBUG, SERVER_URL } from "../config/conf";
import { enqueueSnackbar } from "notistack";
import { DashboardActivities } from "../components/dashboard";

export default function Activities({ students, total_rows }) {
  const { isAuthenticated, user, authenticating } = useAuthCheck();

  if (authenticating) {
    // Loading state while verifying tokens
    return <Loading />;
  } else {
    // Render the protected content
    return (
      <DashBoardLayout user={user}>
        <DashboardActivities students={students} total_rows={total_rows} />
      </DashBoardLayout>
    );
  }
}

export async function getServerSideProps(ctx) {
  let students = [];
  let total_rows = 0;

  try {
    const re = await fetch(`${SERVER_URL}/get_students`, {
      credentials: "include",
      method: "POST",
      headers: { ...ctx.req.headers, "Content-Type": "application/json" },
      body: JSON.stringify({ q: "" }),
    });

    if (!re.ok) throw await re.json();

    let results = await re.json();
    students = results?.data;
    total_rows = results?.total_rows;
  } catch (error) {
    if (DEBUG) console.log(error);
    enqueueSnackbar({
      message: error?.message
        ? error?.message
        : "Sorry! Couldn't fetch students properly",
    });
  }

  return {
    props: {
      students,
      total_rows,
    },
  };
}
