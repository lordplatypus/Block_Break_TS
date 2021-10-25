class Vector
{
    public x_: number;
    public y_: number;

    constructor(x: number, y: number)
    {
        this.x_ = x;
        this.y_ = y;
    }

    set x(x: number) {this.x_ = x;}
    get x() {return this.x_;}
    set y(y: number) {this.y_ = y;}
    get y() {return this.y_;}


}

export {Vector};