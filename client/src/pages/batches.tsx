import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { BatchCard } from "@/components/batch-card";
import { BatchDetailModal } from "@/components/batch-detail-modal";
import { Skeleton } from "@/components/ui/skeleton";
import type { Batch } from "@shared/schema";

export default function Batches() {
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: batches, isLoading } = useQuery<Batch[]>({
    queryKey: ["/api/batches"],
  });

  const filteredBatches = batches?.filter((batch) => {
    const matchesSearch =
      batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.mineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.mineLocation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = stageFilter === "all" || batch.currentStage === stageFilter;
    const matchesStatus = statusFilter === "all" || batch.status === statusFilter;

    return matchesSearch && matchesStage && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          All Batches
        </h1>
        <p className="text-muted-foreground">
          View and manage all registered lithium batches
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by batch number, mine name, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-batches"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-40" data-testid="select-stage-filter">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="mining">Mining</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="export">Export</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40" data-testid="select-status-filter">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredBatches.length} of {batches?.length || 0} batches
      </div>

      {/* Batches Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-64 w-full rounded-md" />
            </div>
          ))}
        </div>
      ) : filteredBatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => (
            <BatchCard
              key={batch.id}
              batch={batch}
              onViewDetails={setSelectedBatch}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-border rounded-md">
          <p className="text-muted-foreground mb-2">
            {searchTerm || stageFilter !== "all" || statusFilter !== "all"
              ? "No batches match your filters"
              : "No batches registered yet"}
          </p>
          {!searchTerm && stageFilter === "all" && statusFilter === "all" && (
            <a href="/register" className="text-primary hover:underline">
              Register your first batch
            </a>
          )}
        </div>
      )}

      {/* Batch Detail Modal */}
      <BatchDetailModal
        batch={selectedBatch}
        open={!!selectedBatch}
        onOpenChange={(open) => !open && setSelectedBatch(null)}
      />
    </div>
  );
}
