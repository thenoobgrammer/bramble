const { API }  = require('./api');

async function drinkContaining(ingredient) {
    return await API.drinks.get(`/filter.php?i=${ingredient}`) 
        .then((response) => {
            let drinks = response.data.drinks;
            let length = drinks.length;
            let rand = Math.floor(Math.random() * length);
            return drinks[rand];
        })
}

async function drinkDetail(id) {
    return await API.drinks.get(`/lookup.php?i=${id}`)
        .then((response) => {
            let index = 1;
            let drink = response.data.drinks[0];
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
                ingredients
            }
        })
}



module.exports = {
    drinkContaining,
    drinkDetail
}