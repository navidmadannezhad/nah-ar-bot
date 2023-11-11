require('dotenv').config()
import { Bot, Context, session, SessionFlavor } from "grammy";
import { SessionType } from "./src/types";
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
const cron = require('node-cron');

// define session
export type ContextType = Context & SessionFlavor<SessionType> & ConversationFlavor;
export type ConversationType = Conversation<ContextType>;
const bot = new Bot<ContextType>(process.env.BOT_TOKEN as string)

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
        'Wednesday'
    ];

    // cron.schedule(`0 11 * * ${ allowedWeekDays.join(',') }`, async () => {
    //     await sendNoticeMsg();
    // })

    cron.schedule(`*/10 * * * * *`, async () => {
        await sendNoticeMsg();
    })
}

const sendNoticeMsg = async (): Promise<void> => {
    let selectedDrink = 'غزنوی'
    let selectedCook = 'هدایتی'
    bot.api.sendMessage(process.env.ADMIN_ID as string,`<b>امروز!</b>\n\n<b>نوبت نوشیدنی:</b><b> ${selectedDrink}</b>\n<b>نوبت گرمکن:</b><b> ${selectedCook}</b>`, { parse_mode: "HTML" })
}




const initiateSystem = async () => {
    await configureStorageFile();
    bot.start();

    sendMsgOnInterval();
}

(async () => {
    await initiateSystem();
})()