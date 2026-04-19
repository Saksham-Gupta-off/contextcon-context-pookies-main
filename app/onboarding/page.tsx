import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

type SearchParams = Record<string, string | string[] | undefined>;

function pickString(value: string | string[] | undefined, fallback = "") {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const demo = pickString(params.demo, "0") === "1";
  return <OnboardingFlow demo={demo} />;
}
