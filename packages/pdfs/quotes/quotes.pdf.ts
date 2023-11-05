import { jsPDF, type CellConfig } from "jspdf";
import "jspdf-autotable";
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

  const PAGE_WIDTH = 210;
  const PAGE_PADDING = 10;
  const CONTENT_MAX_WIDTH = PAGE_WIDTH - 2 * PAGE_PADDING;

  doc.setFontSize(24);
  doc.text(
    quoteData.name || `Devis - ${quoteData.identifier}`,
    PAGE_PADDING,
    15,
    {
      maxWidth: CONTENT_MAX_WIDTH,
    }
  );
  doc.setFontSize(14);
  doc.text(
    `${quoteData?.client?.firstname || ""} ${
      quoteData?.client?.lastname || ""
    }`,
    PAGE_PADDING,
    30,
    {
      maxWidth: CONTENT_MAX_WIDTH,
    }
  );
  doc.text(quoteData?.client?.email || "", PAGE_PADDING, 37.5, {
    maxWidth: CONTENT_MAX_WIDTH,
  });
  doc.text(quoteData?.client?.phone || "", PAGE_PADDING, 45, {
    maxWidth: CONTENT_MAX_WIDTH,
  });
  doc.text(quoteData?.client?.address || "", PAGE_PADDING, 52.5, {
    maxWidth: CONTENT_MAX_WIDTH,
  });

  const headers = [["Description", "Quantité", "Prix unitaire", "Montant HT"]];

  const data = (quoteData.lines || []).map((line) => [
    line.description.replace(/<[^>]+>/g, ""),
    line.qty,
    line.unit_price ? line.unit_price.toFixed(2) : "-",
    line.qty && line.unit_price ? (line.unit_price * line.qty).toFixed(2) : "-",
  ]);

  if (data?.length) {
    // @ts-ignore
    doc.autoTable({
      head: headers,
      body: data,
      margin: { top: 60, left: PAGE_PADDING, right: PAGE_PADDING },
      columnStyles: {
        0: { fontSize: 14 },
      },
      styles: {
        fontSize: 14,
        minCellHeight: 15,
        halign: "left",
        valign: "middle",
        cellPadding: 5,
        lineColor: [226, 232, 240],
        lineWidth: 0.01,
      },
      headStyles: {
        fillColor: [117, 121, 241],
        lineWidth: 0,
        lineColor: false,
      },
      alternateRowStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    });
  }

  doc.text(
    (quoteData?.modalities || "").replace(/<[^>]+>/g, ""),
    PAGE_PADDING,
    // @ts-ignore
    (doc?.lastAutoTable?.finalY || 60) + 7.5,
    {
      maxWidth: CONTENT_MAX_WIDTH,
      renderingMode: 'fill'
    }
  )

  function addFooters() {
    doc.setFontSize(13);
    doc.setTextColor("#6d6e6f");
    doc.text(
      (quoteData.footer || "").replace(/<[^>]+>/g, ""),
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 5,
      {
        align: "center",
      }
    );
  }
  addFooters();

  if (opts.save) {
    doc.save(`Devis_${quoteData.identifier}.pdf`);
  } else {
    // @ts-ignore
    return doc.output(opts.output);
  }
}
