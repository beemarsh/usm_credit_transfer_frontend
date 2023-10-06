import { useAuthCheck } from "../../hooks/useAuthCheck";
import { DashBoardLayout } from "../../layouts";
import { Loading } from "../../components";
import Schools from "../../components/dashboard/admin/Schools";
import { DEBUG, SERVER_URL } from "../../config/conf";
import { enqueueSnackbar } from "notistack";

export default function SchoolsAdmin({ schools, total_rows }) {
  const { isAuthenticated, user, authenticating } = useAuthCheck();
  if (authenticating) {
    // Loading state while verifying tokens
    return <Loading />;
  } else {
    // Render the protected content
    return (
      <DashBoardLayout user={user}>
        <Schools schools={schools} total_rows={total_rows} />
      </DashBoardLayout>
    );
  }
}

export async function getServerSideProps(ctx) {
  let schools = [];
  let total_rows = 0;
  let data = {};

  try {
    const re = await fetch(`${SERVER_URL}/get_schools`, {
      credentials: "include",
      method: "POST",
      headers: { ...ctx.req.headers, "Content-Type": "application/json" },
      body: JSON.stringify({ q: "" }),
    });

    if (!re.ok) throw await re.json();

    data = await re.json();
    schools = data?.data;
    total_rows = data?.total_rows;
  } catch (error) {
    if (DEBUG) console.log(error);
    enqueueSnackbar({
      message: error?.message
        ? error?.message
        : "Sorry! Couldn't fetch schools properly",
    });
  }

  return {
    props: {
      schools,
      total_rows,
    },
  };
}
