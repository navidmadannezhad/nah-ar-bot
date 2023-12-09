require('dotenv').config()
import { Bot, Context, session, SessionFlavor } from "grammy";
import { ServiceIndetifier, SessionType } from "./src/types";
import { ServiceControllerMenu, ServiceSelectMenu } from "./src/menus";
import { initialSession } from "./src/storage/sessionManager";
import {
    type Conversation,
    type ConversationFlavor,
    conversations,
    createConversation,
  } from "@grammyjs/conversations";
import { configureStorageFile } from "./src/storage/fileManager";
import { getIntervalConversation, sendNoticeMsgConversation } from "./src/conversations";
import { getCurrentOrder, getServiceActivity, updateOrder } from "./src/storage/dataManager";
import { COOK_LIST, DRINK_LIST } from "./volunteer";
import axios from "axios";
const cron = require('node-cron')

// define session
export type ContextType = Context & SessionFlavor<SessionType> & ConversationFlavor;
export type ConversationType = Conversation<ContextType>;
const bot_token = process.env.BOT_TOKEN;
if(!bot_token) throw new Error("Bot Token is Unset!")
export const bot = new Bot<ContextType>(process.env.BOT_TOKEN as string)

const initial = (): SessionType => {
    return initialSession;
}

bot.use(session({ initial }))
bot.use(conversations())

const isAdmin = (ctx: any) => ctx.update.message?.from.id == process.env.ADMIN_ID;

// menu functions
const openFeaturesMenu = (ctx: any) => { 
    ctx.session.canChangeSettings = true;
    return ctx.reply("لطفا قابلیت مورد نظر را انتخاب کنید", { reply_markup: ServiceSelectMenu });
}

// register conversations
bot.use(createConversation(getIntervalConversation));
bot.use(createConversation(sendNoticeMsgConversation))

// register menus
bot.use(ServiceControllerMenu);
bot.use(ServiceSelectMenu);

bot.command("cancel", async (ctx) => {
    console.log(ctx)
});

bot.command("settings", async (ctx) => {
    if(isAdmin(ctx)){
        await openFeaturesMenu(ctx)
    }else{
        await ctx.reply("حاج آقا نا-ادمین!");
    }
});



const sendMsgOnInterval = (): void => {
    const allowedWeekDays: string[] = [
        'Saturday',
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
    ];
    // cron.schedule(`00 11 * * ${ allowedWeekDays.join(',') }`, async () => {
    //     await sendNoticeMsg();
    // })
    cron.schedule(`*/10 * * * * *`, async () => {
        await sendNoticeMsg();
    })
}

const getTodayQuote = async () => {
    const res = await axios.get(`https://one-api.ir/sokhan/?token=${process.env.ONE_API_TOKEN}&action=random`);
    return res.data.result;
}

const sendNoticeMsg = async (): Promise<void> => {
    const quote = await getTodayQuote();
    const quoteStructure = `📚 <strong>${quote.text}</strong>\n\n<i>${quote.author}</i>`

    const currentDrinkOrder = await getCurrentOrder(ServiceIndetifier.DRINK);
    const currentCookOrder = await getCurrentOrder(ServiceIndetifier.COOK);

    const drinkIsActive = await getServiceActivity(ServiceIndetifier.DRINK);
    const cookIsActive = await getServiceActivity(ServiceIndetifier.COOK);

    let selectedDrink = DRINK_LIST[currentDrinkOrder];
    let selectedCook = COOK_LIST[currentCookOrder]
    
    bot.api.sendMessage(
        process.env.TARGET_GROUP_ID as string,
        `${quoteStructure}\n\n${drinkIsActive ? "<b>نوبت نوشیدنی: </b><b>"+selectedDrink+"</b>" : ""}\n${cookIsActive ? "<b>نوبت گرمکن:</b><b> "+selectedCook+"</b>" : ""}`, 
        { parse_mode: "HTML" }
    )

    const nextDrinkOrder = currentDrinkOrder == DRINK_LIST.length - 1 ? 0 : currentDrinkOrder + 1;
    const nextCookOrder = currentCookOrder == COOK_LIST.length - 1 ? 0 : currentCookOrder + 1;

    await updateOrder(ServiceIndetifier.COOK, nextCookOrder);
    await updateOrder(ServiceIndetifier.DRINK, nextDrinkOrder);
}

const initiateSystem = async () => {
    await configureStorageFile();
    bot.start();

    sendMsgOnInterval();
}

(async () => {
    await initiateSystem();
})()