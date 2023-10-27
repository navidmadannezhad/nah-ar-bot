require('dotenv').config()
import { Bot, Context, session, SessionFlavor } from "grammy";
import { createStorageFile, retrieveStorageFile } from "./src/storage/fileManager";
import { updateInterval } from "./src/storage/dataManager";
import { ServiceIndetifier, SessionType } from "./src/types";
import { ServiceControllerMenu, ServiceSelectMenu } from "./src/menus";

// define session
type ContextType = Context & SessionFlavor<SessionType>;
const bot = new Bot<ContextType>(process.env.BOT_TOKEN as string)

const initial = (): SessionType => {
    return {
        selectedService: ServiceIndetifier.COOK
    }
}

bot.use(session({ initial }))









const isAdmin = (ctx: any) => ctx.update.message?.from.id == process.env.ADMIN_ID;

// menu functions
const openFeaturesMenu = (ctx: any) => { 
    return ctx.reply("لطفا قابلیت مورد نظر را انتخاب کنید", { reply_markup: ServiceSelectMenu });
}

// register menus
bot.use(ServiceControllerMenu);
bot.use(ServiceSelectMenu);






// test
(async () => {
    await createStorageFile();
    await updateInterval(ServiceIndetifier.COOK, "3");
    let data = await retrieveStorageFile();
    console.log(data)
})()
// test

bot.command("settings", async (ctx) => {
    if(isAdmin(ctx)){
        await openFeaturesMenu(ctx)
    }else{
        await ctx.reply("حاج آقا نا-ادمین!");
    }
});

bot.start();