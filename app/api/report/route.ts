import { NextRequest, NextResponse } from "next/server";
import { parseTimeRange } from "@/lib/spotify-insights";
import { getDashboardData, SpotifyAuthError, SpotifyRequestError } from "@/lib/spotify-server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("sp_access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const range = parseTimeRange(req.nextUrl.searchParams.get("range"));

  try {
    const data = await getDashboardData(token, range);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof SpotifyAuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error instanceof SpotifyRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
