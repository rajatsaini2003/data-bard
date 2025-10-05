import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";
import type { InviteResponse } from "@/types";

interface InviteMemberDialogProps {
  trigger?: React.ReactNode;
  onInvited?: (invite: InviteResponse) => void;
}

export function InviteMemberDialog({ trigger, onInvited }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<'admin' | 'user'>("user");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInvite = async () => {
    if (!email || !email.includes("@")) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await apiService.admin.inviteUser({ email, role, message });
      // If the API returns an invite token, show the link to copy
      const inviteLink = res?.id ? `https://data-bard.vercel.app/signup?token=${res.id}` : undefined;
      toast({ 
        title: "Invitation sent", 
        description: inviteLink ? `Invite link copied to clipboard` : `Invite sent to ${email}`
      });
      if (inviteLink) {
        try { await navigator.clipboard.writeText(inviteLink); } catch {}
      }
      onInvited?.(res);
      setOpen(false);
      setEmail("");
      setMessage("");
      setRole("user");
    } catch (err: any) {
      toast({ title: "Failed to send invite", description: err?.response?.data?.message || "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : (
          <Button variant="hero">Invite Member</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a team member</DialogTitle>
          <DialogDescription>Send an invitation to join your organization.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v: 'admin' | 'user') => setRole(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea id="message" placeholder="Add a welcome note..." value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleInvite} disabled={loading}>
            {loading ? "Sending..." : "Send Invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
