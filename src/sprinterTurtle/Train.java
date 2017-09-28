package sprinterTurtle;

import acm.graphics.GRect;
import java.awt.Color;

public class Train {

    private int count;
    private GRect image;
    private boolean usage;
    private int warningCount;

    Train() {
        count = 0;
        image = null;
        usage = false;
        warningCount = 0;
    }

    void create(int boardWidth, double height, int lane, int laneHeight) {
        count = 0;
        image = new GRect(0, 2 * (lane + 1) * laneHeight - height / 2, boardWidth, height);
        image.setColor(Color.YELLOW);
        image.setFillColor(Color.YELLOW);
        image.setFilled(true);
        image.sendToFront();
        usage = true;
        warningCount = 1;
    }

    void dispose() {
        count = 0;
        image = null;
        usage = false;
        warningCount = 0;
    }

    int getCount() {
        return count;
    }

    void setCount(int count) {
        this.count = count;
    }

    GRect getImage() {
        return image;
    }

    int getWarningCount() {
        return warningCount;
    }

    boolean isUsage() {
        return usage;
    }

    void update(int warningDuration) {
        if (warningCount != 0) {
            if (warningCount < warningDuration) {
                warningCount++;
            }
            else {
                count = 1;
                image.setColor(Color.RED);
                image.setFillColor(Color.RED);
                image.sendToFront();
                warningCount = 0;
            }
        }
    }
}
