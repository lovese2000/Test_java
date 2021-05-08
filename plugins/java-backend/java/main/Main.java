package main;

import io.socket.client.IO;
import processing.core.PApplet;

import java.net.*;
import java.util.Enumeration;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2020/11/23
 */
public class Main {
    public static void main(String[] args) {
        Server server = new Server(args);

        if(args.length == 0) {
            PApplet.main("main.Show");
        }
    }
}
