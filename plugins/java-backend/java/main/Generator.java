package main;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import converter.WB_Converter;
import geometry.Segments;
import processing.core.PApplet;
import sun.rmi.runtime.Log;
import wblut.geom.*;
import wblut.processing.WB_Render3D;

import java.util.ArrayList;
import java.util.List;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2021/01/02
 */
public class Generator {

    private boolean draw = false;

    public List<WB_Point> pts;
    public WB_Polygon plane;
    public List<WB_Polygon> plys;


    public void draw(PApplet app) {
        if(draw) {
            WB_Render3D render = new WB_Render3D(app);

            app.stroke(0);
            app.fill(255);
            render.drawPoint(pts, 2);
            render.drawPolygonEdges(plane);
            render.drawPolygonEdges(plys);
        }
    }

    public void calcVoronoi(double d) {
        WB_Voronoi2D vor = WB_VoronoiCreator.getClippedVoronoi2D(pts, plane, d);
        plys = new ArrayList<>();

        for(WB_VoronoiCell2D cell: vor.getCells()){
            plys.add(cell.getPolygon());
        }

        draw = true;
    }

    public ArchiJSON toArchiJSON(String clientID, Gson gson) {
        ArchiJSON ret = new ArchiJSON();
        ret.setId(clientID);
        List<JsonElement> elements = new ArrayList<>();
        for(WB_Polygon ply : plys) {
            Segments p = WB_Converter.toSegments(ply);
            elements.add(gson.toJsonTree(p));
        }
        ret.setGeometryElements(elements);
        return ret;
    }

}
