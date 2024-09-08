export interface Message {
  id?: number;
  senderId?: number; 
  receiverId?: number;
  demandeId?: number;
  content?: string;
  timestamp?: Date;       
  employeeMatricule?: string;
}
