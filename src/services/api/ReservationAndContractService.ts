import { ApiService } from "./apiService";

export interface ReservationAndContractData {
  success: boolean;
  data: any[];
  headers?: string[];
  dashboard?: any;
}

export class ReservationAndContractService {
  static async getAllContracts(): Promise<ReservationAndContractData> {
    return ApiService.get<ReservationAndContractData>("/public-all-contracts");
  }

  static async getAllReservationsContracts(): Promise<ReservationAndContractData> {
    return ApiService.get<ReservationAndContractData>("/public-all-reservations-contracts");
  }

  static async getNextDayReservationsContracts(): Promise<ReservationAndContractData> {
    return ApiService.get<ReservationAndContractData>("/public-all-reservations-contracts-next-day");
  }

  static async getDay2ReservationsContracts(): Promise<ReservationAndContractData> {
    return ApiService.get<ReservationAndContractData>("/public-all-reservations-contracts-day-2");
  }

  static async getDay3ReservationsContracts(): Promise<ReservationAndContractData> {
    return ApiService.get<ReservationAndContractData>("/public-all-reservations-contracts-day-3");
  }

  static async getDay4ReservationsContracts(): Promise<ReservationAndContractData> {
    return ApiService.get<ReservationAndContractData>("/public-all-reservations-contracts-day-4");
  }

  static async getDay5ReservationsContracts(): Promise<ReservationAndContractData> {
    return ApiService.get<ReservationAndContractData>("/public-all-reservations-contracts-day-5");
  }

  static async getNext6DaysSummary(): Promise<ReservationAndContractData> {
    return ApiService.get<ReservationAndContractData>("/public-all-reservations-contracts-next-6-days-summary");
  }
}
