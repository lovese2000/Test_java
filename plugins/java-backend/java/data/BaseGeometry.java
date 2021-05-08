package data;

import java.util.Arrays;
import java.util.List;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2020/11/23
 */
public class BaseGeometry {
    String type;
    String uuid;
    List<Double> matrix;


    @Override
    public String toString() {
        return "Geometry{" +
                "type='" + type + '\'' +
                ", uuid='" + uuid + '\'' +
                ", matrix=" + matrix +
                '}';
    }
}

