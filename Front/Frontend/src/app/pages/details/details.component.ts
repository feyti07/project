import { Component, OnInit } from '@angular/core';
import { DemandeDto } from '../../swagger/services/models';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandeService } from '../../../services/demande.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeServiceService } from '../../../services/employee-service.service';
import { HelperService } from '../../../services/helper.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  demandeForm!: FormGroup;
  fileToUpload: File | null = null;
  demandeId: number | null = null;
  requestBody: any;
  matricules: string[] = [];
  selectedMatricule: string = '';
  lieuOptions: string[] = ['DRH', 'DF', 'DCI'];
  categorieOptions: string[] = ['logement', 'Congé', 'Matériel'];
  impactOptions: string[] = ['Élevé', 'Modéré', 'Faible'];
  typeOptions: string[] = ['Gestion_Paie', 'Gestion_Administratif'];
  urgenceOptions: string[] = ['Élevé', 'Modéré', 'Faible'];
  
  demande: DemandeDto = {
    lieu: '',
    categorie: '',
    urgence: '',
    impact: '',
    id: 0,
    employeeMatricule: '',
    description: '',
    pieceJointe: '',
    type: '',
    status: '',
    createdAt:'',
    updatedAt:""
  };
  errorMessages: Array<string> = [];

  constructor(
    private demandeService: DemandeService,
    private helperService: HelperService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private apiGenDemandeSce: DemandeService,
    private employeeService: EmployeeServiceService,
    private route: ActivatedRoute 
    
  ) { }
                                      
  ngOnInit(): void {
    this.demandeForm = this._fb.group({
      lieu: ['', Validators.required],
      categorie:['', Validators.required],
      urgence: ['', Validators.required],
      impact: ['', Validators.required],
      employeeMatricule:['', Validators.required],
      description : ['', Validators.required],
      pieceJointe : ['', Validators.required],
      type : ['', Validators.required]
      
    });
    const demandeId = this.activatedRoute.snapshot.params['idDemande'];
    if (demandeId) {
      this.demandeService.findById2(demandeId).subscribe({
        next: (data) => {
          this.demande = data;
        }
      });
    }
    this.loadEmployeeMatricules();

    this.route.paramMap.subscribe(params => {
      this.demandeId = params.get('demande-id') ? Number(params.get('demande-id')) : null;
      if (this.demandeId) {
        this.loadDemande(this.demandeId);
      }
    });
    
  }
  loadDemande(id: number): void {
    this.apiGenDemandeSce.findById(id).subscribe({
      next: (demande) => {
        this.demandeForm.patchValue(demande);
      },
      error: (error) => {
        console.error('Error loading demande:', error);
      }
    });
  }
  loadEmployeeMatricules(): void {
    this.employeeService.getEmployeeMatricules().subscribe(
      data => {
        this.matricules = data;
      },
      error => {
        console.error('Error fetching employee matricules', error);
      }
    );
  }
 

  /* onFileChange(event: any) {
    const file = event.target.files[0];
    this.demandeForm.patchValue({
      pieceJointe: file
    });
    this.demandeForm.get('pieceJointe')!.updateValueAndValidity();
  }



  save() {
    this.errorMessages = [];
    const formData: FormData = new FormData(); // Création d'un objet FormData pour envoyer les données
    for (const key in this.demandeForm.value) {
      if (this.demandeForm.value.hasOwnProperty(key)) {
        formData.append(key, this.demandeForm.value[key]);
      }
    }
    if (this.fileToUpload) {
      formData.append('pieceJointe', this.fileToUpload, this.fileToUpload.name); // Ajout de la pièce jointe au FormData
    }
  
    this.apiGenDemandeSce.saveWithFormData({ formData }).subscribe({
      next: async () => {
        this.router.navigate(['/listD']);
      },
      error: (err) => {
        if (err.error && err.error.validationErrors) {
          this.errorMessages = err.error.validationErrors;
        } else {
          this.errorMessages = ['An unexpected error occurred'];
        }
      }
    });
  }
  

 
} */

save(): void {
  this.errorMessages = [];
  const requestBody = { body: this.demandeForm.value };
  
  if (this.demandeId) {
    this.updateDemande(this.demandeId, requestBody);
  } else {
    this.createDemande(requestBody);
  }
}

createDemande(requestBody: any): void {
  this.apiGenDemandeSce.save2(requestBody).subscribe({
    next: async (response) => {
      console.log("Save successful:", response); // Log success response
      await this.router.navigate(['/listD']);
    },
    error: (err) => {
      console.error("Save error:", err); // Log error response
      if (err.error && err.error.validationErrors) {
        this.errorMessages = err.error.validationErrors;
      } else {
        this.errorMessages = ['An unexpected error occurred'];
      }
    }
  });
}

updateDemande(id: number, requestBody: any): void {
  this.apiGenDemandeSce.update({
    'demande-id': id,
    context: undefined,
    body: requestBody.body
  }).subscribe({
    next: async (response) => {
      console.log("Update successful:", response); // Log success response
      await this.router.navigate(['/listD']);
    },
    error: (err) => {
      console.error("Update error:", err); // Log error response
      if (err.error && err.error.validationErrors) {
        this.errorMessages = err.error.validationErrors;
      } else {
        this.errorMessages = ['An unexpected error occurred'];
      }
    }
  });
}

async cancel() {
  await this.router.navigate(['/listD']);
}

}
