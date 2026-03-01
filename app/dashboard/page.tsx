import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";
import { parseTimeRange } from "@/lib/spotify-insights";

type DashboardPageProps = {
  searchParams?: Promise<{
    range?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const selectedRange = parseTimeRange(params?.range);
  const token = (await cookies()).get("sp_access_token")?.value;

  if (!token) {
    redirect("/");
  }

  return <DashboardClient initialRange={selectedRange} />;
}
