"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { TableFilters } from "@/components/common/TableFilters";
import { SharedTable } from "@/components/common/SharedTable";
import { GradeForm } from "./GradeForm";
import { useGrades } from "../hooks/useGrades";
import { type Grade } from "../types";
import { type GradeFormValues } from "../schemas/grade-schema";
import { getGradeColumns } from "./columns";

import { type ApiResponse } from "@/types";
import { SharedModal } from "@/components/common/SharedModal";
import { Card } from "@/components/ui/card";

interface GradesListClientProps {
  initialData: ApiResponse<Grade[]>;
}

export function GradesListClient({ initialData }: GradesListClientProps) {
  // Search & Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  // Fetch and mutations encapsulated in useGrades hook
  const {
    grades,
    total,
    totalPages,
    isLoading,
    togglingId,
    isSubmitting,
    toggleStatus,
    createGrade,
    updateGrade,
  } = useGrades({
    page,
    limit,
    search,
    activeFilter,
    initialData,
    onSuccessSubmit: () => {
      setIsModalOpen(false);
      setSelectedGrade(null);
    },
  });

  const handleToggleStatus = (id: string) => {
    toggleStatus(id);
  };

  const handleFormSubmit = async (values: GradeFormValues) => {
    if (selectedGrade) {
      updateGrade(selectedGrade.id, values);
    } else {
      createGrade(values);
    }
  };

  // SharedTable columns mapping
  const columns = getGradeColumns({
    onEdit: (grade) => {
      setSelectedGrade(grade);
      setIsModalOpen(true);
    },
    onToggleStatus: handleToggleStatus,
    togglingId,
  });

  return (
    <div className="space-y-6 text-right">
      {/* 1. Header (Shared) */}
      <PageHeader
        title="المراحل الدراسية"
        description="إدارة وتهيئة المراحل الدراسية والصفوف التابعة للمركز التعليمي."
        actionButton={{
          label: "مرحلة جديدة",
          icon: Plus,
          onClick: () => {
            setSelectedGrade(null);
            setIsModalOpen(true);
          },
        }}
      />

      {/* 2. Filters & Table inside Glassy Card */}
      <Card className="space-y-4">
        <TableFilters
          searchPlaceholder="ابحث عن مرحلة دراسية..."
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1); // Reset page to 1 on new search
          }}
          filters={[
            {
              key: "active",
              placeholder: "فلترة حسب الحالة",
              options: [
                { label: "نشط", value: "true" },
                { label: "معطل", value: "false" },
              ],
            },
          ]}
          filterValues={{ active: activeFilter }}
          onFilterChange={(key, val) => {
            if (key === "active") {
              setActiveFilter(val);
              setPage(1); // Reset page to 1 on filter change
            }
          }}
        />

        <SharedTable
          columns={columns}
          data={grades}
          isLoading={isLoading}
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={(val) => {
            setLimit(val);
            setPage(1);
          }}
          emptyMessage="لم يتم العثور على أي مراحل دراسية."
        />
      </Card>

      {/* 4. Form Modal (Shared Form Logic) */}
      <SharedModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedGrade(null);
        }}
        title={
          selectedGrade ? "تعديل المرحلة الدراسية" : "إضافة مرحلة دراسية جديدة"
        }
      >
        <GradeForm
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedGrade(null);
          }}
          onSubmit={handleFormSubmit}
          grade={selectedGrade}
          isSubmitting={isSubmitting}
        />
      </SharedModal>
    </div>
  );
}
