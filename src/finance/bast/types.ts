/** Cover info - Penawaran pekerjaan/jasa, Nama Perusahaan, Bulan BAST, Informasi Perusahaan */
export interface CoverInfo {
  jobOffer: string;
  companyName: string;
  bastMonth: string;
  address: string;
  phone: string;
}

/** Document info - Nomor BAST, Tanggal BAST, Nomor PO/Invoice Terkait */
export interface DocumentInfo {
  bastNumber: string;
  bastDate: string;
  relatedPoOrInvoice?: string;
}

/** Party signature - Nama, Jabatan, Perusahaan, Tanda Tangan (shared for both parties) */
export interface PartySignature {
  name: string;
  position: string;
  company: string;
  signatureUrl?: string;
}

/** Main BAST entity */
export interface BAST {
  id: string;
  coverInfo: CoverInfo;
  documentInfo: DocumentInfo;
  deliveringParty: PartySignature;
  receivingParty: PartySignature;
  createdAt?: string;
  updatedAt?: string;
}

export type BASTCreateInput = Omit<BAST, "id" | "createdAt" | "updatedAt">;
export type BASTUpdateInput = Partial<BASTCreateInput>;
