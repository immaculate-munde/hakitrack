export const dynamic = "force-dynamic";

import { FamilyHome } from "@/components/family/FamilyHome";
import { getFamilyMember, getFamilySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function FamilyPage() {
  const session = await getFamilySession();

  if (!session) {
    redirect("/family/login");
  }

  const member = await getFamilyMember(session.memberId);

  if (!member) {
    redirect("/family/login");
  }

  return <FamilyHome memberName={member.full_name} />;
}
