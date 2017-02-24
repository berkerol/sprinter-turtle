package sprinterTurtle;

import acm.graphics.GTurtle;

public class Turtle {

    private final GTurtle image;
    private final int maxTurn;
    private final int positionX;
    private final int positionY;
    private double speed;
    private final double speedIncrement;
    private double speedX;
    private double speedY;
    private boolean touchedTop;
    private double turnLeft;
    private double turnRight;

    Turtle(int maxTurn, int positionX, int positionY, int size, double speed, double speedIncrement) {
        image = new GTurtle();
        image.setDirection(90.0);
        image.setLocation(positionX, positionY);
        image.setSize(size);
        image.setSpeed(1.0);
        image.sendToFront();
        this.maxTurn = maxTurn;
        this.positionX = positionX;
        this.positionY = positionY;
        this.speed = speed;
        this.speedIncrement = speedIncrement;
        speedX = 0.0;
        speedY = 0.0;
        touchedTop = false;
        turnLeft = 0.0;
        turnRight = 0.0;
    }

    GTurtle getImage() {
        return image;
    }

    void setSpeedX(double speedX) {
        this.speedX = speedX;
    }

    void setSpeedY(double speedY) {
        this.speedY = speedY;
    }

    void setTurnLeft(double turnLeft) {
        this.turnLeft = turnLeft;
    }

    void setTurnRight(double turnRight) {
        this.turnRight = turnRight;
    }

    boolean isTouchedTop() {
        return touchedTop;
    }

    void reset() {
        image.setDirection(90.0);
        image.setLocation(positionX, positionY);
        image.sendToFront();
        speedX = 0.0;
        speedY = 0.0;
        touchedTop = false;
        turnLeft = 0.0;
        turnRight = 0.0;
    }

    boolean update(int boardHeight, int boardWidth, int framesPerSecond, boolean keyboard, int laneHeight, int lanes, boolean pause, int pixelsPerSecond) {
        if (!pause && keyboard) {
            if ((speedX == speed && speedY == speed) || (speedX == speed && speedY == -speed)
                    || (speedX == -speed && speedY == speed) || (speedX == -speed && speedY == -speed)) {
                double root = Math.sqrt(2);
                speedX /= root;
                speedY /= root;
            }
            double x = image.getX() + speedX, y = image.getY() + speedY;
            if (image.getY() - image.getTurtleSize() / 2.0 < 0) {
                y = image.getY() + 1;
            }
            if (image.getY() + image.getTurtleSize() / 2.0 > boardHeight) {
                y = image.getY() - 1;
            }
            if (image.getX() - image.getTurtleSize() / 3.0 < 0) {
                x = image.getX() + 1;
                if (!touchedTop) {
                    turnLeft = 0;
                    image.setDirection(90);
                }
                else {
                    turnRight = 0;
                    image.setDirection(270);
                }
            }
            if (image.getX() + image.getTurtleSize() / 3.0 > boardWidth) {
                x = image.getX() - 1;
                if (!touchedTop) {
                    turnRight = 0;
                    image.setDirection(90);
                }
                else {
                    turnLeft = 0;
                    image.setDirection(270);
                }
            }
            image.setLocation(x, y);
            if (!touchedTop) {
                if (image.getDirection() < 180 - maxTurn) {
                    image.left(turnLeft);
                }
                if (image.getDirection() > maxTurn) {
                    image.right(turnRight);
                }
            }
            else {
                if (image.getDirection() < 360 - maxTurn) {
                    image.left(turnLeft);
                }
                if (image.getDirection() > 180 + maxTurn) {
                    image.right(turnRight);
                }
            }
        }
        double turtleTop = image.getY() - image.getTurtleSize() / 2.0;
        if (!touchedTop && turtleTop < 1) {
            image.setDirection(270);
            touchedTop = true;
            turnLeft = 0;
            turnRight = 0;
        }
        if (touchedTop && turtleTop > lanes * laneHeight) {
            image.setDirection(90);
            touchedTop = false;
            turnLeft = 0;
            turnRight = 0;
            Vehicle.setVehicleSpeed(Vehicle.getVehicleSpeed() + Vehicle.getVehicleSpeedIncrement() * pixelsPerSecond / framesPerSecond);
            speed += speedIncrement * pixelsPerSecond / framesPerSecond;
            return true;
        }
        return false;
    }
}