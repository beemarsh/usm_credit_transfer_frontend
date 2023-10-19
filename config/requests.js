import { DEBUG, SERVER_URL } from "./conf";

export const verifyUser = async (ctx) => {
  //Set Initial Variables
  let isAuthenticated = false;
  let user = null;
  let redirect = null;
  try {
    const response = await fetch(`${SERVER_URL}/verify`, {
      credentials: "include",
      method: "POST",
      headers: ctx.req.headers,
    });

    if (response.ok) {
      //Response is OK -- User Verified
      const re = await response.json();
      isAuthenticated = true;
      user = re?.user;

      //IF the user is currently at homepage or login page, redirect to dashboard
      if (ctx.resolvedUrl === "/" || ctx.resolvedUrl === "/login") {
        redirect = "/dashboard";
      }
    } else {
      //Response is not OK -- User Unverified
      isAuthenticated = false;
      user = null;

      //Do not redirect if the user is in homepage or login page if Unauthenticated as it leads to infinite redirect loops
      if (ctx.resolvedUrl === "/" || ctx.resolvedUrl === "/login") {
        redirect = null;
      } else {
        redirect = "/login";
      }
    }
  } catch (err) {
    if (DEBUG) console.err("Authentication error:", err);
    throw err;
  }

  return {
    authenticated: isAuthenticated,
    user: user,
    redirect: redirect,
  };
};
