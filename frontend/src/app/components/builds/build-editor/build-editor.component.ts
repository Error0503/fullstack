import { Component } from '@angular/core';
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

@Component({
  selector: 'app-build-editor',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './build-editor.component.html',
  styleUrl: './build-editor.component.css',
})
export class BuildEditorComponent {
  weaponItemCount = 0;
  selectedWeaponItems: Item[] = [];
  vitalityItemCount = 0;
  selectedVitalityItems: Item[] = [];
  spiritItemCount = 0;
  selectedSpiritItems: Item[] = [];
  flexItemCount = 0;
  selectedFlexItems: Item[] = [];

  items: Item[][][] = [itemsData.weapon, itemsData.vitality, itemsData.spirit];
  heroes = Object.values(heroesData);

  buildForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.buildForm = this.formBuilder.group({
      hero: [undefined, [Validators.required]],
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

  get hero() {
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

  itemListClick(item: Item): void {
    switch (item.category) {
      case 'weapon':
        if (this.selectedWeaponItems.includes(item)) {
          this.selectedWeaponItems = this.selectedWeaponItems.filter((i) => {
            if (i === item) {
              this.weaponItemCount--;
              return false;
            } else {
              return true;
            }
          });
        } else if (this.selectedFlexItems.includes(item)) {
          this.selectedFlexItems = this.selectedFlexItems.filter((i) => {
            if (i === item) {
              this.flexItemCount--;
              return false;
            } else {
              return true;
            }
          });
        } else {
          if (this.weaponItemCount < 4) {
            this.weaponItemCount++;
            this.selectedWeaponItems.push(item);
          } else if (this.flexItemCount < 4) {
            this.flexItemCount++;
            this.selectedFlexItems.push(item);
          }
        }
        break;
      case 'vitality':
        if (this.selectedVitalityItems.includes(item)) {
          this.selectedVitalityItems = this.selectedVitalityItems.filter(
            (i) => {
              if (i === item) {
                this.vitalityItemCount--;
                return false;
              } else {
                return true;
              }
            }
          );
        } else if (this.selectedFlexItems.includes(item)) {
          this.selectedFlexItems = this.selectedFlexItems.filter((i) => {
            if (i === item) {
              this.flexItemCount--;
              return false;
            } else {
              return true;
            }
          });
        } else {
          if (this.vitalityItemCount < 4) {
            this.vitalityItemCount++;
            this.selectedVitalityItems.push(item);
          } else if (this.flexItemCount < 4) {
            this.flexItemCount++;
            this.selectedFlexItems.push(item);
          }
        }
        break;
      case 'spirit':
        if (this.selectedSpiritItems.includes(item)) {
          this.selectedSpiritItems = this.selectedSpiritItems.filter((i) => {
            if (i === item) {
              this.spiritItemCount--;
              return false;
            } else {
              return true;
            }
          });
        } else if (this.selectedFlexItems.includes(item)) {
          this.selectedFlexItems = this.selectedFlexItems.filter((i) => {
            if (i === item) {
              this.flexItemCount--;
              return false;
            } else {
              return true;
            }
          });
        } else {
          if (this.spiritItemCount < 4) {
            this.spiritItemCount++;
            this.selectedSpiritItems.push(item);
          } else if (this.flexItemCount < 4) {
            this.flexItemCount++;
            this.selectedFlexItems.push(item);
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

  selectedItemClick(category: string, item: Item): void {
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
          if (i === item) {
            this.flexItemCount--;
            return false;
          } else {
            return true;
          }
        });
    }
  }

  onSubmit(): void {
    console.log(this.buildForm.value);
    console.log(this.buildForm.errors);
  }

  onReset(): void {
    this.buildForm.reset();
    this.selectedWeaponItems = [];
    this.selectedVitalityItems = [];
    this.selectedSpiritItems = [];
    this.selectedFlexItems = [];
    this.weaponItemCount = 0;
    this.vitalityItemCount = 0;
    this.spiritItemCount = 0;
    this.flexItemCount = 0;
  }

  suppress(e: any): void {
    e.preventDefault();
  }
}
