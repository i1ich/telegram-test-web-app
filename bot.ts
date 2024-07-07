import { Telegraf, Markup } from 'telegraf';
import express from 'express';
import cors from 'cors';
import path from 'path';

const bot = new Telegraf(process.env.BOT_TOKEN || '');
const app = express();
const PORT = process.env.PORT || 3000;

let currentNumber = 0;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

bot.command('start', (ctx) => {
    ctx.reply(`Текущее число: ${currentNumber}`, Markup.keyboard([
        Markup.button.webApp('Открыть веб-приложение', `${process.env.WEBAPP_URL || 'https://your-render-url.onrender.com'}`)
    ]));
});

bot.command('add', (ctx) => {
    currentNumber++;
    ctx.reply(`Новое число: ${currentNumber}`);
});

bot.command('sub', (ctx) => {
    currentNumber--;
    ctx.reply(`Новое число: ${currentNumber}`);
});

app.get('/getCurrentNumber', (req, res) => {
    res.json({ number: currentNumber });
});

app.post('/updateNumber', (req, res) => {
    const { operation } = req.body;
    if (operation === 'add') {
        currentNumber++;
    } else if (operation === 'sub') {
        currentNumber--;
    }
    res.json({ number: currentNumber });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

bot.launch();