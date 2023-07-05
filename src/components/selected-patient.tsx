"use client";

import { buttonVariants } from "@/components/ui/button";
import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { EditPatientDialog } from "./edit-patient-dialog";

export function SelectedPatient() {
  const { patient } = useSelectPatientStore();
  const pathname = usePathname();

  const path = useMemo(() => pathname.split("/"), [pathname]);
  const patientPage = path[2] === "patient" && path[3] === undefined;

  return (
    <div className="flex flex-col gap-4 rounded-md border-2 p-4 text-sm leading-normal">
      <h3 className="mx-auto text-lg font-semibold">Selected patient</h3>
      {!patient ? (
        <div>No patient selected</div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* <div>{typeof patient.medicalConditions}</div> */}
          <div className="flex gap-2">
            <div className="w-1/3 truncate">SSN</div>
            <div className="flex-1">{patient.ssn}</div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/3 truncate">Name</div>
            <div className="flex-1">{patient.fullName}</div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/3 truncate">Gender</div>
            <div className="flex-1">{patient.gender}</div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/3 truncate">Birth date</div>
            <div className="flex-1">
              {patient.birthDate.toLocaleDateString()}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/3 truncate">Ethnicity</div>
            <div className="flex-1">{patient.ethnicity}</div>
          </div>
          <EditPatientDialog />
          <div className="flex w-full">
            {patientPage ? (
              <Link
                href={`${patient.id}/time-series`}
                className={cn(
                  buttonVariants({ size: "sm", variant: "secondary" }),
                  "w-full"
                )}
              >
                Time series
              </Link>
            ) : (
              <Link
                href={`/patients/${patient.id}`}
                className={cn(
                  buttonVariants({ size: "sm", variant: "secondary" }),
                  "w-full"
                )}
              >
                View
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
