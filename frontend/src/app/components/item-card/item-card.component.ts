import { Component, Input } from '@angular/core';
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
  @Input() item!: Item;

  getColors(): string[] {
    // bgColors: [title, components, effects, conditionalEffects]
    if (this.item.category === 'weapon') {
      return ['c97a03', '9e630c', '80550f', '67430a'];
    } else if (this.item.category === 'spirit') {
      return ['c97a03', '9e630c', '80550f', '67430a'];
    } else if (this.item.category === 'vitality') {
      return ['c97a03', '9e630c', '80550f', '67430a'];
    } else {
      return ['', '', '', ''];
    }
  }
}
