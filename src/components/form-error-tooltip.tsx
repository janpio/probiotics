"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { BadgeAlertIcon } from "lucide-react";
import { useState } from "react";

interface FormErrorTooltipProps {
  id?: string;
  message?: string;
}

export function FormErrorTooltip({ id, message }: FormErrorTooltipProps) {
  const [open, setOpen] = useState(false);

  if (message === undefined) {
    return <></>;
  }
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200} open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn("overflow-hidden focus-visible:outline-none")}
            onClick={() => void setOpen(!open)}
          >
            <BadgeAlertIcon className="mr-px h-5 w-5 fill-destructive text-destructive-foreground" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          className="bg-destructive text-sm text-destructive-foreground"
          onClick={() => void setOpen(false)}
        >
          <p id={id}>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
