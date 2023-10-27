import { Menu } from "@grammyjs/menu";
import { ServiceControllerMenu } from "./ServiceControllerMenu";
import { ServiceIndetifier } from "../types";

export const ServiceSelectMenu = new Menu("service-select-menu")

    .text("گرمکن", (ctx: any) => {
        ctx.session.selectedService = ServiceIndetifier.COOK;
        ctx.reply("تنظیمات - گرمکن", { reply_markup: ServiceControllerMenu })
    })

    .text("نوشیدنی", (ctx: any) => {
        ctx.session.selectedService = ServiceIndetifier.DRINK;
        ctx.reply("تنظیمات - نوشیدنی", { reply_markup: ServiceControllerMenu })
    });
