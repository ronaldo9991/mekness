import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Upload, Eye, Loader2, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Document } from "@shared/schema";

export default function Documents() {
  // Fetch documents with real-time updates
  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
    refetchInterval: 30000, // Refetch every 30 seconds for real-time status updates
  });

  const columns = [
    { 
      key: "type", 
      label: "Type",
      render: (value: string) => (
        <span className="font-semibold">{value}</span>
      ),
    },
    { 
      key: "fileName", 
      label: "Document",
      render: (value: string) => (
        <span className="font-mono text-sm">{value}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => {
        const variant = value === "Verified" ? "default" : value === "Pending" ? "secondary" : "destructive";
        return <Badge variant={variant}>{value}</Badge>;
      },
    },
    { 
      key: "uploadedAt", 
      label: "Uploaded On",
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
    {
      key: "action",
      label: "Action",
      render: () => (
        <Button variant="ghost" size="sm" data-testid="button-view">
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
    {
      key: "rejectionReason",
      label: "Reason",
      render: (value: string | null) => value || "-",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const verifiedDocs = documents.filter((doc) => doc.status === "Verified");
  const pendingDocs = documents.filter((doc) => doc.status === "Pending");
  const rejectedDocs = documents.filter((doc) => doc.status === "Rejected");

  const requiredDocuments = [
    { type: "ID Proof", description: "Government-issued ID (Passport, Driver's License, National ID)" },
    { type: "Address Proof", description: "Utility bill, Bank statement (not older than 3 months)" },
    { type: "Bank Statement", description: "Recent bank statement showing your name and account details" },
  ];

  const isDocVerified = (type: string) => verifiedDocs.some((doc) => doc.type === type);
  const isDocPending = (type: string) => pendingDocs.some((doc) => doc.type === type);
  const isDocRejected = (type: string) => rejectedDocs.some((doc) => doc.type === type);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Documents</h1>
          <p className="text-muted-foreground">
            Upload and manage your verification documents.
          </p>
        </div>
        <Button className="gap-2" data-testid="button-upload">
          <Upload className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      {/* Required Documents */}
      <Card className="p-6 border-card-border">
        <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
        <div className="space-y-4">
          {requiredDocuments.map((doc, index) => {
            const verified = isDocVerified(doc.type);
            const pending = isDocPending(doc.type);
            const rejected = isDocRejected(doc.type);

            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold">{doc.type}</h3>
                    {verified && <Badge variant="default">Verified</Badge>}
                    {pending && <Badge variant="secondary">Pending</Badge>}
                    {rejected && <Badge variant="destructive">Rejected</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                </div>
                {!verified && (
                  <Button variant="outline" size="sm" data-testid={`button-upload-${doc.type.toLowerCase().replace(/\s+/g, '-')}`}>
                    {rejected ? "Re-upload" : pending ? "Uploaded" : "Upload"}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Info Box */}
      <Card className="p-6 border-card-border border-l-4 border-l-primary">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">Document Verification</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All documents are usually verified within 24-48 hours. Please ensure your documents are:
            </p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
              <li>Clear and readable (not blurry)</li>
              <li>In color (not black and white)</li>
              <li>Not expired or older than 3 months</li>
              <li>Show your full name and address clearly</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Documents Table */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Document History</h2>
        {documents.length > 0 ? (
          <DataTable columns={columns} data={documents} />
        ) : (
          <Card className="p-12 text-center border-card-border">
            <p className="text-muted-foreground">No documents uploaded yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
