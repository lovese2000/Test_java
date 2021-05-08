package data;

import com.google.gson.Gson;
import com.google.gson.JsonElement;

import java.util.ArrayList;
import java.util.List;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2020/11/23
 */
public class ArchiJSON {
    String id;
    List<JsonElement> geometryElements;
    Property properties;

    List<BaseGeometry> geometries;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<JsonElement> getGeometryElements() {
        return geometryElements;
    }

    public void setGeometryElements(List<JsonElement> geometryElements) {
        this.geometryElements = geometryElements;
    }

    public Property getProperties() {
        return properties;
    }

    public void setProperties(Property properties) {
        this.properties = properties;
    }

    public List<BaseGeometry> getGeometries() {
        return geometries;
    }

    public void setGeometries(List<BaseGeometry> geometries) {
        this.geometries = geometries;
    }

    public void parseGeometryElements(Gson gson) {
        this.geometries = new ArrayList<>();

        for(JsonElement e : this.geometryElements) {
            BaseGeometry geom = fromJSONElements(e, gson);
            System.out.println(geom);
            this.geometries.add(geom);
        }
    }

    private BaseGeometry fromJSONElements(JsonElement e, Gson gson) {
        String type = e.getAsJsonObject().get("type").getAsString();
        switch (type) {
            case "Points":
                return gson.fromJson(e, Points.class);
            case "Plane":
                return gson.fromJson(e, Plane.class);
            default:
                return null;
        }
    }


    @Override
    public String toString() {
        return "ArchiJSON{" +
                "id='" + id + '\'' +
                ", geometries=" + geometries +
                ", properties=" + properties +
                '}';
    }
}
