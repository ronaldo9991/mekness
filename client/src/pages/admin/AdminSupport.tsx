import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/DataTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Loader2, Send } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { SupportTicket, User } from "@shared/schema";

export default function AdminSupport() {
  const { toast } = useToast();
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);

  const { data: tickets = [], isLoading } = useQuery<SupportTicket[]>({
    queryKey: ["/api/admin/support-tickets"],
    refetchInterval: 30000, // Real-time updates every 30 seconds
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const replyToTicketMutation = useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: string; message: string }) => {
      return await apiRequest("POST", `/api/admin/support-tickets/${ticketId}/reply`, { message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/support-tickets"] });
      setReplyDialogOpen(false);
      setSelectedTicket(null);
      setReplyMessage("");
      toast({
        title: "Reply Sent",
        description: "Your reply has been sent to the client",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    },
  });

  const updateTicketStatusMutation = useMutation({
    mutationFn: async ({ ticketId, status }: { ticketId: string; status: string }) => {
      return await apiRequest("PATCH", `/api/admin/support-tickets/${ticketId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/support-tickets"] });
      toast({
        title: "Status Updated",
        description: "Ticket status has been updated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive",
      });
    },
  });

  const handleReply = () => {
    if (!selectedTicket || !replyMessage.trim()) {
      toast({
        title: "Missing Message",
        description: "Please enter a reply message",
        variant: "destructive",
      });
      return;
    }
    replyToTicketMutation.mutate({
      ticketId: selectedTicket.id,
      message: replyMessage,
    });
  };

  const getUserName = (userId: string | null) => {
    if (!userId) return "Guest";
    const user = users.find((u) => u.id === userId);
    return user?.fullName || user?.username || "Unknown";
  };

  const columns = [
    {
      key: "id",
      label: "Ticket ID",
      render: (value: string) => (
        <span className="font-mono text-xs">{value.slice(0, 8)}</span>
      ),
    },
    {
      key: "userId",
      label: "Client",
      render: (value: string | null) => (
        <span className="font-semibold">{getUserName(value)}</span>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      render: (value: string) => (
        <span className="font-medium">{value}</span>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (value: string | null) => (
        <Badge variant="outline">{value || "General"}</Badge>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      render: (value: string | null) => {
        const colors: Record<string, string> = {
          Low: "bg-gray-500",
          Medium: "bg-blue-500",
          High: "bg-orange-500",
          Urgent: "bg-red-500",
        };
        return (
          <Badge className={`${colors[value || "Medium"]} text-white`}>
            {value || "Medium"}
          </Badge>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive"> = {
          Open: "destructive",
          "In Progress": "secondary",
          Resolved: "default",
          Closed: "secondary",
        };
        return <Badge variant={variants[value] || "secondary"}>{value}</Badge>;
      },
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value: Date) => (
        <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: SupportTicket) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedTicket(row);
              setReplyDialogOpen(true);
            }}
          >
            <MessageSquare className="w-3 h-3 mr-1" />
            Reply
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const openTickets = tickets.filter((t) => t.status === "Open" || t.status === "In Progress");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-1">Support</h1>
          <p className="text-muted-foreground">Manage support tickets and client inquiries</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-4 border-card-border">
          <p className="text-sm text-muted-foreground mb-1">Open Tickets</p>
          <p className="text-2xl font-bold">{openTickets.length}</p>
        </Card>
        <Card className="p-4 border-card-border">
          <p className="text-sm text-muted-foreground mb-1">Total Tickets</p>
          <p className="text-2xl font-bold">{tickets.length}</p>
        </Card>
        <Card className="p-4 border-card-border">
          <p className="text-sm text-muted-foreground mb-1">Resolved</p>
          <p className="text-2xl font-bold text-green-600">
            {tickets.filter((t) => t.status === "Resolved").length}
          </p>
        </Card>
        <Card className="p-4 border-card-border">
          <p className="text-sm text-muted-foreground mb-1">Urgent</p>
          <p className="text-2xl font-bold text-red-600">
            {tickets.filter((t) => t.priority === "Urgent").length}
          </p>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card className="border-card-border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">All Support Tickets</h2>
        </div>
        {tickets.length > 0 ? (
          <DataTable columns={columns} data={tickets} />
        ) : (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No support tickets found</p>
          </div>
        )}
      </Card>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to Ticket</DialogTitle>
            <DialogDescription>
              Send a reply to the client's support ticket
            </DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div>
                <Label>Client</Label>
                <p className="font-semibold">{getUserName(selectedTicket.userId)}</p>
              </div>
              <div>
                <Label>Subject</Label>
                <p className="font-semibold">{selectedTicket.subject}</p>
              </div>
              <div>
                <Label>Original Message</Label>
                <Card className="p-4 bg-muted">
                  <p className="text-sm">{selectedTicket.message}</p>
                </Card>
              </div>
              <div>
                <Label>Your Reply</Label>
                <Textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={6}
                />
              </div>
              <div>
                <Label>Update Status</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateTicketStatusMutation.mutate({ ticketId: selectedTicket.id, status: "In Progress" })}
                  >
                    In Progress
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateTicketStatusMutation.mutate({ ticketId: selectedTicket.id, status: "Resolved" })}
                  >
                    Resolved
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateTicketStatusMutation.mutate({ ticketId: selectedTicket.id, status: "Closed" })}
                  >
                    Closed
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setReplyDialogOpen(false);
                    setSelectedTicket(null);
                    setReplyMessage("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReply}
                  disabled={replyToTicketMutation.isPending || !replyMessage.trim()}
                  className="flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {replyToTicketMutation.isPending ? "Sending..." : "Send Reply"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

