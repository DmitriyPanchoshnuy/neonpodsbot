import TelegramBot from 'node-telegram-bot-api'
import { addClients, getClientsWhere } from './database/api.js';
let token = "8171642578:AAHPySOLauJPR4ldU4rTYXCj7CwH1ULU-qk";
const weburl = "https://joyful-pie-cde201.netlify.app/"
const bot = new TelegramBot(token, { polling: true });



bot.onText(/\/start/, async (msg) => {
  const user = (await getClientsWhere("user_id", msg.from.id))[0]
  if (user && user.user_id === msg.from.id && user.is_verified) {
    if (user.status === "user") {
      try {
        await bot.sendMessage(msg.chat.id, "Доброго дня!", {
          reply_markup: {
            keyboard: [
              [{ text: "Зробити замовлення", web_app: { url: weburl } }],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
          }
        })
      } catch (e) {
        console.log(`ERROR: ${e}`)
      }
    } else if (user.status === "admin") {
      try {
        await bot.sendMessage(msg.chat.id, "Доброго дня!", {
          reply_markup: {
            keyboard: [
              [{ text: "Зробити замовлення", web_app: { url: weburl } }],
              [{ text: "Список заявок", web_app: { url: weburl } }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
          }
        })
      } catch (e) {
        console.log(`ERROR: ${e}`)
      }
    }

  } else {
    if (!user) {
      const error = await addClients(msg.from.id)
    }
    bot.sendMessage(msg.chat.id, "Доброго дня! \nОчікуйте на прийняття вашої заявки.")
  }
});

bot.on('message', (msg) => {
  if (msg.web_app_data) {
    try {
      const data = JSON.parse(msg.web_app_data.data);
      console.log('Данные из MiniApp:', data);

      bot.sendMessage(msg.chat.id, 'Ваши данные успешно получены!');
    } catch (error) {
      console.error('Ошибка обработки данных из MiniApp:', error);
    }
  }
});

// bot.on('web_app_data', async (msg) => {
//   if (msg?.web_app_data?.data) {
//     console.log(JSON.parse(msg.web_app_data.data))
//     try {
//       await bot.sendMessage(msg.chat.id, `YOUR ORDER: ${msg.web_app_data.data}`)
//     } catch (e) {
//       console.log(`User ${msg.from.username} blocked`)
//     }
//   }
// })