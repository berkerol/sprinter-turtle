package sprinterTurtle;

import acm.graphics.GCanvas;
import acm.graphics.GObject;
import acm.graphics.GRect;
import java.awt.Dimension;
import java.awt.Toolkit;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.MouseMotionAdapter;
import java.awt.event.WindowEvent;
import java.awt.event.WindowFocusListener;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Random;
import java.util.Scanner;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.SwingUtilities;

public class SprinterTurtle {

    private static final GCanvas CANVAS = new GCanvas();
    private static final ArrayList<Explosion> EXPLOSIONS = new ArrayList<>();
    private static final ArrayList<Meteor> METEORS = new ArrayList<>();
    private static final ArrayList<Rocket> ROCKETS = new ArrayList<>();
    private static final ArrayList<Vehicle> VEHICLES = new ArrayList<>();
    private static Background background;
    private static int boardHeight;
    private static int boardWidth;
    private static JFrame frame;
    private static boolean pause = false;
    private static Train[] trains;
    private static Turtle turtle;

    public static void main(String[] args) throws InterruptedException {
        String title = "SprinterTurtle";
        Dimension dimension = Toolkit.getDefaultToolkit().getScreenSize();
        int[] dimensions = {(int) dimension.getWidth(), (int) dimension.getHeight()};
        Scanner input = null;
        try {
            input = new Scanner(new File("SprinterTurtleConfiguration.ini"));
        }
        catch (FileNotFoundException ex) {
            JOptionPane.showMessageDialog(null, ex, title, JOptionPane.ERROR_MESSAGE);
            return;
        }
        int laneHeight = input.nextInt();
        input.nextLine();
        String[] laneOptions = makeOptions((dimensions[1]) / laneHeight - 1);
        int lanes = Integer.parseInt((String) JOptionPane.showInputDialog(null, "Choose the number of the lanes.", title,
                JOptionPane.QUESTION_MESSAGE, null, laneOptions, laneOptions[laneOptions.length - 1]));
        boardHeight = (lanes + 1) * laneHeight;
        int lineWidth = input.nextInt();
        input.nextLine();
        String[] lineOptions = makeOptions((dimensions[0]) / lineWidth);
        int lines = Integer.parseInt((String) JOptionPane.showInputDialog(null, "Choose the number of the lines.", title,
                JOptionPane.QUESTION_MESSAGE, null, lineOptions, lineOptions[lineOptions.length - 1]));
        boardWidth = lines * lineWidth;
        int framesPerSecond = input.nextInt();
        input.nextLine();
        int pixelsPerSecond = input.nextInt();
        input.nextLine();
        int[] backgroundColor = {input.nextInt(), input.nextInt(), input.nextInt()};
        input.nextLine();
        boolean deathBehavior = input.nextInt() != 0;
        input.nextLine();
        int explosionAlpha = input.nextInt();
        input.nextLine();
        int explosionDuration = input.nextInt() * framesPerSecond;
        input.nextLine();
        double explosionSize = input.nextDouble() * laneHeight;
        input.nextLine();
        boolean keyboard = input.nextInt() != 0;
        input.nextLine();
        int labelSize = (int) (input.nextDouble() * laneHeight);
        input.nextLine();
        double laneGapHeight = input.nextDouble() * laneHeight;
        input.nextLine();
        int level = input.nextInt();
        input.nextLine();
        int meteorAlpha = input.nextInt();
        input.nextLine();
        int meteorDuration = input.nextInt() * framesPerSecond;
        input.nextLine();
        double meteorHighestSize = input.nextDouble();
        input.nextLine();
        double meteorLowestSize = input.nextDouble();
        input.nextLine();
        int meteorProbability = (int) (input.nextDouble() * framesPerSecond);
        input.nextLine();
        double meteorSize = input.nextDouble() * laneHeight;
        input.nextLine();
        double rocketSize = input.nextDouble() * laneHeight;
        input.nextLine();
        double rocketSpeed = input.nextInt() * 1.0 * pixelsPerSecond / framesPerSecond;
        input.nextLine();
        int trainDuration = input.nextInt() * framesPerSecond;
        input.nextLine();
        double trainHeight = input.nextDouble() * laneHeight;
        input.nextLine();
        int trainProbability = (int) (input.nextDouble() * framesPerSecond);
        input.nextLine();
        int trainWarningDuration = input.nextInt() * framesPerSecond;
        input.nextLine();
        int turtleMaxTurn = input.nextInt();
        input.nextLine();
        int turtleSize = (int) (input.nextDouble() * laneHeight);
        input.nextLine();
        double turtleSpeedIncrement = input.nextDouble();
        input.nextLine();
        double turtleSpeed = (input.nextInt() + turtleSpeedIncrement * (level - 1)) * pixelsPerSecond / framesPerSecond;
        input.nextLine();
        double turtleTurn = input.nextInt() * 1.0 * pixelsPerSecond / framesPerSecond;
        input.nextLine();
        double vehicleHeight = input.nextDouble() * laneHeight;
        input.nextLine();
        double vehicleArc = input.nextDouble() * vehicleHeight;
        input.nextLine();
        double vehicleHighestArc = input.nextDouble();
        input.nextLine();
        double vehicleHighestHeight = input.nextDouble();
        input.nextLine();
        double vehicleHighestSpeed = input.nextDouble();
        input.nextLine();
        double vehicleHighestWidth = input.nextDouble();
        input.nextLine();
        int vehicleLongProbability = input.nextInt();
        input.nextLine();
        double vehicleLongWidthMultiplier = input.nextDouble();
        input.nextLine();
        double vehicleLowestArc = input.nextDouble();
        input.nextLine();
        double vehicleLowestHeight = input.nextDouble();
        input.nextLine();
        double vehicleLowestSpeed = input.nextDouble();
        input.nextLine();
        double vehicleLowestWidth = input.nextDouble();
        input.nextLine();
        int vehicleProbability = (int) (input.nextDouble() * framesPerSecond);
        input.nextLine();
        Vehicle.setVehicleSpeedIncrement(input.nextDouble());
        input.nextLine();
        Vehicle.setVehicleSpeed((input.nextInt() + Vehicle.getVehicleSpeedIncrement() * (level - 1)) * pixelsPerSecond / framesPerSecond);
        input.nextLine();
        double vehicleWidth = input.nextDouble() * lineWidth;
        input.close();
        Random random = new Random();
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                frame = new JFrame(title);
                frame.setSize(boardWidth, boardHeight);
                frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
                frame.setLocationRelativeTo(null);
                frame.setVisible(true);
                frame.add(CANVAS);
            }
        });
        background = new Background(boardHeight, boardWidth, labelSize, laneGapHeight, laneHeight,
                lanes, level, lines, lineWidth, backgroundColor, trainHeight);
        CANVAS.add(background.getBackground());
        for (GRect continuousLane : background.getContinuousLanes()) {
            CANVAS.add(continuousLane);
        }
        for (GRect[] fragmentedLane : background.getFragmentedLanes()) {
            for (int j = 0; j < fragmentedLane.length; j++) {
                if (j % 2 == 0) {
                    CANVAS.add(fragmentedLane[j]);
                }
            }
        }
        for (int i = 0; i < background.getLabels().length; i++) {
            CANVAS.add(background.getLabels()[i]);
        }
        turtle = new Turtle(turtleMaxTurn, boardWidth / 2, boardHeight - turtleSize / 2, turtleSize, turtleSpeed, turtleSpeedIncrement);
        CANVAS.add(turtle.getImage());
        int trainLanes = lanes / 2;
        trains = new Train[trainLanes];
        for (int i = 0; i < trainLanes; i++) {
            trains[i] = new Train();
        }
        frame.addWindowFocusListener(new WindowFocusListener() {
            @Override
            public void windowGainedFocus(WindowEvent e) {
                pause = false;
            }

            @Override
            public void windowLostFocus(WindowEvent e) {
                pause = true;
            }
        });
        CANVAS.addMouseListener(new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent e) {
                if (e.getButton() == MouseEvent.BUTTON1 && keyboard) {
                    createExplosions(explosionAlpha, new GRect(e.getX(), e.getY(), 1, 1), explosionSize);
                    background.refreshCheats(boardHeight, boardWidth, 2);
                }
                if (e.getButton() == MouseEvent.BUTTON3 && keyboard) {
                    double x = e.getX() - turtle.getImage().getX(), y = e.getY() - turtle.getImage().getY();
                    double norm = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                    createRockets(1, rocketSize, rocketSize, x / norm * rocketSpeed, y / norm * rocketSpeed);
                }
            }
        });
        CANVAS.addMouseMotionListener(new MouseMotionAdapter() {
            @Override
            public void mouseMoved(MouseEvent e) {
                if ((!pause && !keyboard) || (pause && e.isControlDown())) {
                    double x = e.getX(), y = e.getY();
                    if (turtle.getImage().getY() - turtle.getImage().getTurtleSize() / 2.0 < 0) {
                        y = turtle.getImage().getY() + 1;
                    }
                    if (turtle.getImage().getY() + turtle.getImage().getTurtleSize() / 2.0 > boardHeight) {
                        y = turtle.getImage().getY() - 1;
                    }
                    if (turtle.getImage().getX() - turtle.getImage().getTurtleSize() / 3.0 < 0) {
                        x = turtle.getImage().getX() + 1;
                    }
                    if (turtle.getImage().getX() + turtle.getImage().getTurtleSize() / 3.0 > boardWidth) {
                        x = turtle.getImage().getX() - 1;
                    }
                    turtle.getImage().setLocation(x, y);
                }
            }
        });
        KeyListener keyListener = new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                int keyCode = e.getKeyCode();
                if (keyCode == KeyEvent.VK_W && !pause && keyboard) {
                    turtle.setSpeedY(-turtleSpeed);
                }
                if (keyCode == KeyEvent.VK_S && !pause && keyboard) {
                    turtle.setSpeedY(turtleSpeed);
                }
                if (keyCode == KeyEvent.VK_A && !pause && keyboard) {
                    turtle.setSpeedX(-turtleSpeed);
                    if (!turtle.isTouchedTop()) {
                        turtle.setTurnLeft(turtleTurn);
                    }
                    else {
                        turtle.setTurnRight(turtleTurn);
                    }
                }
                if (keyCode == KeyEvent.VK_D && !pause && keyboard) {
                    turtle.setSpeedX(turtleSpeed);
                    if (!turtle.isTouchedTop()) {
                        turtle.setTurnRight(turtleTurn);
                    }
                    else {
                        turtle.setTurnLeft(turtleTurn);
                    }
                }
                if (keyCode == KeyEvent.VK_P) {
                    pause = !pause;
                }
                if (keyCode == KeyEvent.VK_I) {
                    background.viewCheats(title);
                }
                if (keyCode == KeyEvent.VK_R) {
                    turtle.reset();
                    background.refreshCheats(boardHeight, boardWidth, 5);
                }
                if (keyCode == KeyEvent.VK_C) {
                    createRockets(4, rocketSize, rocketSize, 0 / Math.sqrt(0), 0 / Math.sqrt(0));
                }
                if (keyCode == KeyEvent.VK_UP) {
                    createRockets(1, rocketSize, rocketSize, 0, -rocketSpeed);
                }
                if (keyCode == KeyEvent.VK_DOWN) {
                    createRockets(1, rocketSize, rocketSize, 0, rocketSpeed);
                }
                if (keyCode == KeyEvent.VK_LEFT) {
                    createRockets(1, rocketSize, rocketSize, -rocketSpeed, 0);
                }
                if (keyCode == KeyEvent.VK_RIGHT) {
                    createRockets(1, rocketSize, rocketSize, rocketSpeed, 0);
                }
            }

            @Override
            public void keyReleased(KeyEvent e) {
                int keyCode = e.getKeyCode();
                if (keyCode == KeyEvent.VK_W && !pause && keyboard) {
                    turtle.setSpeedY(0);
                }
                if (keyCode == KeyEvent.VK_S && !pause && keyboard) {
                    turtle.setSpeedY(0);
                }
                if (keyCode == KeyEvent.VK_A && !pause && keyboard) {
                    turtle.setSpeedX(0);
                    if (!turtle.isTouchedTop()) {
                        turtle.setTurnLeft(0);
                        turtle.getImage().setDirection(90);
                    }
                    else {
                        turtle.setTurnRight(0);
                        turtle.getImage().setDirection(270);
                    }
                }
                if (keyCode == KeyEvent.VK_D && !pause && keyboard) {
                    turtle.setSpeedX(0);
                    if (!turtle.isTouchedTop()) {
                        turtle.setTurnRight(0);
                        turtle.getImage().setDirection(90);
                    }
                    else {
                        turtle.setTurnLeft(0);
                        turtle.getImage().setDirection(270);
                    }
                }
                if (keyCode == KeyEvent.VK_CONTROL) {
                    background.refreshCheats(boardHeight, boardWidth, 3);
                }
            }
        };
        frame.addKeyListener(keyListener);
        CANVAS.addKeyListener(keyListener);
        long start = System.nanoTime();
        while (processMeteors(deathBehavior, meteorDuration, explosionAlpha, explosionSize, framesPerSecond, title)
                && processTrains(deathBehavior, trainDuration, title, trainWarningDuration) && processVehicles(deathBehavior, title)) {
            createMeteors(meteorAlpha, meteorDuration, framesPerSecond, meteorHighestSize, laneHeight, lanes,
                    meteorLowestSize, meteorProbability, random, meteorSize);
            createTrains(trainHeight, laneHeight, trainLanes, trainProbability, random);
            createVehicles(vehicleArc, vehicleHeight, vehicleHighestArc, vehicleHighestHeight, vehicleHighestSpeed,
                    vehicleHighestWidth, laneHeight, lanes, vehicleLongProbability, vehicleLongWidthMultiplier, vehicleLowestArc,
                    vehicleLowestHeight, vehicleLowestSpeed, vehicleLowestWidth, vehicleProbability, random, vehicleWidth);
            processExplosions(explosionDuration);
            processRockets(explosionAlpha, explosionSize);
            if (turtle.update(boardHeight, boardWidth, framesPerSecond, keyboard, laneHeight, lanes, pause, pixelsPerSecond)) {
                background.refreshLevel(boardHeight, boardWidth, ++level);
            }
            if (pause) {
                background.refreshState(boardHeight, boardWidth, 1);
                while (pause) {
                    Thread.sleep(500);
                }
                background.refreshState(boardHeight, boardWidth, 0);
            }
            Thread.sleep(Math.max(0, (1000000000 / framesPerSecond - (System.nanoTime() - start)) / 1000000));
            start = System.nanoTime();
        }
        frame.dispose();
    }

    private static boolean createExplosions(int alpha, GObject object, double size) {
        int hits = 0;
        for (int i = 0; i < VEHICLES.size(); i++) {
            Vehicle vehicle = VEHICLES.get(i);
            if (vehicle.getImage().getBounds().intersects(object.getBounds())) {
                hits++;
                CANVAS.remove(vehicle.getImage());
                VEHICLES.remove(vehicle);
                i--;
            }
        }
        for (Train train : trains) {
            if (train.isUsage() && train.getWarningCount() == 0 && train.getImage().getBounds().intersects(object.getBounds())) {
                hits++;
                CANVAS.remove(train.getImage());
                train.dispose();
            }
        }
        if (hits != 0) {
            Explosion explosion = new Explosion(alpha, hits, object.getX(), object.getY(), size);
            for (int i = 0; i < explosion.getImage().length; i++) {
                CANVAS.add(explosion.getImage()[i]);
            }
            EXPLOSIONS.add(explosion);
            return true;
        }
        return false;
    }

    private static void createMeteors(int alpha, int duration, int framesPerSecond, double highestSize, int laneHeight,
            int lanes, double lowestSize, int probability, Random random, double size) {
        if (random.nextInt(probability) < 1) {
            Meteor meteor = new Meteor(alpha, boardWidth, duration, framesPerSecond, highestSize, lanes, laneHeight, lowestSize, random, size);
            for (Meteor image : METEORS) {
                if (meteor.getImageCircle().getBounds().intersects(image.getImageCircle().getBounds())) {
                    return;
                }
            }
            CANVAS.add(meteor.getImageCircle());
            CANVAS.add(meteor.getImageCount());
            METEORS.add(meteor);
        }
    }

    private static void createRockets(int index, double sizeX, double sizeY, double speedX, double speedY) {
        background.refreshCheats(boardHeight, boardWidth, index);
        Rocket rocket = new Rocket(turtle.getImage().getX(), turtle.getImage().getY(), sizeX, sizeY, speedX, speedY);
        CANVAS.add(rocket.getImage());
        ROCKETS.add(rocket);
    }

    private static void createTrains(double height, int laneHeight, int lanes, int probability, Random random) {
        if (random.nextInt(probability) < 1) {
            int lane = random.nextInt(lanes);
            if (!trains[lane].isUsage()) {
                trains[lane].create(boardWidth, height, lane, laneHeight);
                CANVAS.add(trains[lane].getImage());
            }
        }
    }

    private static void createVehicles(double arc, double height, double highestArc, double highestHeight, double highestSpeed,
            double highestWidth, int laneHeight, int lanes, int longProbability, double longWidthMultiplier, double lowestArc,
            double lowestHeight, double lowestSpeed, double lowestWidth, int probability, Random random, double width) {
        if (random.nextInt(probability) < 1) {
            boolean[] leftLanes = new boolean[lanes], rightLanes = new boolean[lanes];
            width *= (highestWidth - lowestWidth) * Math.random() + lowestWidth;
            if (random.nextInt(longProbability) < 1) {
                width *= longWidthMultiplier;
            }
            GRect leftRect = new GRect(-width, 0, width, boardHeight), rightRect = new GRect(boardWidth, 0, width, boardHeight);
            for (Vehicle vehicle : VEHICLES) {
                if (vehicle.getImage().getBounds().intersects(leftRect.getBounds())) {
                    leftLanes[vehicle.getLane()] = true;
                }
                if (vehicle.getImage().getBounds().intersects(rightRect.getBounds())) {
                    rightLanes[vehicle.getLane()] = true;
                }
            }
            int direction = random.nextInt(2), lane = random.nextInt(lanes);
            if (direction == 0) {
                direction = -1;
            }
            if ((direction != 1 || !leftLanes[lane]) && (direction != -1 || !rightLanes[lane])) {
                Vehicle vehicle = new Vehicle(arc, boardWidth, direction, height, highestArc, highestHeight, highestSpeed,
                        highestWidth, lane, laneHeight, lowestArc, lowestHeight, lowestSpeed, lowestWidth, width);
                CANVAS.add(vehicle.getImage());
                VEHICLES.add(vehicle);
            }
        }
    }

    private static boolean hitTurtle(boolean deathBehavior, GObject object, String title, String type) {
        if (object.getBounds().intersects(new GRect(turtle.getImage().getX() - turtle.getImage().getTurtleSize() / 3.0,
                turtle.getImage().getY() - turtle.getImage().getTurtleSize() / 2.0,
                (double) turtle.getImage().getTurtleSize() / 4 * 3, turtle.getImage().getTurtleSize()).getBounds())) {
            JOptionPane.showMessageDialog(null, type + " hit, you died!", title, JOptionPane.ERROR_MESSAGE);
            if (!deathBehavior) {
                return true;
            }
            turtle.reset();
            background.refreshCheats(boardHeight, boardWidth, 6);
        }
        return false;
    }

    private static String[] makeOptions(int limit) {
        String[] list = new String[limit];
        for (int i = 1; i <= limit; i++) {
            list[i - 1] = "" + i;
        }
        return list;
    }

    private static void processExplosions(int duration) {
        for (int i = 0; i < EXPLOSIONS.size(); i++) {
            Explosion explosion = EXPLOSIONS.get(i);
            if (explosion.update(duration)) {
                for (int j = 0; j < explosion.getImage().length; j++) {
                    CANVAS.remove(explosion.getImage()[j]);
                }
                EXPLOSIONS.remove(explosion);
                i--;
            }
        }
    }

    private static boolean processMeteors(boolean deathBehavior, int duration, int explosionAlpha, double explosionSize, int framesPerSecond, String title) {
        for (int i = 0; i < METEORS.size(); i++) {
            Meteor meteor = METEORS.get(i);
            if (meteor.getCount() != 0) {
                if (!meteor.update(duration, framesPerSecond)) {
                    CANVAS.remove(meteor.getImageCircle());
                    CANVAS.remove(meteor.getImageCount());
                    METEORS.remove(meteor);
                    i--;
                    createExplosions(explosionAlpha, meteor.getImageCircle(), explosionSize);
                    if (hitTurtle(deathBehavior, meteor.getImageCircle(), title, "Meteor")) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    private static void processRockets(int explosionAlpha, double explosionSize) {
        for (int i = 0; i < ROCKETS.size(); i++) {
            Rocket rocket = ROCKETS.get(i);
            if (createExplosions(explosionAlpha, rocket.getImage(), explosionSize)) {
                CANVAS.remove(rocket.getImage());
                ROCKETS.remove(rocket);
                i--;
            }
            else {
                double rocketX = rocket.getImage().getX() + rocket.getSpeedX(), rocketY = rocket.getImage().getY() + rocket.getSpeedY();
                if (rocketX < 0 || rocketX > boardWidth || rocketY < 0 || rocketY > boardHeight) {
                    CANVAS.remove(rocket.getImage());
                    ROCKETS.remove(rocket);
                    i--;
                }
                else {
                    rocket.getImage().setLocation(rocketX, rocketY);
                }
            }
        }
    }

    private static boolean processTrains(boolean deathBehavior, int duration, String title, int warningDuration) {
        for (Train train : trains) {
            if (train.isUsage()) {
                train.update(warningDuration);
                if (train.getCount() != 0) {
                    if (train.getCount() < duration) {
                        train.setCount(train.getCount() + 1);
                        if (hitTurtle(deathBehavior, train.getImage(), title, "Train")) {
                            return false;
                        }
                    }
                    else {
                        CANVAS.remove(train.getImage());
                        train.dispose();
                    }
                }
            }
        }
        return true;
    }

    private static boolean processVehicles(boolean deathBehavior, String title) {
        for (int i = 0; i < VEHICLES.size(); i++) {
            Vehicle vehicle1 = VEHICLES.get(i);
            for (int j = 0; j < VEHICLES.size(); j++) {
                Vehicle vehicle2 = VEHICLES.get(j);
                if (i != j && vehicle1.getImage().getBounds().intersects(vehicle2.getImage().getBounds())) {
                    double speed = vehicle1.getSpeed();
                    vehicle1.setSpeed(vehicle2.getSpeed());
                    vehicle2.setSpeed(speed);
                    if (vehicle1.getImage().getX() < vehicle2.getImage().getX()) {
                        vehicle1.getImage().setLocation(vehicle2.getImage().getX() - vehicle1.getWidth(), vehicle1.getImage().getY());
                    }
                    else {
                        vehicle2.getImage().setLocation(vehicle1.getImage().getX() - vehicle2.getWidth(), vehicle2.getImage().getY());
                    }
                }
            }
            double vehicleX = vehicle1.getImage().getX() + vehicle1.getSpeed() * Vehicle.getVehicleSpeed();
            if (vehicleX < -vehicle1.getWidth() || vehicleX > boardWidth) {
                CANVAS.remove(vehicle1.getImage());
                VEHICLES.remove(vehicle1);
                i--;
            }
            else {
                vehicle1.getImage().setLocation(vehicleX, vehicle1.getImage().getY());
                if (hitTurtle(deathBehavior, vehicle1.getImage(), title, "Vehicle")) {
                    return false;
                }
            }
        }
        return true;
    }
}