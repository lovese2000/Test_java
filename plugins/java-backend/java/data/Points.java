package data;

import wblut.geom.WB_Point;

import java.util.ArrayList;
import java.util.List;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2020/12/30
 */
public class Points extends BaseGeometry {
    int size;
    int count;

    List<Double> position;

    public List<WB_Point> getWB_Points() {
        List<WB_Point> pts = new ArrayList<>();
        for(int i = 0; i < count; ++ i) {
            double[] pt = new double[size];
            for(int j = 0; j < size; ++ j) {
                pt[j] = position.get(i*size + j);
            }
            pts.add(new WB_Point(pt));
        }
        return pts;
    }

    @Override
    public String toString() {
        return "Points{" +
                "size=" + size +
                ", count=" + count +
                ", position=" + position +
                ", type='" + type + '\'' +
                ", matrix=" + matrix +
                '}';
    }
}
