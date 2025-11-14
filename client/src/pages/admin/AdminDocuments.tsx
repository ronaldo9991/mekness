import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FileText, CheckCircle, XCircle, Eye, Loader2 } from "lucide-react";
import type { Document, User } from "@shared/schema";

interface AdminDocumentsProps {
  admin: { role: string };
}

export default function AdminDocuments({ admin }: AdminDocumentsProps) {
  const { toast } = useToast();
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: documents = [], isLoading: loadingDocs } = useQuery<Document[]>({
    queryKey: ["/api/admin/documents"],
    refetchInterval: 15000,
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const verifyMutation = useMutation({
    mutationFn: async ({ id, status, rejectionReason }: { id: string; status: string; rejectionReason?: string }) => {
      return await apiRequest("PATCH", `/api/admin/documents/${id}/verify`, {
        status,
        rejectionReason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/documents"] });
      setDialogOpen(false);
      setSelectedDoc(null);
      setRejectionReason("");
      toast({
        title: "Success",
        description: "Document status updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update document",
        variant: "destructive",
      });
    },
  });

  const handleVerify = (doc: Document) => {
    verifyMutation.mutate({ id: doc.id, status: "Verified" });
  };

  const handleReject = () => {
    if (!selectedDoc) return;
    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a rejection reason",
        variant: "destructive",
      });
      return;
    }
    verifyMutation.mutate({
      id: selectedDoc.id,
      status: "Rejected",
      rejectionReason,
    });
  };

  const openRejectDialog = (doc: Document) => {
    setSelectedDoc(doc);
    setDialogOpen(true);
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.fullName || user?.email || "Unknown";
  };

  const pendingDocs = documents.filter(d => d.status === "Pending");
  const verifiedDocs = documents.filter(d => d.status === "Verified");
  const rejectedDocs = documents.filter(d => d.status === "Rejected");

  if (loadingDocs) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 blur-3xl" />
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
          Document Verification
        </h1>
        <p className="text-muted-foreground">Review and verify user identity documents</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="relative p-6 border-yellow-500/30 bg-gradient-to-br from-black/60 to-yellow-500/5 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Pending Review</div>
            <div className="text-3xl font-bold text-yellow-400">{pendingDocs.length}</div>
          </div>
        </Card>
        <Card className="relative p-6 border-green-500/30 bg-gradient-to-br from-black/60 to-green-500/5 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Verified</div>
            <div className="text-3xl font-bold text-green-400">{verifiedDocs.length}</div>
          </div>
        </Card>
        <Card className="relative p-6 border-red-500/30 bg-gradient-to-br from-black/60 to-red-500/5 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Rejected</div>
            <div className="text-3xl font-bold text-red-400">{rejectedDocs.length}</div>
          </div>
        </Card>
      </div>

      {/* Pending Documents */}
      <div>
        <h2 className="text-2xl font-bold text-primary uppercase tracking-wider mb-4">
          Pending Documents ({pendingDocs.length})
        </h2>
        {pendingDocs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingDocs.map((doc) => (
              <Card key={doc.id} className="relative p-6 border-primary/30 bg-gradient-to-br from-black/80 to-primary/5 backdrop-blur-xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between">
                    <FileText className="w-8 h-8 text-primary" />
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{doc.type}</h3>
                    <p className="text-sm text-muted-foreground">{getUserName(doc.userId)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Uploaded: {new Date(doc.createdAt!).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-primary/30"
                      onClick={() => window.open(doc.filePath, "_blank")}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleVerify(doc)}
                      disabled={verifyMutation.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => openRejectDialog(doc)}
                      disabled={verifyMutation.isPending}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="relative p-12 text-center border-primary/30 bg-black/80 backdrop-blur-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <p className="text-muted-foreground">No pending documents</p>
          </Card>
        )}
      </div>

      {/* Verified Documents */}
      <div>
        <h2 className="text-2xl font-bold text-green-400 uppercase tracking-wider mb-4">
          Verified Documents ({verifiedDocs.length})
        </h2>
        {verifiedDocs.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {verifiedDocs.slice(0, 8).map((doc) => (
              <Card key={doc.id} className="p-4 border-green-500/30 bg-gradient-to-br from-black/60 to-green-500/5">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{doc.type}</p>
                    <p className="text-xs text-muted-foreground truncate">{getUserName(doc.userId)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-black border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-primary">Reject Document</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this document.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="border-primary/30 bg-black/40"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={verifyMutation.isPending || !rejectionReason.trim()}
            >
              {verifyMutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Rejecting...</>
              ) : (
                <>Reject Document</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

