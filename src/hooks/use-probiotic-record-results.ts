import { csvFileType, xlsFileType, xlsxFileType } from "@/lib/s3";
import {
  type ProbioticRecordResult,
  type ProbioticRecordResultRow,
} from "@/types/probiotic-record";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export function useProbioticRecordResults(file?: File) {
  const [reader, setReader] = useState<FileReader>();
  const [results, setResults] = useState<ProbioticRecordResultRow[]>([]);

  const resetResults = async () => {
    const rows = await createEmptyRows(0, 20);
    setResults([...rows]);
  };

  const createEmptyResults = async (startIdx: number, count: number) => {
    const rows = await createEmptyRows(startIdx, count);
    setResults((prev) => [...prev, ...rows]);
  };

  const exportFile = () => {
    const worksheet = XLSX.utils.json_to_sheet<ProbioticRecordResult>(
      (
        results.filter(
          (result) => result.probiotic !== null && result.value !== null
        ) as { probiotic: string; value: string }[]
      ).map((result) => ({
        probiotic: result.probiotic,
        value: parseFloat(result.value),
      })),
      {
        header: ["probiotic", "value"],
      }
    );
    console.log(worksheet);
    const csv = XLSX.utils.sheet_to_csv(worksheet, {
      FS: ",",
      forceQuotes: true,
      blankrows: false,
    });
    // const blob = new Blob([csv], { type: "text/csv" });
    const file = new File([csv], "data.csv", { type: "text/csv" });
    console.log(results);
    return file;
  };

  // Component mounted
  useEffect(() => {
    void resetResults();

    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary", FS: "," });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const json = XLSX.utils.sheet_to_json<{
        probiotic: string;
        value: number;
      }>(sheet, {
        header: ["probiotic", "value"],
        range: 1,
      });
      const results: ProbioticRecordResultRow[] = json.map((result, idx) => ({
        idx,
        probiotic: result.probiotic,
        value: result.value.toString(),
      }));
      setResults(results);
      const startIdx = results.length
      await createEmptyResults(startIdx, startIdx < 15 ? 20 - startIdx : 5);
    };

    setReader(reader);
  }, []);

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

  return { results, setResults, resetResults, createEmptyResults, exportFile };
}

async function createEmptyRows(startIdx: number, count: number, timeout = 0) {
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
