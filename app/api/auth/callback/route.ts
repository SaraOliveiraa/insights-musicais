import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  if (!code || !state) {
    return NextResponse.json({ error: "Missing code/state" }, { status: 400 });
  }

  const cookieState = req.cookies.get("sp_state")?.value;
  const codeVerifier = req.cookies.get("sp_code_verifier")?.value;

  if (!cookieState || cookieState !== state || !codeVerifier) {
    return NextResponse.json({ error: "Invalid state/verifier" }, { status: 400 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}${process.env.SPOTIFY_REDIRECT_PATH}`;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  });

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    return NextResponse.json({ error: "token_exchange_failed", details: text }, { status: 500 });
  }

  const token = (await tokenRes.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    scope: string;
    token_type: string;
  };

  const res = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);

  // cookie do access token (1h)
  res.cookies.set("sp_access_token", token.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: token.expires_in,
  });

  // refresh token (bem mais duradouro; aqui deixo 30 dias)
  if (token.refresh_token) {
    res.cookies.set("sp_refresh_token", token.refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  // limpa cookies temporários do PKCE
  res.cookies.delete("sp_state");
  res.cookies.delete("sp_code_verifier");

  return res;
}
