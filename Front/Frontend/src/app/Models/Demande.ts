export class Demande {
    lieu: string;
    category: string;
    urgence: string;
    impact: string;

    constructor(lieu: string = '', category: string = '', urgence: string = '', impact: string = '') {
        this.lieu = lieu;
        this.category = category;
        this.urgence = urgence;
        this.impact = impact;
    }

    // Method to check if the demand is valid
    isValid(): boolean {
        // You can add more validation logic here if needed
        return !!this.lieu && !!this.category && !!this.urgence && !!this.impact;
    }
}
