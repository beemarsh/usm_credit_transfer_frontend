import { useAuthCheck } from "../hooks/useAuthCheck";
import { DashBoardLayout } from "../layouts";
import { DashBoardHome } from "../components/dashboard";
import { Loading } from "../components";

export default function Dashboard({}) {
  const { isAuthenticated, user, authenticating } = useAuthCheck();

  if (authenticating) {
    // Loading state while verifying tokens
    return <Loading />;
  } else {
    // Render the protected content
    return (
      <DashBoardLayout user={user}>
        <DashBoardHome />
      </DashBoardLayout>
    );
  }
}
