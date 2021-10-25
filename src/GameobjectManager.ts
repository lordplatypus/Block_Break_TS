import { Gameobject } from "./Gameobject";

class GameobjectManager
{
    gameobjects_: Gameobject[];
    
    constructor()
    {
        this.gameobjects_ = [];
    }

    Update(delta_time: number)
    {
        this.gameobjects_.forEach(object => object.Update(delta_time));
    }

    Draw(ctx: CanvasRenderingContext2D | null)
    {
        //this.gameobjects_.forEach(object => object.Draw(ctx));
        for (var i = 0; i < this.gameobjects_.length; i++)
        {
            this.gameobjects_[i].Draw(ctx);
        }
    }

    Add(object: Gameobject)
    {
        this.gameobjects_.push(object);
        console.log(object);
    }

    RemoveDead()
    {
        // this.gameobjects_.forEach((object, index) => 
        // {
        //     if (object.Dead) this.gameobjects_.splice(index, 1);
        // });

        for (var i = 0; i < this.gameobjects_.length; i++)
        {
            if (this.gameobjects_[i].Dead) 
            {
                delete this.gameobjects_[i];
                this.gameobjects_.splice(i, 1);
            }
        }
    }

    SearchByName(name: string): Gameobject | null
    {
        this.gameobjects_.forEach(object => 
        {
            if (object.Name === name) return object; 
        });

        return null;
    }

    SearchByTag(tag: string): Gameobject | null
    {
        this.gameobjects_.forEach(object => 
        {
            if (object.Tag === tag) return object; 
        });

        return null;
    }

    SearchByID(ID: number): Gameobject | null
    {
        // console.log(ID);
        // this.gameobjects_.forEach(object => 
        // {
        //     if (object.ID === ID) return object; 
        //     console.log(object);
        // });

        // return null;

        for (var i = 0; i < this.gameobjects_.length; i++)
        {
            if (this.gameobjects_[i].ID === ID) return this.gameobjects_[i];
        }
        return null;
    }

    Clear()
    {
        this.gameobjects_ = [];
    }
}

export {GameobjectManager};