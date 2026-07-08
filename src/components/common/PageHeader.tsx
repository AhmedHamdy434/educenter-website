"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";

interface PageHeaderProps {
  title: string;
  description?: string;
  actionButton?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
}

export function PageHeader({
  title,
  description,
  actionButton,
}: PageHeaderProps) {
  const Icon = actionButton?.icon || Plus;

  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-right">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 font-sans">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-slate-500 font-medium">
              {description}
            </p>
          )}
        </div>

        {actionButton && (
          <div className="flex items-center gap-3">
            {actionButton.href ? (
              <Button asChild variant="brand" size="brandMd" className="w-full sm:w-auto">
                <Link href={actionButton.href}>
                  <Icon className="ml-2 h-4 w-4 shrink-0" />
                  {actionButton.label}
                </Link>
              </Button>
            ) : (
              <Button
                onClick={actionButton.onClick}
                variant="brand"
                size="brandMd"
                className="w-full sm:w-auto"
              >
                <Icon className="ml-2 h-4 w-4 shrink-0" />
                {actionButton.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
