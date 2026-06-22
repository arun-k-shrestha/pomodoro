import { NextResponse, type NextRequest } from "next/server";

const WWW_HOST = "www.pomodaily.app";
const CANONICAL_HOST = "pomodaily.app";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase();

  if (host !== WWW_HOST) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.hostname = CANONICAL_HOST;
  url.protocol = "https:";
  url.port = "";

  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: "/:path*",
};
