package sprinterTurtle;

import acm.graphics.GOval;
import java.awt.Color;

public class Rocket {

    private final GOval image;
    private final double speedX;
    private final double speedY;

    Rocket(double positionX, double positionY, double sizeX, double sizeY, double speedX, double speedY) {
        Color color = new Color((float) Math.random(), (float) Math.random(), (float) Math.random());
        image = new GOval(positionX, positionY, sizeX, sizeY);
        image.setColor(color);
        image.setFillColor(color);
        image.setFilled(true);
        image.sendToFront();
        this.speedX = speedX;
        this.speedY = speedY;
    }

    GOval getImage() {
        return image;
    }

    double getSpeedX() {
        return speedX;
    }

    double getSpeedY() {
        return speedY;
    }
}