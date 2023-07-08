import { csvFileType, xlsFileType, xlsxFileType } from "@/lib/file";
import {
  type ProbioticRecordResult,
  type ProbioticRecordResultEntry,
  type ProbioticRecordResultRow,
} from "@/types/probiotic-record";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

interface UseProbioticRecordResultOptions {
  initialResult?: ProbioticRecordResult;
}

export function useProbioticRecordResult(
  file?: File,
  options?: UseProbioticRecordResultOptions
) {
  // Initialize
  const { initialResult } = { ...options };

  // States
  const [loading, setLoading] = useState(true);
  const [reader, setReader] = useState<FileReader>();
  const [rows, setRows] = useState<ProbioticRecordResultRow[]>([]);

  useEffect(() => void setLoading(false), []);

  const reset = async () => {
    const emptyRows = await createEmptyResultRows(0, 20);
    setRows(emptyRows);
  };

  const createEmptyRows = async (startIdx: number, count: number) => {
    const emptyRows = await createEmptyResultRows(startIdx, count);
    console.log("on: createEmptyResults");
    setRows((prev) => [...prev, ...emptyRows]);
  };

  const exportFile = () => {
    const worksheet = XLSX.utils.json_to_sheet<ProbioticRecordResultEntry>(
      (
        rows.filter((row) => row.probiotic !== null && row.value !== null) as {
          probiotic: string;
          value: string;
        }[]
      ).map((rows) => ({
        Probiotic: rows.probiotic,
        Value: parseFloat(rows.value),
      })),
      {
        header: ["Probiotic", "Value"],
      }
    );
    const csv = XLSX.utils.sheet_to_csv(worksheet, {
      FS: ",",
      forceQuotes: true,
      blankrows: false,
    });
    // const blob = new Blob([csv], { type: "text/csv" });
    const file = new File([csv], "data.csv", {
      type: "text/csv;charset=utf-8",
    });
    return file;
  };

  // Component mounted
  useEffect(() => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary", FS: "," });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json<{
        probiotic: string | null;
        value: string | number | null;
      }>(sheet, {
        header: ["probiotic", "value"],
        range: 1,
      });
      const result: ProbioticRecordResultRow[] = rows.map((row, idx) => ({
        idx,
        probiotic: row.probiotic,
        value: typeof row.value === "number" ? row.value.toString() : row.value,
      }));
      setRows(result);
    };

    setReader(reader);
  }, []);

  useEffect(() => {
    if (!initialResult) {
      void reset();
      return;
    }
    const rows = Object.keys(initialResult).map((probiotic, idx) => ({
      idx,
      probiotic,
      value: initialResult[probiotic].toString(),
    }));
    setRows(rows);
  }, [initialResult]);

  useEffect(() => {
    if (file && reader) {
      switch (file.type) {
        case csvFileType:
          reader.readAsText(file);
          break;
        case xlsFileType:
        case xlsxFileType:
          reader.readAsBinaryString(file);
          break;
      }
    }
  }, [file, reader]);

  useEffect(() => {
    if (
      !loading &&
      rows.slice(-5).some((row) => row.probiotic !== null || row.value !== null)
    ) {
      const startIdx = rows.length;
      void createEmptyRows(startIdx, Math.max(20 - startIdx, 5));
    }
  }, [loading, rows]);

  return {
    rows,
    setRows,
    reset,
    createEmptyRows,
    exportFile,
  };
}

async function createEmptyResultRows(
  startIdx: number,
  count: number,
  timeout = 0
) {
  return new Promise<ProbioticRecordResultRow[]>((resolve) => {
    const rows: ProbioticRecordResultRow[] = Array.from(
      { length: count },
      (_, idx) => ({
        idx: startIdx + idx,
        probiotic: null,
        value: null,
      })
    );
    setTimeout(() => resolve(rows), timeout);
  });
}