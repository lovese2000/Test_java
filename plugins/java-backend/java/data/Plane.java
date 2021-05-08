package data;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2020/12/30
 */
public class Plane extends BaseGeometry {
    Vector3 position;
    Param param;

    @Override
    public String toString() {
        return "Plane{" +
                "position=" + position +
                ", param=" + param +
                ", type='" + type + '\'' +
                ", matrix=" + matrix +
                '}';
    }
}

class Vector3 {
    double x;
    double y;
    double z;

    @Override
    public String toString() {
        return "Vector3{" +
                "x=" + x +
                ", y=" + y +
                ", z=" + z +
                '}';
    }
}

class Param {
    double w;
    double h;

    @Override
    public String toString() {
        return "Param{" +
                "w=" + w +
                ", h=" + h +
                '}';
    }
}
