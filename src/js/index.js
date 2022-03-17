// Global app controller
import Search from './models/Search.js';
import Recipe from './models/Recipe.js';
import List from './models/List.js';
import Likes from './models/Likes.js';
import * as searchView from './views/searchView.js';
import * as recipeView from './views/recipeView.js';
import * as listView from './views/listView.js';
import * as likesView from './views/likesView.js';
import {elements,renderLoader,clearLoader} from './views/base.js';

/*
Global state of the app
-Search Object
-Current Recipe
-Shopping list object
-Liked Object
*/

const state={};
//search controller 
const controlSearch= async ()=>{
    //get query from view
    const query=searchView.getInput();
    console.log(query);
    
    if(query)
    {
        //2 New Search Obj
        state.search=new Search(query);
        
        //3 prepare ui for result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        //4 search for recipe
        try{
            await state.search.getResults();

            //5 render results on ui
            //console.log(state.search.result);
            clearLoader();
            searchView.renderResults(state.search.result);
        }catch(err){
            console.log(err);
            clearLoader();
        }
    }
    
};

elements.searchForm.addEventListener('submit',e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPage.addEventListener('click',e=>{
    const btn=e.target.closest('.btn-inline');
    //console.log(e.target);
    if(btn)
    {
        const goToPage=parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResults(state.search.result,goToPage);
        //console.log(goToPage);
    }
    
});
//recipe controller
//const r=new Recipe(46956);
//r.getRecipe();
//console.log(r);

const controlRecipe=async()=>{
    const id=window.location.hash.replace('#','');
    console.log(id);
    
    if(id){
        //prepare ui for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        //hightlight selected
        if(state.search) searchView.highLightedSelected(id);
        //create new recipe object
        state.recipe=new Recipe(id);
        
        //get recipe data
        try{
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //calculate servings & time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //render recipe
            clearLoader();
            //console.log(state.recipe);
            recipeView.renderRecipe(state.recipe,state.likes.isLiked(id));
        }catch(err){
            console.log(err);
        }
    }
    
};

//List controller

const controlList=()=>{
    //create a new list if there is none yet
    if(!state.list) state.list=new List();
    //add it to the list & ui
    state.recipe.ingredients.forEach(el => {
       const item=state.list.addItem(el.count,el.unit,el.ingredient);
       listView.renderItem(item);
    })
};

//control like

const controlLike=()=>{
    
    if(!state.likes) state.likes=new Likes();
    
    const currentID=state.recipe.id;
    
    //user not liked current recipe yet
    if(!state.likes.isLiked(currentID)){
        //add like to state
        const newLike=state.likes.addLike(currentID,state.recipe.title,state.recipe.author,state.recipe.img);
        //toggle like button
        likesView.toggleLikeBtn(true);
        //add like to ui list
        likesView.renderLike(newLike);
        
    }else{ //user liked current recipe
        
        //remove like to state
        state.likes.deleteLike(currentID);
        //toggle like button
        likesView.toggleLikeBtn(false);
        //remove like to ui list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

window.addEventListener('load',()=>{
        state.likes = new Likes();
        state.likes.readStorage();
        likesView.toggleLikeMenu(state.likes.getNumLikes());
        state.likes.likes.forEach(like => {
        likesView.renderLike(like);
    });
})


//handle delete & update list item event
elements.shopping.addEventListener('click', e=>{
    const id=e.target.closest('.shopping__item').dataset.itemid;
    console.log(id);
    //handle delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        //delete from state
        state.list.deleteItem(id);
        //delete from ui
        listView.deleteItem(id);
    }else if(e.target.matches('.shopping__count-value')){
        const val=parseFloat(e.target.value,10);
        
        state.list.updateCount(id,val);
    }
});


window.addEventListener('hashchange',controlRecipe);
window.addEventListener('load',controlRecipe);

//['hashchange','load'].forEach(event => window.addEventListener('event',controlRecipe));

//handling recipe button
elements.recipe.addEventListener('click',e=>{
    if(e.target.matches('.btn-decrease,.btn-decrease *')){
        //decrease button is clicked
        if(state.recipe.servings>1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        } 
        
    }else if(e.target.matches('.btn-increase,.btn-increase *')){
        //increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }else if(e.target.matches('.recipe__btn--add,.recipe__btn--add *')){
        //add ingredient to shopping list
         controlList();
    }else if(e.target.matches('.recipe__love,.recipe__love *')){
        controlLike();
    }
    console.log(state.recipe);
});



//window.l=new List();
window.state=state;

















