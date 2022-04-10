const TelegramApi = require('node-telegram-bot-api')
const {gameOption, againOptios} = require('./options')
const token = '5231291741:AAF11i3drK59YOgwv6nlsnUq2VwQ6_kQPqQ'

const bot = new TelegramApi(token, {polling: true})

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Я загадал цифру от 0 до 9, а ты её угадай`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Отгадай` , gameOption)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Greeting'},
        {command: '/info', description: 'Info'},
        {command: '/game', description: 'Game'}


    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/43e/041/43e041ad-afbb-34c9-8e62-222f29474c0e/11.webp')
            return bot.sendMessage(chatId, `Привет!`)
        }
        if(text === '/info') {
            return  bot.sendMessage(chatId, `Привет! ${msg.from.first_name}`)
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'я тебя не понял')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.from.id;
        if (data === '/again') {
            return startGame(chatId)
        }

        if (Number(data) === Number(chats[chatId])) {
            return await bot.sendMessage(chatId, `Поздравляю! Ты отгадал цифру ${chats[chatId]}`, againOption)
        } else {
            return await bot.sendMessage(chatId, `Ты не отгадал цифру ${chats[chatId]}`, againOption)
        }
    })
}

start();
