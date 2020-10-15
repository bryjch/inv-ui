import { default as monogatari } from '@monogatari/core'

import { textSpeed, hide } from './helpers'

// Define the messages used in the game.
monogatari.action('message').messages({})

// Define the notifications used in the game
monogatari.action('notification').notifications({
  Welcome: {
    title: 'Welcome',
    body: 'This is the Monogatari VN Engine',
    icon: '',
  },
})

// Define the Particles JS Configurations used in the game
monogatari.action('particles').particles({
  snow: {
    particles: {
      number: {
        value: 40,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: '#fff',
      },
      shape: {
        type: 'circle',
        stroke: {
          width: 0,
          color: '#000000',
        },
        polygon: {
          nb_sides: 5,
        },
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
      },
      move: {
        enable: true,
        speed: 2,
        direction: 'bottom',
        random: false,
        straight: false,
        out_mode: 'out',
        bounce: false,
      },
    },
    retina_detect: true,
  },
})

// Define the canvas objects used in the game
monogatari.action('canvas').objects({})

// Credits of the people involved in the creation of this awesome game
monogatari.configuration('credits', {})

// Define the images that will be available on your game's image gallery
monogatari.assets('gallery', {})

// Define the music used in the game.
monogatari.assets('music', {})

// Define the voice files used in the game.
monogatari.assets('voices', {})

// Define the sounds used in the game.
monogatari.assets('sounds', {})

// Define the videos used in the game.
monogatari.assets('videos', {})

// Define the images used in the game.
monogatari.assets('images', {})

// Define the backgrounds for each scene.
monogatari.assets('scenes', {})

// Define the Characters
monogatari.characters({
  sys: {
    name: 'System',
    color: '#5bcaff',
  },

  '2B': {
    name: '2B',
    color: '#5bcaff',
    sprites: { normal: '2B.png' },
  },

  '9S': {
    name: '9S',
    color: '#5bcaff',
    sprites: { normal: '9S.png' },
  },

  A2: {
    name: 'A2',
    color: '#5bcaff',
    sprites: { normal: 'A2.png' },
  },
})

monogatari.script({
  Start: ['', 'end'],

  INTRO_2B: [
    'show character 2B normal at right with fadeIn',
    'sys YoRHa No.2 Type B (Battle) or 2B serves as the protagonist of Route A in NieR:Automata.',
    textSpeed(400),
    'show particles snow',
    'sys .....',
    textSpeed(),
    'sys She is a YoRHa android created to battle the machine lifeforms that have invaded the planet on behalf of the surviving humans.',
    'sys She served during the 14th Machine War.',
    hide,
  ],

  INTRO_9S: [
    'show character 9S normal at right with fadeIn',
    'sys 9S is a scanner type android who served during the 14th Machine War.',
    'sys He specializes in investigative purposes—a member of the automated infantry squad, YoRHa, who triumphs in hacking-based information collection.',
    'sys He is shown to be highly bigoted towards machines, believing there to be no logic behind anything they do.. ',
    hide,
  ],

  INTRO_A2: [
    'show character A2 normal at right with fadeIn',
    'sys YoRHa Type A (Attacker) No.2 or A2 is a prototype of the YoRHa android line, and combat data from her and her comrades was used to create the superior current lines, including 2B and 9S.',
    'sys Her hatred for Machines and desire for their destruction becomes encompassing and defines the rest of her continued existence.',
    "sys She doesn't like to speak and often keeps to herself.",
    hide,
  ],
})
