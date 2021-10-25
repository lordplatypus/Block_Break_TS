import { Gameobject } from "./Gameobject";
import { Scene } from "./Scene";
import { Vector } from "./Vector";

class Box extends Gameobject
{
    private scene_: Scene;
    private size_: Vector;
    private color_: string;

    constructor(scene: Scene, name: string, tag: string, ID: number, position: Vector, size: Vector, color: string)
    {
        super();
        this.scene_ = scene;
        this.name_ = name;
        this.tag_ = tag;
        this.ID_ = ID;
        this.position_ = position;
        this.size_ = size;
        this.color_ = color;
    }

    public Update(delta_time: number) 
    {
    }

    public Draw(ctx: CanvasRenderingContext2D | null) 
    {
        if (ctx === null) return;
        ctx.fillStyle = this.color_;
        ctx.fillRect(this.position_.x, this.position_.y, this.size_.x, this.size_.y);
    }
}

export {Box};