import { Component } from '@angular/core';
import itemsData from '../../assets/items.json';
import Item from '../../interfaces/item';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.css'
})
export class ItemCardComponent {
  item: Item = itemsData.weapon[2][2];
  weapons: Item[][] = itemsData.weapon;
}
