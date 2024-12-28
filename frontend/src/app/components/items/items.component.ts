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
  // components: ;
  // componentOf: ;
  // isActive: boolean;
}

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
})
export class ItemsComponent {
  @Input() categories: string[] = Object.keys(itemsData);
  items = Object.values(itemsData);

  onSelect(item: Item) {
    console.log(item);
    //   item.isActive = !item.isActive;
    // TODO: Add item to build
  }
}
