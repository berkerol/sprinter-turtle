# Sprinter Turtle

2D top down road crossing game. Also works as a beautiful simulation when probabilities are increased. Written in [ES6](https://www.ecma-international.org/ecma-262/6.0/).

[![button](play.png)](https://berkerol.github.io/sprinter-turtle/sprinter-turtle.html)

## Controls

- Move the turtle by pressing _W, A, S, D_.
- Launch rockets by pressing _UP, DOWN, LEFT, RIGHT_.
- Launch rockets to the location of mouse by mouse clicks.
- Reset the turtle to safe zone by pressing _R_.
- Clear all meteors, trains and vehicles by pressing _C_.
- Increase and decrease level by pressing _O_ and _L_.

## Gameplay & Features

- There are 6 main entities in this game.

  - Explosion

    - They appear after trains and vehicles are exploded by meteors and rockets.
    - They are transparent so any entity below them is visible.
    - They do not block any movement of any entity.
    - Their sizes grow linearly with the entities are exploded within them.

  - Meteor

    - They appear in random sizes and random positions from time to time.
    - They have random colors.
    - They are transparent so any entity below them is visible.
    - They do not block any movement of any entity.
    - Time to hit to the ground is visible on them.
    - Until they disappear they have no effect but by the time they disappear they explode trains, vehicles and the turtle if they are below meteor.

  - Rocket

    - Turtle can launch rockets to explode trains and vehicles.
    - They are opaque and have random colors.

  - Train

    - They appear between lanes randomly from time to time.
    - They have two phases.

      - Warning phase

        - It is the first phase of the train.
        - They are opaque and yellow.
        - They do not block any movement of any entity. (If turtle touches them, it does not die.)
        - They cannot explode by meteors and rockets.
        - After this phase, actual train comes.

      - Train phase

        - It is the second (last) phase of the train.
        - They are opaque and red.
        - They block the vertical movement of the turtle. (If turtle touches them, it dies.)
        - They can explode because of meteors and rockets and creates explosions.

  - Turtle

    - Main entity in this game.
    - Only user controllable entity in this game.
    - It can launch rockets to explode trains and vehicles.
    - It can die because of meteors, trains and vehicles.
    - It stays in the safe zone in the beginning and tries to reach the top without dying.
    - After reaching the top, it flips vertically then it tries to reach the safe zone.
    - After reaching the safe zone, it again flips vertically.
    - Reaching the safe zone again completes one level.
    - By completion of one level, turtle and vehicle speeds are increased by their respective speed increments, other things do not change.

  - Vehicle

    - They appear in random sizes and random positions from time to time.

      - Each of them have different width, height, arc and speed.
      - They can be spawned in any lane in any direction.
      - They are opaque and have random colors.

    - They block the movements of the turtle. (If turtle touches them, it dies.)

    - They can explode because of meteors and rockets and creates explosions.
