require('dotenv').config()
import { Bot } from "grammy";
import { Menu } from "@grammyjs/menu";

const bot = new Bot(process.env.BOT_TOKEN as string)

const isAdmin = (ctx: any) => ctx.update.message?.from.id === process.env.ADMIN_ID;
const stopBot = () => { console.log("bot stopped") }
const openSettingMenu = () => { console.log("settings menu opened") }

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

bot.use(featureControllerMenu);
bot.use(featuresMenu);

bot.command("settings", async (ctx) => {
    if(isAdmin(ctx)){
        await ctx.reply("لطفا قابلیت مورد نظر را انتخاب کنید", { reply_markup: featuresMenu });
    }else{
        await ctx.reply("حاج آقا نا-ادمین!");
    }
});

bot.start();