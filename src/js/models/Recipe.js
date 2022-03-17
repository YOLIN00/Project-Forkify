import axios from 'axios';

export default class Recipe{
    
    constructor(id){
        this.id=id;
    }
    
    async getRecipe(){
        try{
            const res=await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            //console.log(res);
            this.title=res.data.recipe.title;
            this.author=res.data.recipe.author;
            this.img=res.data.recipe.image_url;
            this.url=res.data.recipe.source_url;
            this.ingredients=res.data.recipe.ingredients;
            console.log(this.ingredients);
        }catch(error){
            console.log(error);
        }
    }
    
    calcTime(){
         const numIng=this.ingredients.length;
         const period=Math.ceil(numIng/3);
         this.time=period*3;
    }
    
    calcServings(){
        this.servings=4;
    }
    
    parseIngredients(){
        
        const unitLong=['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
        const unitShort=['tbsp','tbsp','oz','oz','cup','pound'];
        const units=[...unitShort,'kg','g'];
        
        const newIngredients=this.ingredients.map(el => {
            
            //unifrom units
            let ingredient=el.toLowerCase();
            
            unitLong.forEach((unit,i)=>{
                ingredient=ingredient.replace(unit,unitShort[i]);
            });
            
            //remove parenthese
            ingredient=ingredient.replace(/ *\([^)]*\) */g,' ') ;

            //parse ingredients into count,unit & ingredients
            const arrIng=ingredient.split(' ');
            const unitIndex=arrIng.findIndex(el2 => units.includes(el2));
            
            let objIng;
            
            if(unitIndex > -1){
                //there is a unit
                const arrCount=arrIng.slice(0,unitIndex);
                let count;
                if(arrCount.length === 1){
                    count=eval(arrIng[0].replace('-','+'));
                }else{
                    count=eval(arrCount.join('+'));
                }
                
                
                objIng={
                    count,
                    unit : arrIng[unitIndex],
                    ingredient : arrIng.slice(unitIndex+1).join(' ')
                };
                
            }else if(parseInt(arrIng[0],10)){
                //no unit but number
                objIng={
                        count: parseInt(arrIng[0],10),
                        unit: '',
                        ingredient: arrIng.slice(1).join(' ')
                      };
            }
            else if(unitIndex === -1){
                //no unit,no number
                
                objIng={
                        count: 1,
                        unit: '',
                        ingredient
                      };
                
            }
            
            return objIng;
            
        });
                
        this.ingredients=newIngredients;
    }
    
    
    
    updateServings(type){
        //servings
        const newServings=type === 'dec' ? this.servings-1 : this.servings+1;
        //ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings/this.servings);
        });
        
        this.servings=newServings;
    }
    
}

