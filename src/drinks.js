const { API } = require('./api');

async function getCocktailContaining(ingredient) {
    let response = await API.drinks.get(`filter.php?i=${ingredient}`)
    if (response.data.drinks.length < 0)
        return;

    let drinks = response.data.drinks;
    let rand = Math.floor(Math.random() * drinks.length);

    return drinkById(drinks[rand].idDrink);

}

async function getCocktailByName(name) {
    let response = await API.drinks.get(`search.php?s=${name}`);
    if(response.data.drinks.length < 0) 
        return;
    
    let drinks = response.data.drinks;
    let rand = Math.floor(Math.random() * drinks.length);
    return drinkDetail(drinks[rand]);//drinks[rand];
}

async function drinkById(id) {
    return await API.drinks.get(`/lookup.php?i=${id}`)
        .then((response) => {
            return drinkDetail(response.data.drinks[0])
        })
}

function drinkDetail(drink) {
    let index = 1;
    let ingredients = []
    while (drink['strIngredient' + index]) {
        ingredients.push({
            name: drink['strIngredient' + index],
            amount: drink['strMeasure' + index]
        });
        index++;
    }
    return {
        name: drink.strDrink,
        glass_type: drink.strGlass,
        ingredients,
        thumb: drink.strDrinkThumb
    }
}


module.exports = {
    getCocktailContaining,
    getCocktailByName
}