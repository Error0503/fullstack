export interface Hero {
  name: string;
  shortDescription: string;
  description: string;
  abilities: {
    name: string;
    description: string;
    stats: { property: string; value: string; scales: boolean }[];
    upgrades: string[];
  }[];
  weaponStats: {
    dps: number;
    bulletDamage: number;
    ammo: number;
    bulletsPerSec: number;
    lightMelee: number;
    heavyMelee: number;
  };
  vitalityStats: {
    maxHealth: number;
    healthRegen: number;
    bulletResist: number;
    spiritResist: number;
    moveSpeed: number;
    sprintSpeed: number;
    stamina: number;
  };
}
