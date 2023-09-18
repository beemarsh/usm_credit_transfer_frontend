import { useAuthCheck } from "../hooks/useAuthCheck";
import { DashBoardLayout } from "../layouts";
import { DashboardAddStudent } from "../components/dashboard";
import { Loading } from "../components";
import { DEBUG, SERVER_URL } from "../config/conf";
import { enqueueSnackbar } from "notistack";

export default function AddStudent({ initials }) {
  const { isAuthenticated, user, authenticating } = useAuthCheck();
  if (authenticating) {
    // Loading state while verifying tokens
    return <Loading />;
  } else {
    // Render the protected content
    return (
      <DashBoardLayout user={user}>
        <DashboardAddStudent initials={initials} />
      </DashBoardLayout>
    );
  }
}

export async function getServerSideProps(ctx) {
  let initials = null;

  try {
    const re = await fetch(`${SERVER_URL}/add_initials`, {
      credentials: "include",
      method: "POST",
      headers: ctx.req.headers,
    });

    if (!re.ok) throw await re.json();

    initials = await re.json();
  } catch (error) {
    if (DEBUG) console.log(error);
    enqueueSnackbar({
      message: error?.message
        ? error?.message
        : "Sorry! Couldn't fetch data properly",
    });
  }
  return {
    props: {
      initials,
    },
  };
}
