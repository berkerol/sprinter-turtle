package sprinterTurtle;

import acm.graphics.GLabel;
import acm.graphics.GOval;
import java.awt.Color;
import java.awt.Font;
import java.util.Random;

public class Meteor {

    private int count;
    private final GOval imageCircle;
    private final GLabel imageCount;

    Meteor(int alpha, int boardWidth, int duration, int framesPerSecond, double highestSize, int laneHeight, int lanes,
            double lowestSize, Random random, double size) {
        count = 1;
        int[] color = {random.nextInt(256), random.nextInt(256), random.nextInt(256)};
        size *= (highestSize - lowestSize) * Math.random() + lowestSize;
        double positionX = random.nextInt((int) (boardWidth - size)) + 1, positionY = random.nextInt((int) (lanes * laneHeight - size)) + 1;
        imageCircle = new GOval(positionX, positionY, size, size);
        imageCircle.setColor(new Color(color[0], color[1], color[2], alpha));
        imageCircle.setFillColor(new Color(color[0], color[1], color[2], alpha));
        imageCircle.setFilled(true);
        imageCircle.sendToFront();
        imageCount = new GLabel("" + duration / framesPerSecond, positionX + size / 4, positionY + 3 * size / 4);
        imageCount.setFont(new Font(Font.DIALOG, Font.BOLD, (int) size));
        imageCount.setColor(new Color(255 - color[0], 255 - color[1], 255 - color[2], alpha));
        imageCount.sendToFront();
    }

    int getCount() {
        return count;
    }

    GOval getImageCircle() {
        return imageCircle;
    }

    GLabel getImageCount() {
        return imageCount;
    }

    boolean update(int duration, int framesPerSecond) {
        if (count < duration) {
            count++;
            if ((count - 1) / framesPerSecond != count / framesPerSecond) {
                imageCircle.sendToFront();
                imageCount.setLabel("" + (duration - count) / framesPerSecond);
                imageCount.sendToFront();
            }
            return true;
        }
        return false;
    }
}