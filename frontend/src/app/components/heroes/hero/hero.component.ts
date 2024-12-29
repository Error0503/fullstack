import { Component, Input, OnInit } from '@angular/core';
import heroesData from '../../../assets/heroes.json';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  hero: Hero = heroesData[0];
  @Input()
  set id(id: number) {
    this.hero = heroesData[id];
  }
}
