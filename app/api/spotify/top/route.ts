import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("sp_access_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "artists"; // artists | tracks
  const range = url.searchParams.get("range") || "short_term"; // short_term | medium_term | long_term
  const limit = url.searchParams.get("limit") || "10";

  if (!["artists", "tracks"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const endpoint = `https://api.spotify.com/v1/me/top/${type}?time_range=${range}&limit=${limit}`;

  const r = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await r.json();
  return NextResponse.json(data, { status: r.status });
}
