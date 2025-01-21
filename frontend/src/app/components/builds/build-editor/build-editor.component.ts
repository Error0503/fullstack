import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import heroesData from '../../../assets/heroes.json';
import itemsData from '../../../assets/items.json';
import Item from '../../../interfaces/item';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../services/UserService/user-service.service';

@Component({
  selector: 'app-build-editor',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './build-editor.component.html',
  styleUrl: './build-editor.component.css',
})
export class BuildEditorComponent {
  weaponItemCount = 0;
  selectedWeaponItems: string[] = [];
  vitalityItemCount = 0;
  selectedVitalityItems: string[] = [];
  spiritItemCount = 0;
  selectedSpiritItems: string[] = [];
  flexItemCount = 0;
  selectedFlexItems: { name: string; category: string }[] = [];

  items: Item[][][] = [itemsData.weapon, itemsData.vitality, itemsData.spirit];
  heroes = Object.values(heroesData);

  buildForm: FormGroup;

  loading: boolean = true;

  buildId: number | undefined;

  @Input()
  set id(id: number) {
    this.loadData(id);
  }

  loadData(id: number | undefined): void {
    this.buildId = id;
    if (id !== undefined) {
      this.http.get(`http://localhost:3000/post/${id}`).subscribe({
        next: (data) => {
          const parsedDate = JSON.parse(JSON.stringify({ ...data }));
          this.buildForm.setValue({
            heroId: parsedDate.heroId,
            title: parsedDate.title,
            shortDescription: parsedDate.shortDescription,
            description: parsedDate.body.description,
            items: true,
          });
          this.selectedWeaponItems = parsedDate.body.weaponItems;
          this.weaponItemCount = this.selectedWeaponItems.length;
          this.selectedVitalityItems = parsedDate.body.vitalityItems;
          this.vitalityItemCount = this.selectedVitalityItems.length;
          this.selectedSpiritItems = parsedDate.body.spiritItems;
          this.spiritItemCount = this.selectedSpiritItems.length;
          this.selectedFlexItems = parsedDate.body.flexItems;
          this.flexItemCount = this.selectedFlexItems.length;
        },
        error: console.error,
        complete: () => (this.loading = false),
      });
    } else {
      this.loading = false;
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private userService: UserService
  ) {
    this.buildForm = this.formBuilder.group({
      heroId: [undefined, [Validators.required]],
      title: [
        undefined,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
        ],
      ],
      shortDescription: [
        undefined,
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(100),
        ],
      ],
      description: [
        undefined,
        [
          Validators.required,
          Validators.minLength(100),
          Validators.maxLength(5000),
        ],
      ],
      items: [false, [Validators.requiredTrue]],
    });
  }

  saveBuild(): void {
    const cleanData = this.parseData();
    console.log(this.buildId);
    if (this.buildId === undefined) {
      console.log('POST');
      console.log(cleanData);

      this.http.post(`http://localhost:3000/post`, cleanData).subscribe({
        next: console.log,
        error: console.error,
      });
    } else {
      console.log('PUT');
      this.http
        .put(`http://localhost:3000/post/${this.buildId}`, cleanData)
        .subscribe({
          next: console.log,
          error: console.error,
        });
    }
  }

  parseData() {
    const dirtyData = this.buildForm.getRawValue();
    delete dirtyData['items'];
    delete dirtyData['description'];
    const cleanData = {
      userId: this.userService.getUserId(),
      ...dirtyData,
      body: {
        description: this.buildForm.get('description')!.value,
        weaponItems: this.selectedWeaponItems,
        vitalityItems: this.selectedVitalityItems,
        spiritItems: this.selectedSpiritItems,
        flexItems: this.selectedFlexItems,
      },
    };
    return cleanData;
  }

  get heroId() {
    return this.buildForm.get('hero');
  }

  get title() {
    return this.buildForm.get('title');
  }

  get shortDescription() {
    return this.buildForm.get('shortDescription');
  }

  get description() {
    return this.buildForm.get('description');
  }

  itemListClick(name: string, category: string): void {
    switch (category) {
      case 'weapon':
        if (this.selectedWeaponItems.includes(name)) {
          this.selectedWeaponItems = this.selectedWeaponItems.filter((i) => {
            if (i === name) {
              this.weaponItemCount--;
              return false;
            } else {
              return true;
            }
          });
        } else if (this.selectedFlexItems.includes({ name, category })) {
          this.selectedFlexItems = this.selectedFlexItems.filter((i) => {
            if (i.name === name) {
              this.flexItemCount--;
              return false;
            } else {
              return true;
            }
          });
        } else {
          if (this.weaponItemCount < 4) {
            this.weaponItemCount++;
            this.selectedWeaponItems.push(name);
          } else if (this.flexItemCount < 4) {
            this.flexItemCount++;
            this.selectedFlexItems.push({ name, category });
          }
        }
        break;
      case 'vitality':
        if (this.selectedVitalityItems.includes(name)) {
          this.selectedVitalityItems = this.selectedVitalityItems.filter(
            (i) => {
              if (i === name) {
                this.vitalityItemCount--;
                return false;
              } else {
                return true;
              }
            }
          );
        } else if (this.selectedFlexItems.includes({ name, category })) {
          this.selectedFlexItems = this.selectedFlexItems.filter((i) => {
            if (i.name === name) {
              this.flexItemCount--;
              return false;
            } else {
              return true;
            }
          });
        } else {
          if (this.vitalityItemCount < 4) {
            this.vitalityItemCount++;
            this.selectedVitalityItems.push(name);
          } else if (this.flexItemCount < 4) {
            this.flexItemCount++;
            this.selectedFlexItems.push({ name, category });
          }
        }
        break;
      case 'spirit':
        if (this.selectedSpiritItems.includes(name)) {
          this.selectedSpiritItems = this.selectedSpiritItems.filter((i) => {
            if (i === name) {
              this.spiritItemCount--;
              return false;
            } else {
              return true;
            }
          });
        } else if (this.selectedFlexItems.includes({ name, category })) {
          this.selectedFlexItems = this.selectedFlexItems.filter((i) => {
            if (i.name === name) {
              this.flexItemCount--;
              return false;
            } else {
              return true;
            }
          });
        } else {
          if (this.spiritItemCount < 4) {
            this.spiritItemCount++;
            this.selectedSpiritItems.push(name);
          } else if (this.flexItemCount < 4) {
            this.flexItemCount++;
            this.selectedFlexItems.push({ name, category });
          }
        }
        break;
    }

    console.log(this.weaponItemCount);
    console.log(this.vitalityItemCount);
    console.log(this.spiritItemCount);
    console.log(this.flexItemCount);

    this.buildForm.setValue({
      ...this.buildForm.getRawValue(),
      items:
        this.weaponItemCount === 4 &&
        this.vitalityItemCount === 4 &&
        this.spiritItemCount === 4 &&
        this.flexItemCount === 4,
    });
  }

  selectedItemClick(category: string, item: string): void {
    switch (category) {
      case 'weapon':
        console.log(item);
        this.selectedWeaponItems = this.selectedWeaponItems.filter((i) => {
          if (i === item) {
            this.weaponItemCount--;
            return false;
          } else {
            return true;
          }
        });
        break;
      case 'vitality':
        this.selectedVitalityItems = this.selectedVitalityItems.filter((i) => {
          if (i === item) {
            this.vitalityItemCount--;
            return false;
          } else {
            return true;
          }
        });
        break;
      case 'spirit':
        this.selectedSpiritItems = this.selectedSpiritItems.filter((i) => {
          if (i === item) {
            this.spiritItemCount--;
            return false;
          } else {
            return true;
          }
        });
        break;
      case 'flex':
        this.selectedFlexItems = this.selectedFlexItems.filter((i) => {
          if (i.name === item) {
            this.flexItemCount--;
            return false;
          } else {
            return true;
          }
        });
    }
    this.buildForm.setValue({
      ...this.buildForm.getRawValue(),
      items:
        this.weaponItemCount === 4 &&
        this.vitalityItemCount === 4 &&
        this.spiritItemCount === 4 &&
        this.flexItemCount === 4,
    });
  }

  onReset(): void {
    if (this.id !== undefined) {
      this.buildForm.reset();
      this.selectedWeaponItems = [];
      this.selectedVitalityItems = [];
      this.selectedSpiritItems = [];
      this.selectedFlexItems = [];
      this.weaponItemCount = 0;
      this.vitalityItemCount = 0;
      this.spiritItemCount = 0;
      this.flexItemCount = 0;
    } else {
      this.loadData(this.buildId);
    }
  }

  suppress(e: any): void {
    e.preventDefault();
  }
}
