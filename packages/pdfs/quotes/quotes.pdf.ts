import { jsPDF } from "jspdf";
import type { QuotePdfData } from "./types";

export type GenerateQuotePDFOptions = {
  save?: boolean;
  output?: "datauristring" | "arraybuffer" | "blob";
};

export function generateQuotePDF(
  quoteData: QuotePdfData,
  opts: GenerateQuotePDFOptions = {
    output: 'datauristring'
  }
) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(quoteData.name || `Devis - ${quoteData.identifier}`, 10, 10);
  doc.setFontSize(12);
  doc.text(
    `Client: ${quoteData?.client?.firstname || ''} ${quoteData?.client?.lastname || ''}`,
    10,
    20
  );
  doc.text(`Email: ${quoteData?.client?.email || ''}`, 10, 30);
  doc.text(`Téléphone: ${quoteData?.client?.phone || ''}`, 10, 40);
  doc.text(`Adresse: ${quoteData?.client?.address || ''}`, 10, 50);
  

  if (opts.save) {
    doc.save(`Devis_${quoteData.identifier}.pdf`);
  } else {
    // @ts-ignore
    return doc.output(opts.output);
  }
}
