import Link from "next/link";
import { LogOut, ExternalLink } from "lucide-react";
import { signOut } from "@/server/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { StaffUser } from "@/lib/auth/guards";

export function AdminHeader({ user }: { user: StaffUser }) {
  return (
    <header className="h-16 border-b flex items-center justify-between px-4 sm:px-6">
      <p className="font-semibold capitalize md:hidden">Admin</p>
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <Button variant="outline" size="sm" className="gap-2" asChild>
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">View Store</span>
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 text-sm">
              <span className="font-medium">{user.full_name || user.email}</span>
              <span className="text-muted-foreground capitalize">({user.role})</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form action={signOut} className="w-full">
                <button type="submit" className="flex w-full items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
