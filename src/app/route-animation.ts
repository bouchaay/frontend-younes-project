import {
    trigger,
    transition,
    query,
    style,
    animate
  } from '@angular/animations';
  
  export const fader = trigger('routeAnimations', [
    transition('* <=> *', [
      query(':enter, :leave', [
        style({ position: 'absolute', width: '100%', opacity: 0 })
      ], { optional: true }),
  
      query(':enter', [
        animate('1500ms ease', style({ opacity: 1 }))
      ], { optional: true }),
    ])
  ]);
  