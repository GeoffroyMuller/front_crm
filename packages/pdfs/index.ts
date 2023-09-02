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

  // Ajouter le titre du devis
  doc.setFontSize(18);
  doc.text(`Devis - ${quoteData.name}`, 10, 10);

  // Informations sur le client
  doc.setFontSize(12);
  doc.text(
    `Client: ${quoteData?.client?.firstname || ''} ${quoteData?.client?.lastname || ''}`,
    10,
    20
  );
  doc.text(`Email: ${quoteData?.client?.email || ''}`, 10, 30);
  doc.text(`Téléphone: ${quoteData?.client?.phone || ''}`, 10, 40);
  doc.text(`Adresse: ${quoteData?.client?.address || ''}`, 10, 50);

  // Lignes de devis
  let startY = 70;
  (quoteData?.lines || []).forEach((line, index) => {
    startY += 10;
    doc.text(`${line.description}`, 10, startY);
    startY += 10;
    doc.text(
      `Quantité: ${line.qty || 1} | Prix unitaire: ${line.unit_price || 0}`,
      10,
      startY
    );
    startY += 10;
    doc.text(`TVA: ${line.vat.rate}%`, 10, startY);
    startY += 10;
    doc.text(
      `Total: ${(line.qty || 1) * (line.unit_price || 0)} €`,
      10,
      startY
    );
  });

  // Informations de pied de page
  doc.setFontSize(14);
  doc.text(`Total: ${quoteData.price || 0} €`, 10, startY + 20);
  doc.text(`Taxes: ${quoteData.taxes || 0} €`, 10, startY + 30);
  doc.text(`Modalités de paiement: ${quoteData.modalities}`, 10, startY + 40);
  doc.text(`Date de création: ${quoteData.madeAt}`, 10, startY + 50);

  if (opts.save) {
    doc.save(`Devis_${quoteData.identifier}.pdf`);
  } else {
    // @ts-ignore
    return doc.output(opts.output);
  }
}
