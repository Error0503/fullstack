import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import heroesData from '../../assets/heroes.json';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.css',
})
export class HeroesComponent {
  heroes = Object.values(heroesData);
}
