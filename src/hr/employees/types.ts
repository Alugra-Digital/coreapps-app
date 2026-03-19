export const NAMA_JABATAN = [
  "DIREKTUR",
  "Manajemen Operation",
  "Project Manager",
  "SA",
  "Secretary Office",
  "HR GA",
  "Finance Accounting",
  "Technical Writer",
  "Tenaga Ahli",
  "EOS Oracle",
  "EOS Ticketing",
  "EOS Unsoed",
] as const;

export const STATUS_PAJAK = [
  "TK/0",
  "TK/1",
  "TK/2",
  "TK/3",
  "K/0",
  "K/1",
  "K/2",
  "K/3",
] as const;

export const STATUS_PERKAWINAN = ["Kawin", "Belum Kawin"] as const;

export const JENIS_KELAMIN = ["L", "P"] as const;

export const TIPE_KARYAWAN = ["Permanent", "Contract", "Intern", "Freelance"] as const;

export type NamaJabatan = (typeof NAMA_JABATAN)[number];
export type StatusPajak = (typeof STATUS_PAJAK)[number];
export type StatusPerkawinan = (typeof STATUS_PERKAWINAN)[number];
export type JenisKelamin = (typeof JENIS_KELAMIN)[number];
export type TipeKaryawan = (typeof TIPE_KARYAWAN)[number];

export interface Employee {
  id: string;
  nik: string;
  namaKaryawan: string;
  /** Position name from Positions master (backward compatible with NamaJabatan values) */
  namaJabatan: string;
  tipeKaryawan?: TipeKaryawan;
  tmk?: string;
  noKtp?: string;
  noKk?: string;
  npwp?: string;
  noHp?: string;
  email?: string;
  pendidikan?: string;
  statusPajak?: StatusPajak;
  statusPerkawinan?: StatusPerkawinan;
  jumlahAnak?: number;
  tempatLahir?: string;
  tanggalLahir?: string;
  jenisKelamin?: JenisKelamin;
  alamatKtp?: string;
  kotaKtp?: string;
  provinsiKtp?: string;
  noRek?: string;
  namaBank?: string;
  noJknKis?: string;
  noJms?: string;
  tanggalKeluar?: string;
  /** Document URLs (base64 data URL for mock; file URL for real backend) */
  profilePictureUrl?: string;
  ktpDocumentUrl?: string;
  kkDocumentUrl?: string;
  npwpDocumentUrl?: string;
}

export type EmployeeCreateInput = Omit<Employee, "id">;
export type EmployeeUpdateInput = Partial<EmployeeCreateInput>;
