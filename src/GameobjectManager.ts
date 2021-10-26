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
        for (var i = 0; i < this.gameobjects_.length; i++)
        {
            this.gameobjects_[i].Update(delta_time);
        }
    }

    Draw(ctx: CanvasRenderingContext2D | null)
    {
        for (var i = 0; i < this.gameobjects_.length; i++)
        {
            this.gameobjects_[i].Draw(ctx);
        }
    }

    Add(object: Gameobject)
    {
        this.gameobjects_.push(object);
    }

    RemoveDead()
    {
        // for (auto i = gameObjects_.begin(); i != gameObjects_.end(); )
        // {
        //     if ((*i)->IsDead() && (*i)->GetTag() != "Player")
        //     {
        //         delete *i;
        //         i = gameObjects_.erase(i);
        //     }
        //     else i++;
        // }

        for (var i = 0; i < this.gameobjects_.length; )
        {
            if (this.gameobjects_[i].Dead) 
            {
                delete this.gameobjects_[i];
                this.gameobjects_.splice(i, 1);
            }
            else i++;
        }
    }

    SearchByName(name: string): Gameobject | null
    {
        for (var i = 0; i < this.gameobjects_.length; i++)
        {
            if (this.gameobjects_[i].Name === name) return this.gameobjects_[i];
        }
        return null;
    }

    SearchByTag(tag: string): Gameobject | null
    {
        for (var i = 0; i < this.gameobjects_.length; i++)
        {
            if (this.gameobjects_[i].Tag === tag) return this.gameobjects_[i];
        }
        return null;
    }

    SearchByID(ID: number): Gameobject | null
    {
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