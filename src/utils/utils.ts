const { MessageEmbed } = require('discord.js');
const { existsSync } = require('fs');

function embedMsg(cocktail, msg) {
    let s = '';
    cocktail.ingredients.forEach(ingredient => {
        s += `  - ${ingredient.amount ? ingredient.amount : ''} of ${ingredient.name}\n`
    })
    const embed = new MessageEmbed()
        .setTitle('Drink')
        .setColor('#DAF7A6')
        .setThumbnail(cocktail.thumb)
        .setDescription(
            `
                    Name: ${cocktail.name}\n
                    Glass: ${cocktail.glass_type}\n
                    Ingredients:\n
                    ${s}
                `
        )
    msg.channel.send(embed);
}

module.exports = {
    embedMsg
}

function checkSoundsDir() {
    const path = "../../sounds/"
    return existsSync(path);
}