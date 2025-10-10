export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard", "/goals", "/tasks", "/workspaces"]
};
