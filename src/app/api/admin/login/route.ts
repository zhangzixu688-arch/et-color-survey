import { NextResponse } from "next/server";
import { adminCookieOptions, createAdminSession, SESSION_COOKIE, verifyAdminPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { password?: string };
    if (!body.password || !verifyAdminPassword(body.password)) {
      return NextResponse.json({ error: "管理员口令不正确" }, { status: 401 });
    }
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, await createAdminSession(), adminCookieOptions);
    return response;
  } catch (error) {
    console.error("Admin login failed", error);
    return NextResponse.json({ error: "登录服务暂不可用" }, { status: 500 });
  }
}
