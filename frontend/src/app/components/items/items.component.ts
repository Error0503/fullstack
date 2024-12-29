import { Component, Input } from '@angular/core';
import itemsData from '../../assets/items.json';
import { CommonModule } from '@angular/common';
import Item from '../../interfaces/item';
import Effect from '../../interfaces/effect';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
})
export class ItemsComponent {
  weaponItems: Item[][] = itemsData.weapon;
  spiritItems: Item[][] = itemsData.spirit;
  vitalityItems: Item[][] = itemsData.vitality;

  onSelect(item: Item): void {
    console.log(item);
    // TODO: Add item to build
  }
}
