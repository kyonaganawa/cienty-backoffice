/**
 * REAL API STRUCTURE
 *
 * This interface matches the actual staging API response for clients.
 * Updated to reflect the real data structure from:
 * https://api-stg.covalenty.com.br/app/clients
 */

export interface PharmacyContact {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
}

export interface Company {
  id: number;
  name: string;
  isChain: boolean;
}

export interface Subscription {
  id: number;
  planId: number;
  status: string;
  startDate: string;
  endDate?: string;
}

export interface Cliente {
  id: number;
  name: string;
  cnpj: string;
  active: boolean;
  phone: string | null;
  company: Company;
  careBeautyBuyerName: string | null;
  salesmanName: string | null;
  drugsBuyerName: string | null;
  ownerName: string | null;
  clientPositions: string | null;
  erpName: string | null;
  erpVersion: string | null;
  legalName: string | null;
  remoteAccessId: string | null;
  hasSic: boolean;
  contacts: string | null;
  contactObservation: string | null;
  pharmacyContacts: PharmacyContact[];
  preferences: string | null;
  zipCode: string;
  city: string;
  state: string;
  neighborhood: string;
  street: string;
  streetNumber: string;
  addressComplement: string;
  originType: string | null;
  productsType: string[];
  interests: string[];
  hasSt: boolean;
  association: string | null;
  pipedriveUrl: string | null;
  createdAt: string;
  subscriptions: Subscription[];
  clientClusterId: number;
  documents: string | null;
  certificateStatus: string;
  referralCode: string;
}

// Mock data removed - now using real staging API data
export const mockClientes: Cliente[] = [];
