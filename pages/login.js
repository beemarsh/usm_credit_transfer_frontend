import { useRouter } from "next/router";
import { Login } from "../components";
import { Loading } from "../components";
import { useAuthCheck } from "../hooks/useAuthCheck";

export default function LoginPage() {
  const { authenticating, isAuthenticated } = useAuthCheck();
  const router = useRouter();

  if (authenticating) {
    // Loading state while verifying tokens
    return <Loading />;
  } else if (!authenticating && isAuthenticated) {
    //If the user is already logged in, route to dashboard
    router.push("/dashboard");
  }
  {
    // Render the protected content
    return <Login />;
  }
}
