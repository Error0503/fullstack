import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import heroesData from '../../../assets/heroes.json';
import itemsData from '../../../assets/items.json';
import Item from '../../../interfaces/item';
import { HttpClient, HttpStatusCode } from '@angular/common/http';
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

  error: string | undefined;

  @Input()
  set id(id: number) {
    this.loadData(id);
  }

  loadData(id: number | undefined): void {
    this.buildId = id;
    if (id !== undefined) {
      this.http
        .get(
          `https://deadlock-builds-backend-9514acf001ce.herokuapp.com/post/${id}`
        )
        .subscribe({
          next: (data) => {
            const parsedData = JSON.parse(JSON.stringify({ ...data }));
            if (
              parsedData.user.id !== this.userService.getUserId() &&
              this.userService.getRole() === 'user'
            ) {
              this.router.navigate(['/builds']);
            }
            this.buildForm.setValue({
              heroId: parsedData.heroId,
              title: parsedData.title,
              shortDescription: parsedData.shortDescription,
              description: parsedData.body.description,
              items: true,
            });
            this.selectedWeaponItems = parsedData.body.weaponItems;
            this.weaponItemCount = this.selectedWeaponItems.length;
            this.selectedVitalityItems = parsedData.body.vitalityItems;
            this.vitalityItemCount = this.selectedVitalityItems.length;
            this.selectedSpiritItems = parsedData.body.spiritItems;
            this.spiritItemCount = this.selectedSpiritItems.length;
            this.selectedFlexItems = parsedData.body.flexItems;
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
    private userService: UserService,
    private router: Router
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
    if (this.buildId === undefined) {
      this.http
        .post(
          `https://deadlock-builds-backend-9514acf001ce.herokuapp.com/post`,
          cleanData
        )
        .subscribe({
          next: (data) => {
            this.router.navigate([
              '/builds',
              JSON.parse(JSON.stringify(data)).id,
            ]);
          },
          error: (error) => {
            switch (error.status) {
              case 0:
                this.error = 'Server is down';
                break;
              case HttpStatusCode.NotFound:
                this.error = 'Failed to create build';
                break;
            }
            setTimeout(() => {
              this.error = undefined;
            }, 3000);
          },
        });
    } else {
      this.http
        .put(
          `https://deadlock-builds-backend-9514acf001ce.herokuapp.com/post/${this.buildId}`,
          cleanData
        )
        .subscribe({
          next: (data) => {
            this.router.navigate([
              '/builds',
              JSON.parse(JSON.stringify(data)).id,
            ]);
          },
          error: (error) => {
            switch (error.status) {
              case 0:
                this.error = 'Server is down';
                break;
              case HttpStatusCode.NotFound:
                this.error = 'Failed to create build';
                break;
            }
            setTimeout(() => {
              this.error = undefined;
            }, 3000);
          },
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
    if (this.buildId === undefined) {
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
