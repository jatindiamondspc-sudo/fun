import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

// Password-protects /admin with HTTP Basic Auth (ADMIN_USER / ADMIN_PASSWORD).
// Without ADMIN_PASSWORD the admin pages don't exist.

export const config = { matcher: ["/admin", "/admin/:path*"], runtime: "nodejs" };

function same(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function middleware(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return new NextResponse("Not found", { status: 404 });
  const user = process.env.ADMIN_USER || "admin";

  const [scheme, encoded] = (request.headers.get("authorization") ?? "").split(" ");
  if (scheme === "Basic" && encoded) {
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const sep = decoded.indexOf(":");
    const userOk = same(decoded.slice(0, sep), user);
    const passwordOk = same(decoded.slice(sep + 1), password);
    if (sep > 0 && userOk && passwordOk) return NextResponse.next();
  }

  return new NextResponse("Login required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="HerCall admin", charset="UTF-8"' },
  });
}
