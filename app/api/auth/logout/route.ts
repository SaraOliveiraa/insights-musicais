import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/`);
  res.cookies.delete("sp_access_token");
  res.cookies.delete("sp_refresh_token");
  return res;
}
