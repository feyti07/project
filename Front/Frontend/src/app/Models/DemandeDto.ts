export interface DemandeDto {
    id: number;
    lieu: string;
    categorie: string;
    urgence: string;
    impact: string;
    employeeMatricule : string;
    description : string;
    pieceJointe : string;
    type : string;
    status : string;
    createdAt: string;
    updatedAt: string;
    updatedBy?:string;
    createur?:String;
  }