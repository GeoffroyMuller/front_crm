import { jsPDF, type CellConfig } from "jspdf";
import type { QuotePdfData } from "./types";

export type GenerateQuotePDFOptions = {
  save?: boolean;
  output?: "datauristring" | "arraybuffer" | "blob";
};

export function generateQuotePDF(
  quoteData: QuotePdfData,
  opts: GenerateQuotePDFOptions = {
    output: "datauristring",
  }
) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(quoteData.name || `Devis - ${quoteData.identifier}`, 10, 10);
  doc.setFontSize(12);
  doc.text(
    `Client: ${quoteData?.client?.firstname || ""} ${
      quoteData?.client?.lastname || ""
    }`,
    10,
    20
  );
  doc.text(`Email: ${quoteData?.client?.email || ""}`, 10, 30);
  doc.text(`Téléphone: ${quoteData?.client?.phone || ""}`, 10, 40);
  doc.text(`Adresse: ${quoteData?.client?.address || ""}`, 10, 50);

  const headers: CellConfig[] = [
    {
      align: "center",
      name: "description",
      padding: 0,
      width: 75,
      prompt: "description",
    },
    {
      align: "center",
      name: "unit_price",
      padding: 0,
      width: 50,
      prompt: "prix unitaire",
    },
    {
      align: "center",
      name: "qty",
      padding: 0,
      width: 50,
      prompt: "quantité",
    },
  ];

  const data: { [key: string]: string }[] = (quoteData.lines || []).map((l) => {
    return {
      description: l.description,
      unit_price: l.unit_price as unknown as string,
      vat: l.vat.rate as unknown as string,
    };
  });

  doc.table(10, 60, data, headers, {});

  if (opts.save) {
    doc.save(`Devis_${quoteData.identifier}.pdf`);
  } else {
    // @ts-ignore
    return doc.output(opts.output);
  }
}
