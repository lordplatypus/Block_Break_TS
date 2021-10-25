import { Vector } from "./Vector";

class Gameobject
{
    protected name_: string = "";
    protected tag_: string = "";
    protected ID_: number = 0;
    protected position_: Vector = new Vector(0, 0);

    private isDead_: boolean = false;

    public Update(delta_time: number) {}
    public Draw(ctx: CanvasRenderingContext2D | null) {}

    set Name(name: string) {this.name_ = name;}
    get Name() {return this.name_;}
    set Tag(tag: string) {this.tag_ = tag;}
    get Tag() {return this.tag_;}
    set ID(ID: number) {this.ID_ = ID;}
    get ID() {return this.ID_;}
    set Dead(isDead: boolean) {this.isDead_ = isDead;}
    get Dead() {return this.isDead_;}
    set Position(position: Vector) {this.position_ = position;}
    get Position() {return this.position_;}
}

export {Gameobject};