package sprinterTurtle;

import acm.graphics.GLabel;
import acm.graphics.GRect;
import java.awt.Color;
import java.awt.Font;
import javax.swing.JOptionPane;

public class Background {

    private final GRect background;
    private final int[] cheats = new int[7];
    private final GRect[] continuousLanes;
    private final GRect[][] fragmentedLanes;
    private final GLabel[] labels = new GLabel[3];

    Background(int boardHeight, int boardWidth, int labelSize, double laneGapHeight, int laneHeight, int lanes,
            int level, int lines, int lineWidth, int[] rgb, double trainHeight) {
        background = new GRect(0, 0, boardWidth, boardHeight);
        background.setColor(new Color(rgb[0], rgb[1], rgb[2]));
        background.setFillColor(new Color(rgb[0], rgb[1], rgb[2]));
        background.setFilled(true);
        continuousLanes = new GRect[lanes - lanes / 2];
        for (int i = 0; i < continuousLanes.length; i++) {
            if (i != lanes / 2) {
                continuousLanes[i] = new GRect(0, i * 2 * laneHeight + 2 * laneHeight - laneGapHeight / 2, boardWidth, laneGapHeight);
            }
            else {
                continuousLanes[i] = new GRect(0, i * 2 * laneHeight + laneHeight - laneGapHeight / 2, boardWidth, laneGapHeight);
            }
            continuousLanes[i].setColor(new Color(255 - rgb[0], 255 - rgb[1], 255 - rgb[2]));
            continuousLanes[i].setFillColor(new Color(255 - rgb[0], 255 - rgb[1], 255 - rgb[2]));
            continuousLanes[i].setFilled(true);
            continuousLanes[i].sendToFront();
        }
        fragmentedLanes = new GRect[lanes / 2][lines];
        for (int i = 0; i < fragmentedLanes.length; i++) {
            for (int j = 0; j < fragmentedLanes[i].length; j++) {
                if (j % 2 == 0) {
                    fragmentedLanes[i][j] = new GRect(j * lineWidth, i * 2 * laneHeight + laneHeight - laneGapHeight / 2, lineWidth, laneGapHeight);
                    fragmentedLanes[i][j].setColor(new Color(255 - rgb[0], 255 - rgb[1], 255 - rgb[2]));
                    fragmentedLanes[i][j].setFillColor(new Color(255 - rgb[0], 255 - rgb[1], 255 - rgb[2]));
                    fragmentedLanes[i][j].setFilled(true);
                    fragmentedLanes[i][j].sendToFront();
                }
            }
        }
        labels[0] = new GLabel("LEVEL:" + level);
        labels[1] = new GLabel("SAFE ZONE");
        labels[2] = new GLabel("CHEATS:" + cheats[0]);
        for (GLabel label : labels) {
            label.setColor(new Color(255 - rgb[0], 255 - rgb[1], 255 - rgb[2]));
            label.setFont(new Font(Font.DIALOG, Font.BOLD, labelSize));
            label.sendToFront();
        }
        labels[0].setLocation(0, boardHeight - (laneHeight - trainHeight / 2 - labels[0].getHeight() / 2) / 2);
        labels[1].setLocation(boardWidth / 2.0 - labels[1].getWidth() / 2, boardHeight - (laneHeight - trainHeight / 2 - labels[1].getHeight() / 2) / 2);
        labels[2].setLocation(boardWidth - labels[2].getWidth(), boardHeight - (laneHeight - trainHeight / 2 - labels[2].getHeight() / 2) / 2);
    }

    GRect getBackground() {
        return background;
    }

    GRect[] getContinuousLanes() {
        return continuousLanes;
    }

    GRect[][] getFragmentedLanes() {
        return fragmentedLanes;
    }

    GLabel[] getLabels() {
        return labels;
    }

    void refreshCheats(int boardHeight, int boardWidth, int index) {
        cheats[0]++;
        cheats[index]++;
        labels[2].setLabel("CHEATS:" + cheats[0]);
        labels[2].setLocation(boardWidth - labels[2].getWidth(), labels[2].getY());
    }

    void refreshLevel(int boardHeight, int boardWidth, int level) {
        labels[0].setLabel("LEVEL:" + level);
        labels[0].setLocation(0, labels[0].getY());
    }

    void refreshState(int boardHeight, int boardWidth, int type) {
        if (type == 0) {
            labels[1].setLabel("SAFE ZONE");
        }
        else {
            labels[1].setLabel("PAUSED");
        }
        labels[1].setLocation(boardWidth / 2.0 - labels[1].getWidth() / 2, labels[1].getY());
    }

    void viewCheats(String title) {
        String EOL = System.lineSeparator();
        JOptionPane.showMessageDialog(null, "Total cheats: " + cheats[0] + EOL + "Rockets used: " + cheats[1] + EOL
                + "Mouse hits: " + cheats[2] + EOL + "Mouse moves: " + cheats[3] + EOL + "Board clearings: " + cheats[4] + EOL
                + "Turtle resets: " + cheats[5] + EOL + "Turtle deaths: " + cheats[6], title, JOptionPane.INFORMATION_MESSAGE);
    }
}
