//import { NextRequest, NextResponse } from "next/server";
//import middleware from "next-auth/middleware";
export { default } from "next-auth/middleware";

// export function middleware(req: NextRequest) {
//   return NextResponse.redirect(new URL("/new-page", req.url));
// }

//export default middleware;
export const config = {
  matcher: ["/users/:id*", "/dashboard/:path*"],
};
