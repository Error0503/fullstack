import { Component } from '@angular/core';
import itemsData from '../../../assets/items.json';
import Item from '../../../interfaces/item';

@Component({
  selector: 'app-build-editor',
  standalone: true,
  imports: [],
  templateUrl: './build-editor.component.html',
  styleUrl: './build-editor.component.css',
})
export class BuildEditorComponent {
  weaponItemCount = 0;
  selectedWeaponItems: (Item | undefined)[] = [];
  vitalityItemCount = 0;
  selectedVitalityItems: (Item | undefined)[] = [];
  spiritItemCount = 0;
  selectedSpiritItems: (Item | undefined)[] = [];
  flexItemCount = 0;
  selectedFlexItems: (Item | undefined)[] = [];
  items: Item[][][] = [itemsData.weapon, itemsData.vitality, itemsData.spirit];

  constructor() {
    console.log(this.selectedFlexItems);
    console.log(this.selectedFlexItems[0] !== null);
  }

  // TODO: Implement item click
  itemClick(item: any): void {
    console.log(item);
    switch (item.category) {
      case 'weapon':
        if (this.selectedWeaponItems.includes(item)) {
          this.selectedWeaponItems = this.selectedWeaponItems.filter((i) => {
            if (i !== item) {
              this.weaponItemCount--;
              return true;
            } else {
              return false;
            }
          });
        } else {
          if (this.weaponItemCount < 4) {
            this.weaponItemCount++;
            this.selectedWeaponItems.push(item);
          }
        }
        break;
      case 'vitality':
        this.selectedVitalityItems.push(item);
        break;
      case 'spirit':
        this.selectedSpiritItems.push(item);
        break;
    }
  }
}
