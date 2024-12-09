import { Component, Input } from '@angular/core';
import itemsData from '../../assets/items.json';
import { CommonModule } from '@angular/common';

interface Item {
  name: string;
  cost: number;
  // effects: [{ property: 'test'; value: 0 }];
  // activeEffects: [{ property: 'test'; value: 0 }];
  // conditionalEfffects: [{ condition: 'test'; property: 'test'; value: 0 }];
  description: string | null;
  // compnents: ;
  // compnentOf: null;
}

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css',
})
export class ItemComponent {
  @Input() category: 'weapon' | 'vitality' | 'spirit' = 'weapon';
  items: Item[] = itemsData.weapon;


}
