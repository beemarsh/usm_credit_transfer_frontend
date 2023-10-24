import { Login } from "../components";
import { DEBUG } from "../config/conf";
import { verifyUser } from "../config/requests";

export default function LoginPage({ authenticated, user, error }) {
  return <Login />;
}

export async function getServerSideProps(ctx) {
  let authenticated = false;
  let user = null;
  let redirect = null;
  console.log(process.env);
  try {
    const verification = await verifyUser(ctx);
    authenticated = verification?.authenticated;
    user = verification?.user;
    redirect = verification?.redirect;
  } catch (err) {
    if (DEBUG) console.log(err);
  }

  //Redirect to the destined location
  if (redirect) {
    return {
      redirect: {
        destination: redirect,
        permanent: true,
      },
    };
  }

  return {
    props: {
      authenticated: authenticated,
      user: user,
    },
  };
}
