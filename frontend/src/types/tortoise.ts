export interface TortoiseResponse {
  tortoiseId: number;
  name: string;
  ageMonths: number | null;
  weightGrams: number | null;
  photoUrl: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateTortoiseRequest {
  name: string;
  ageMonths: number | null;
  weightGrams: number | null;
  notes: string | null;
}

export interface UpdateTortoiseRequest {
  name: string;
  ageMonths: number | null;
  weightGrams: number | null;
  notes: string | null;
}