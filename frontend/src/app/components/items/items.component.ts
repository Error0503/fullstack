import { Component } from '@angular/core';
import itemsData from '../../assets/items.json';
import { CommonModule } from '@angular/common';
import Item from '../../interfaces/item';
import { ItemCardComponent } from '../item-card/item-card.component';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, ItemCardComponent],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
})
export class ItemsComponent {
  weaponItems: Item[][] = itemsData.weapon;
  vitalityItems: Item[][] = itemsData.vitality;
  spiritItems: Item[][] = itemsData.spirit;
}
