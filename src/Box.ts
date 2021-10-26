import { Gameobject } from "./Gameobject";
import { Scene } from "./Scene";
import { Vector } from "./Vector";

class Box extends Gameobject
{
    private scene_: Scene;
    private size_: Vector;
    private color_: string;
    private columns_: number;
    private rows_: number;
    
    private targetPosition_: Vector;

    constructor(scene: Scene, name: string, tag: string, ID: number, position: Vector, size: Vector, color: string, columns: number, rows: number)
    {
        super();
        this.scene_ = scene;
        this.name_ = name;
        this.tag_ = tag;
        this.ID_ = ID;
        this.position_ = new Vector(position.x, position.y);
        this.targetPosition_ = new Vector(position.x, position.y);
        this.size_ = size;
        this.color_ = color;
        this.columns_ = columns;
        this.rows_ = rows;
    }

    public Update(delta_time: number) 
    {
        // if (this.ID_ < this.columns_ * (this.rows_ - 1))
        // {
        //     if (this.scene_.SearchByID(this.ID_ + this.columns_) === null)
        //     {
        //         this.ID_ += this.columns_;
        //         this.position_.y += this.size_.y; 
        //     }
        // }
        // else if (this.ID_ % this.columns_ !== 0)
        // {
        //     if (this.scene_.SearchByID(((this.ID_ - 1) % this.columns_) + (this.rows_ - 1) * this.columns_) === null)
        //     {
        //         this.ID_--;
        //         this.position_.x -= this.size_.x;
        //     }
        // }

        if (this.targetPosition_.x === this.position_.x && this.targetPosition_.y === this.position_.y) return;
        if (this.position_.x - this.targetPosition_.x < 0.01) this.position_.x = this.targetPosition_.x;
        if (this.targetPosition_.y - this.position_.y < 0.01) this.position_.y = this.targetPosition_.y;
        this.position_ = this.Lerp(this.position_, this.targetPosition_, delta_time * 10.0);
    }

    public Draw(ctx: CanvasRenderingContext2D | null) 
    {
        if (ctx === null) return;
        ctx.fillStyle = this.color_;
        ctx.fillRect(this.position_.x, this.position_.y, this.size_.x, this.size_.y);
    }

    public Translate(position: Vector, ID: number)
    {
        this.targetPosition_ = new Vector(position.x, position.y);
        this.ID_ = ID;
    }

    private Lerp(v1: Vector, v2: Vector, time: number) : Vector
    {
        var v = v1;

        v.x = (1 - time) * v1.x + time * v2.x;
        v.y = (1 - time) * v1.y + time * v2.y;

        return v;
    }

    get Color() {return this.color_};
    get TargetPosition() {return this.targetPosition_};
}

export {Box};