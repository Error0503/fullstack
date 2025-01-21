import { Component, Input } from '@angular/core';
import heroesData from '../../assets/heroes.json';
import { RouterModule } from '@angular/router';
import Build from '../../interfaces/build';

@Component({
  selector: 'app-build-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './build-card.component.html',
  styleUrl: './build-card.component.css',
})
export class BuildCardComponent {
  heroes = Object.values(heroesData);
  @Input() build!: Build;
}
