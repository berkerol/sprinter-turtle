package sprinterTurtle;

import acm.graphics.GOval;
import java.awt.Color;

public class Explosion {

    private int count;
    private final GOval[] image;

    Explosion(int alpha, int hits, double positionX, double positionY, double size) {
        count = 1;
        image = new GOval[4];
        for (int k = 0; k < image.length; k++) {
            image[k] = new GOval(positionX + (k * size / 8) * hits, positionY + (k * size / 8) * hits, (size - k * size / 4) * hits, (size - k * size / 4) * hits);
        }
        Color red = new Color(Color.RED.getRed(), Color.RED.getGreen(), Color.RED.getBlue(), alpha);
        Color orange = new Color(Color.ORANGE.getRed(), Color.ORANGE.getGreen(), Color.ORANGE.getBlue(), alpha);
        Color yellow = new Color(Color.YELLOW.getRed(), Color.YELLOW.getGreen(), Color.YELLOW.getBlue(), alpha);
        Color white = new Color(Color.WHITE.getRed(), Color.WHITE.getGreen(), Color.WHITE.getBlue(), alpha);
        image[0].setColor(red);
        image[0].setFillColor(red);
        image[1].setColor(orange);
        image[1].setFillColor(orange);
        image[2].setColor(yellow);
        image[2].setFillColor(yellow);
        image[3].setColor(white);
        image[3].setFillColor(white);
        for (GOval item : image) {
            item.setFilled(true);
            item.sendToFront();
            item.setVisible(false);
        }
        image[3].setVisible(true);
    }

    GOval[] getImage() {
        return image;
    }

    boolean update(int duration) {
        count++;
        if (count > duration / 4) {
            image[2].setVisible(true);
        }
        if (count > duration / 4 * 2) {
            image[1].setVisible(true);
        }
        if (count > duration / 4 * 3) {
            image[0].setVisible(true);
        }
        return count > duration;
    }
}