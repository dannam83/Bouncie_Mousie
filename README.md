# Wall-E Ball
[Live Demo](https://dannam.xyz/Wall_E_Ball/)

![alt text](https://user-images.githubusercontent.com/30483700/32818979-a7357cd2-c994-11e7-809e-321869d77866.png)
inspired by Doodle Jump

## Story
Eve?!

![alt text](https://user-images.githubusercontent.com/30483700/32821473-8c551f8c-c9a1-11e7-9079-78e1639d251f.png)

## Gameplay
Tap left and right and Wall-E will use puffs of his fire extinguisher to move around. If you want Wall-E to move fast, you can puff air really quickly or even hold down the left or right key to watch him fly, though that might not be the best way to make sure he lands where he needs to. If you reach the spaceship, press "enter" and your score will persist, so you can continue and keep pushing for new high scores!

![alt text](https://user-images.githubusercontent.com/30483700/32821106-bbdb6858-c99f-11e7-9930-d094a8925e65.png)

## Code
Wall-E is built entirely on JavaScript using Canvas and HTML with CSS. With requestAnimationFrame, the canvas element is repainted up to 60 times a second to create a seamless 2D scrolling experience. 

#### Wall-E
When Wall-E moves up, everything else moves down. By manipulating the y-axis of all the clouds and the boards as Wall-E reaches a certain height on the canvas, the experience of scrolling and upward movement is achieved.
```
if (ball.y < 200) {
  boards.forEach(board => {
    board[0] += ball.vy;
    if (board[0] < -50) {
      boards.pop();
    }
  });
  cloudsArray.forEach(cloud => {
    cloud[0] += ball.vy;
  });
  ball.y -= ball.vy;
  groundCoord[0] -= ball.vy;
  topCoord[0] += ball.vy;
  score += 1;
}
```
#### Boards and Clouds
With every game boards and clouds are positioned randomly. While the position of clouds are entirely random, the boards could not be done that way because of the possibility of there being a gap where the bounce height might not be able to reach the next board. In order to overcome this, the y-coordinate of boards are given max random values that represent the max gap between them. As Wall-E goes higher, that max gap increases. Only the first and last boards are not randomized.
```
let boards = [];
const lastBoardY = 10000;
function fillBoards() {
  let gap = 0;
  let ypos = lastBoardY - 200;
  let xpos;
  boards.push([lastBoardY, 0.5 * xposMax]);
  while (ypos > 230) {
    xpos = Math.random() * xposMax;
    boards.push([ypos, xpos]);
    if (ypos > 7500) {
      gap = Math.random() * 250;
      ypos -= gap;
    } else if (ypos > 5000) {
      gap = Math.random() * 200;
      ypos -= gap;
    } else if (ypos > 2500) {
      gap = Math.random() * 150;
      ypos -= gap;
    } else if (ypos > 230) {
      gap = Math.random() * 100;
      ypos -= gap;
    }
  }
  boards.push([230, 0.5 * xposMax]);
}
```
## Future Directions
#### Items
Add items that Wall-E can collect on the way up that would increase the score further.

#### Board Variations
Add boards that move, boards that give a higher bounce, and boards that can sustain limited bounces.

#### Enemies
Add enemies that would make Wall-E lose if he collides with them.
