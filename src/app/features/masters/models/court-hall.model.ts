export interface CourtHall {
    id: string;
    name: string;
    code: string;
    judgeName: string;
    roomNumber: string;
    courtComplexId: string;
    courtComplexName?: string;
    courtId: string;
    courtName?: string;
    isactive: boolean;
    isvirtualHall: boolean;
    seatingcapacity: number;
    hasvideoConferencing: boolean;
}