import { ApiService } from './apiService';

export interface LocationReservationData {
  success: boolean;
  source?: string;
  location?: string;
  date?: number;
  dateLabel?: string;
  summary?: {
    reservations?: {
      count: number;
      countDisplay: string;
      units: number;
      unitsDisplay: string;
    };
    contracts?: {
      count: number;
      countDisplay: string;
      units: number;
      unitsDisplay: string;
    };
    total?: {
      count: number;
      units: number;
    };
  };
  reservations?: {
    count: number;
    countDisplay: string;
    units: number;
    unitsDisplay: string;
    data: any[];
  };
  contracts?: {
    count: number;
    countDisplay: string;
    units: number;
    unitsDisplay: string;
    data: any[];
  };
  data?: any[];
  headers?: string[];
}

export const LocationReservationService = {
  async getToday(location: string): Promise<LocationReservationData> {
    return ApiService.get<LocationReservationData>(`/public-reservations-contracts/${location}/today`);
  },

  async getNextWorkDay(location: string): Promise<LocationReservationData> {
    return ApiService.get<LocationReservationData>(`/public-reservations-contracts/${location}/next-work-day`);
  },

  async getDay2(location: string): Promise<LocationReservationData> {
    return ApiService.get<LocationReservationData>(`/public-reservations-contracts/${location}/day-2`);
  },

  async getDay3(location: string): Promise<LocationReservationData> {
    return ApiService.get<LocationReservationData>(`/public-reservations-contracts/${location}/day-3`);
  },

  async getDay4(location: string): Promise<LocationReservationData> {
    return ApiService.get<LocationReservationData>(`/public-reservations-contracts/${location}/day-4`);
  },

  async getDay5(location: string): Promise<LocationReservationData> {
    return ApiService.get<LocationReservationData>(`/public-reservations-contracts/${location}/day-5`);
  },

  async getNext6DaysSummary(location: string): Promise<LocationReservationData> {
    return ApiService.get<LocationReservationData>(`/public-reservations-contracts/${location}/next-6-days-summary`);
  }
};
