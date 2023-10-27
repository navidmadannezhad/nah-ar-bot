require('dotenv').config()
import { Bot, Context, session, SessionFlavor } from "grammy";
import { createStorageFile, retrieveStorageFile } from "./src/storage/fileManager";
import { updateInterval } from "./src/storage/dataManager";
import { ServiceIndetifier, SessionType } from "./src/types";
import { ServiceControllerMenu, ServiceSelectMenu, GetNewIntervalMenu, getIntervalConversation } from "./src/menus";
import { initialSession } from "./src/storage/sessionManager";

import {
    type Conversation,
    type ConversationFlavor,
    conversations,
    createConversation,
  } from "@grammyjs/conversations";

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

// register menus
bot.use(GetNewIntervalMenu);
bot.use(ServiceControllerMenu);
bot.use(ServiceSelectMenu);


bot.command("cancel", async (ctx) => {
    
});

bot.command("settings", async (ctx) => {
    if(isAdmin(ctx)){
        await openFeaturesMenu(ctx)
    }else{
        await ctx.reply("حاج آقا نا-ادمین!");
    }
});

bot.start();