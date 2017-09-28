package sprinterTurtle;

import acm.graphics.GRoundRect;
import java.awt.Color;

public class Vehicle {

    private static double vehicleSpeed;
    private static double vehicleSpeedIncrement;

    static double getVehicleSpeed() {
        return vehicleSpeed;
    }

    static void setVehicleSpeed(double VehicleSpeed_) {
        vehicleSpeed = VehicleSpeed_;
    }

    static double getVehicleSpeedIncrement() {
        return vehicleSpeedIncrement;
    }

    static void setVehicleSpeedIncrement(double VehicleSpeedIncrement_) {
        vehicleSpeedIncrement = VehicleSpeedIncrement_;
    }

    private final GRoundRect image;
    private final int lane;
    private double speed;
    private final double width;

    Vehicle(double arc, int boardWidth, int direction, double height, double highestArc, double highestHeight,
            double highestSpeed, double highestWidth, int lane, int laneHeight, double lowestArc,
            double lowestHeight, double lowestSpeed, double lowestWidth, double width) {
        Color color = new Color((float) Math.random(), (float) Math.random(), (float) Math.random());
        height *= (highestHeight - lowestHeight) * Math.random() + lowestHeight;
        double positionX = -width, positionY = lane * laneHeight + (laneHeight - height) / 2;
        if (direction == -1) {
            positionX = boardWidth;
        }
        image = new GRoundRect(positionX, positionY, width, height, arc * ((highestArc - lowestArc) * Math.random() + lowestArc));
        image.setColor(color);
        image.setFillColor(color);
        image.setFilled(true);
        image.sendToFront();
        this.lane = lane;
        this.speed = direction * ((highestSpeed - lowestSpeed) * Math.random() + lowestSpeed);
        this.width = width;
    }

    GRoundRect getImage() {
        return image;
    }

    int getLane() {
        return lane;
    }

    double getSpeed() {
        return speed;
    }

    void setSpeed(double speed) {
        this.speed = speed;
    }

    double getWidth() {
        return width;
    }
}
