import { useAuthCheck } from "../../hooks/useAuthCheck";
import { DashBoardLayout } from "../../layouts";
import { Loading } from "../../components";
import UsmDepartments from "../../components/dashboard/admin/UsmDepartments";
import { DEBUG, SERVER_URL } from "../../config/conf";
import { enqueueSnackbar } from "notistack";

export default function USMDepartmentsAdmin({ departments, total_rows }) {
  const { isAuthenticated, user, authenticating } = useAuthCheck();
  if (authenticating) {
    // Loading state while verifying tokens
    return <Loading />;
  } else {
    // Render the protected content
    return (
      <DashBoardLayout user={user}>
        <UsmDepartments departments={departments} total_rows={total_rows} />
      </DashBoardLayout>
    );
  }
}

export async function getServerSideProps(ctx) {
  let departments = [];
  let total_rows = 0;

  try {
    const re = await fetch(`${SERVER_URL}/get_departments`, {
      credentials: "include",
      method: "POST",
      headers: { ...ctx.req.headers },
      body: JSON.stringify({ q: "" }),
    });

    if (!re.ok) throw await re.json();

    let results = await re.json();
    departments = results?.data;
    total_rows = results?.total_rows;
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
      departments,
      total_rows,
    },
  };
}
