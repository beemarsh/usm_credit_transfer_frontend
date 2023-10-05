import { useAuthCheck } from "../../hooks/useAuthCheck";
import { DashBoardLayout } from "../../layouts";
import { Loading } from "../../components";
import Users from "../../components/dashboard/admin/Users";
import { DEBUG, SERVER_URL } from "../../config/conf";
import { enqueueSnackbar } from "notistack";

export default function AdminPanel({ departments, users, total_pages,total_rows }) {
  const { isAuthenticated, user, authenticating } = useAuthCheck();
  if (authenticating) {
    // Loading state while verifying tokens
    return <Loading />;
  } else {
    // Render the protected content
    return (
      <DashBoardLayout user={user}>
        <Users
          departments={departments}
          users={users}
          total_pages={total_pages}
          total_rows={total_rows}
        />
      </DashBoardLayout>
    );
  }
}

export async function getServerSideProps(ctx) {
  let departments = [];
  let users = [];
  let total_pages = 0;
  let total_rows = 0;

  try {
    const re = await fetch(`${SERVER_URL}/get_departments`, {
      credentials: "include",
      method: "POST",
      headers: { ...ctx.req.headers, "Content-Type": "application/json" },
      body: JSON.stringify({ q: "" }),
    });

    if (!re.ok) throw await re.json();

    departments = await re.json();
  } catch (error) {
    if (DEBUG) console.log(error);
    enqueueSnackbar({
      message: error?.message
        ? error?.message
        : "Sorry! Couldn't fetch departments properly",
    });
  }

  try {
    const re = await fetch(`${SERVER_URL}/get_users`, {
      credentials: "include",
      method: "POST",
      headers: { ...ctx.req.headers, "Content-Type": "application/json" },
      body: JSON.stringify({ q: "" }),
    });

    if (!re.ok) throw await re.json();

    let result = await re.json();
    users = result?.data;
    total_pages = result?.total;
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
      departments,
      users,
      total_pages,
      total_rows,
    },
  };
}
