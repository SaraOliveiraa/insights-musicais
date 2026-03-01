import { NextResponse } from "next/server";
import { generateCodeChallenge, generateCodeVerifier, generateState } from "@/lib/pkce";

const SPOTIFY_SCOPES = [
  "user-top-read",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "playlist-read-private",
  "playlist-modify-private",
].join(" ");

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}${process.env.SPOTIFY_REDIRECT_PATH}`;

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = generateState();

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: SPOTIFY_SCOPES,
    state,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  const res = NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);

  res.cookies.set("sp_code_verifier", codeVerifier, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60,
  });

  res.cookies.set("sp_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60,
  });

  return res;
}
