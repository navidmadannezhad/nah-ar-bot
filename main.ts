require('dotenv').config()
import { Bot } from "grammy";
import { Menu } from "@grammyjs/menu";

const bot = new Bot(process.env.BOT_TOKEN as string)

const isAdmin = (ctx: any) => ctx.update.message?.from.id == process.env.ADMIN_ID;

// menu functions
const openFeaturesMenu = (ctx: any) => { 
    return ctx.reply("لطفا قابلیت مورد نظر را انتخاب کنید", { reply_markup: featuresMenu });
}

const featureControllerMenu = new Menu("feature-controller-menu")
    .text("فعال سازی", (ctx: any) => ctx.reply("You pressed A!"))
    .text("تغییر بازه زمانی", (ctx: any) => ctx.reply("You pressed B!"));

const featuresMenu = new Menu("features-menu")
    .text("گرمکن", (ctx: any) => {
        ctx.reply("تنظیمات - گرمکن", { reply_markup: featureControllerMenu })
    })
    .text("نوشیدنی", (ctx: any) => {
        ctx.reply("تنظیمات - نوشیدنی", { reply_markup: featureControllerMenu })
    });




// register menus
bot.use(featureControllerMenu);
bot.use(featuresMenu);







bot.command("settings", async (ctx) => {
    if(isAdmin(ctx)){
        await openFeaturesMenu(ctx)
    }else{
        await ctx.reply("حاج آقا نا-ادمین!");
    }
});

bot.start();