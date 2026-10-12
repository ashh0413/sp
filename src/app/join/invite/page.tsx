import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function InvitePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <Card className="w-full max-w-md p-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight mb-4">Invite Friends</h1>
        <p className="text-[var(--muted-foreground)] mb-6">
          Share SplitSpot with your friends and start splitting expenses together.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-[var(--secondary)] rounded-lg">
            <p className="text-sm text-[var(--muted-foreground)] mb-2">
              Share your referral code
            </p>
            <p className="text-2xl font-mono font-semibold">
              SPLITSPOT
            </p>
          </div>

          <p className="text-sm text-[var(--muted-foreground)]">
            Create a group and invite members to start tracking shared expenses.
          </p>

          <Link href="/app/groups" className="block">
            <Button className="w-full">
              Create a Group
            </Button>
          </Link>

          <Link href="/app/dashboard" className="block">
            <Button variant="secondary" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
