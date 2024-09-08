import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
 // Import EmployeeService pour les matricules
import { ActivatedRoute, Router } from '@angular/router';
import { ReclamationService } from '../../../services/reclamation.service';
import { EmployeeServiceService } from '../../../services/employee-service.service';
import { ReclamationDto } from '../../Models/ReclamationDto';
import { PaginatedResponse } from '../../Models/PaginatedResponse';

@Component({
  selector: 'app-ajout-reclamation',
  templateUrl: './ajout-reclamation.component.html',
  styleUrls: ['./ajout-reclamation.component.css']
})
export class AjoutReclamationComponent implements OnInit {
  reclamationForm!: FormGroup;
  fileToUpload: File | null = null;
  reclamationId: number | null = null;
  matricules: string[] = [];
  selectedMatricule: string = '';
  lieuOptions: string[] = ['DRH', 'DF', 'DCI'];
  categorieOptions: string[] = ['Bulletin', 'Promotion', 'Electricité'];  
  impactOptions: string[] = ['Élevé', 'Modéré', 'Faible'];
  typeOptions: string[] = ['Gestion_Paie', 'Gestion_Administratif'];
  urgenceOptions: string[] = ['Élevé', 'Modéré', 'Faible'];
  activeTab: string = 'reclamation'; // Onglet actif par défaut


  @Input() reclamationIdInput!: string;

  constructor(
    private fb: FormBuilder,
    private reclamationService: ReclamationService,
    private employeeService: EmployeeServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reclamationForm = this.fb.group({
      lieu: ['', Validators.required],
      categorie:['', Validators.required],
      urgence: ['', Validators.required],
      impact: ['', Validators.required],
     
      description : ['', Validators.required]
      
    });

    this.initializeForm();
    this.loadEmployeeMatricules();

    this.reclamationId = this.route.snapshot.params['reclamation-id']
      ? +this.route.snapshot.params['reclamation-id']
      : null;

    if (this.reclamationId) {
      this.loadReclamation(this.reclamationId);
    }

  }

  initializeForm(): void {
    this.reclamationForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      lieu: ['', Validators.required],
      categorie: ['', Validators.required],
      impact: ['', Validators.required],
      urgence: ['', Validators.required]
    });
  }


  

  handleFileInput(files: FileList): void {
    this.fileToUpload = files.item(0);
  }

  saveReclamation(): void {
    if (this.reclamationForm.valid) {
      const reclamationData = this.reclamationForm.value;

      const formData = new FormData();
      for (const key in reclamationData) {
        if (reclamationData.hasOwnProperty(key)) {
          formData.append(key, reclamationData[key]);
        }
      }

      if (this.fileToUpload) {
        formData.append('pieceJointe', this.fileToUpload);
      }

      const params = {
        body: formData
      };

      if (this.reclamationId) {
        this.reclamationService.updateReclamation(this.reclamationId, formData, {
          'reclamation-id': this.reclamationId,
          body: formData
        }).subscribe({
          next: () => {
            console.log('Réclamation mise à jour avec succès');
            this.router.navigate(['/list-reclamations']);
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour de la réclamation', error);
          }
        });
      } else {
        this.reclamationService.save(params).subscribe({
          next: (response) => {
            console.log('Réclamation créée avec succès', response);
            this.router.navigate(['/list-reclamations']);
          },
          error: (error) => {
            console.error('Erreur lors de la création de la réclamation', error);
          }
        });
      }
    }
  }

  loadReclamation(reclamationId: number): void {
    this.reclamationService.findById({ 'reclamation-id': reclamationId }).subscribe((reclamation) => {
      this.reclamationForm.patchValue(reclamation);
    });
  }

  loadEmployeeMatricules(): void {
    this.employeeService.getEmployeeMatricules().subscribe(
      data => {
        this.matricules = data;
      },
      error => {
        console.error('Erreur lors de la récupération des matricules des employés', error);
      }
    );
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.reclamationForm.patchValue({
      pieceJointe: file
    });
    this.reclamationForm.get('pieceJointe')!.updateValueAndValidity();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'historique') {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParamsHandling: 'preserve'
      });
    }
  }



  
}