const { search } = require('../db/collections/drinks.js');
const { detail } = require('../scripts/drinks.js');
const { MessageEmbed } = require('discord.js');

async function searchDrink(query, channel) {
    await search(query)
        .then((response) => {
            const list = response;
            const embed = new MessageEmbed()
                .setTitle(`Here are your results for ${query}`)
                .setColor('#DAF7A6')
                .setDescription(`$`)
                .setDescription(list.map(el => {
                    return `${el.name} : ${el.saqCode}`
                }))
            channel.send(embed);
        });
}

async function searchStore(id, channel) {
    await detail(id)
        .then((response) => {
            const list = response;
            const embed = new MessageEmbed()
                .setTitle(`Here the stores available for your drink`)
                .setColor('#DAF7A6')
                .setDescription(`$`)
                .setDescription(list.map(el => {
                    return `${el.storeName} : ${el.available}`
                }))
            channel.send(embed);
        });
}


module.exports = {
    searchDrink,
    searchStore
}