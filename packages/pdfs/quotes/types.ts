export type VatPdfData = {
  rate: number;
};

export type SaleLinePdfData = {
  description: string;
  discount?: number;
  discount_type: null;
  idQuote?: number;
  idVat?: number;
  qty?: number;
  type: "title" | "product" | "comment" | "discount";
  unit_price?: number;
  vat: VatPdfData;
  idProduct?: number;
};

export type CompanyPdfData = {
  name: string;
};

export type ClientPdfData = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  idCompany: number;
  company: CompanyPdfData;
};

export type QuotePdfData = {
  name: string;
  archived: boolean;
  client: ClientPdfData;
  footer: string;
  identifier: string;
  lines: Array<SaleLinePdfData>;
  madeAt: string;
  madeOn: string;
  modalities: string;
  price?: number;
  taxes?: number;
};
