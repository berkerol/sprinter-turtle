# Sprinter Turtle

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://github.com/berkerol/sprinter-turtle/issues)
[![semistandard](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg)](https://github.com/Flet/semistandard)
[![ECMAScript](https://img.shields.io/badge/ECMAScript-latest-brightgreen.svg)](https://www.ecma-international.org/ecma-262)
[![license](https://img.shields.io/badge/license-GNU%20GPL%20v3.0-blue.svg)](https://github.com/berkerol/sprinter-turtle/blob/master/LICENSE)

2D top down road crossing game. It may also work as a beautiful simulation when probabilities are increased.

[![button](play.png)](https://berkerol.github.io/sprinter-turtle/sprinter-turtle.html)

## Controls

- Move the turtle by pressing _W, A, S, D_.
- Launch rockets by pressing _UP, DOWN, LEFT, RIGHT_.
- Launch rockets to the location of mouse by mouse clicks.
- Reset the turtle to safe zone by pressing _R_.
- Clear all meteors, trains and vehicles by pressing _C_.
- Increase and decrease level by pressing _O_ and _L_.

## Gameplay & Features

- There are 6 entities in this game:

  - Turtle

    - Main entity in this game.
    - Only user controllable entity in this game.
    - It can launch rockets to explode trains and vehicles.
    - It can die because of meteors, trains and vehicles.
    - It stays in the safe zone in the beginning and tries to reach the top without dying.
    - After reaching the top, it flips vertically then it tries to reach the safe zone.
    - After reaching the safe zone, it again flips vertically.
    - Reaching the safe zone again completes one level.
    - After completion of one level: turtle and vehicle speeds are increased by their respective speed increments, other things do not change.

  - Vehicle

    - They appear randomly on lanes and with random speeds.
    - They are opaque and have random colors.
    - They block the movements of the turtle. (If turtle touches them, it dies.)
    - They can be exploded by meteors and rockets and creates explosions.
    - They always go towards left on upper lane and towards right on lower lane.

  - Train

    - They appear randomly between lanes and with random lengths.
    - They have two phases:

      - Warning phase

        - It is the first phase of the train.
        - They are opaque and yellow.
        - They do not block any movement of any entity. (If turtle touches them, it does not die.)
        - They can not be exploded by meteors and rockets.
        - After this phase, actual train comes.

      - Train phase

        - It is the second (last) phase of the train.
        - They are opaque and red.
        - They block the vertical movement of the turtle. (If turtle touches them, it dies.)
        - They can be exploded by meteors and rockets and creates explosions.

  - Meteor

    - They appear in random sizes and random positions and for random durations.
    - They are transparent so any entity below them is visible.
    - They do not block any movement of any entity.
    - They will explode trains, turtle and vehicles under them after they disappear.
    - Time to hit to the ground (disappear) is visible on them.

  - Rocket

    - They can be launched by turtle in 4 main directions and to the location of mouse.
    - They are opaque and red.
    - They do not block the movements of the turtle but block trains and vehicles.
    - They will explode trains and vehicles if they have contact.

  - Explosion

    - They appear after trains and vehicles are exploded by meteors and rockets.
    - They are transparent so any entity below them is visible.
    - They do not block any movement of any entity.
    - Their sizes grow linearly with the entities are exploded within them.

## Contribution

Feel free to [contribute](https://github.com/berkerol/sprinter-turtle/issues) according to the [semistandard rules](https://github.com/Flet/semistandard) and [latest ECMAScript Specification](https://www.ecma-international.org/ecma-262).

## Distribution

You can distribute this software freely under [GNU GPL v3.0](https://github.com/berkerol/sprinter-turtle/blob/master/LICENSE).
