import { Menu } from "@grammyjs/menu";
import { getServiceActivity } from "../storage/dataManager";
import { ServiceIndetifier } from "../types";
import { enableService, disableService } from "../storage/dataManager";
import { ErrorMode, SuccessMode } from "../types";
import { initialSession } from "../storage/sessionManager";

const toggleServiceActivation = async (selectedService: ServiceIndetifier) => {
    const serviceActive = await getServiceActivity(selectedService);
    if(serviceActive){
        try{
            await disableService(selectedService);
            console.log(SuccessMode.SERVICE_DISABLED)
        }catch(e){
            console.log(ErrorMode.SERVICE_DISABLE_FAILED)
        }
    }else{
        try{
            await enableService(selectedService);
            console.log(SuccessMode.SERVICE_ENABLED)
        }catch(e){
            console.log(ErrorMode.SERVICE_ENABLE_FAILED)
        }
    }
}

export const ServiceControllerMenu = new Menu("service-controller-menu")

    .text("فعال سازی", async (ctx: any) => {
        if(ctx.session.canChangeSettings){
            const selectedService = ctx.session.selectedService;
            await toggleServiceActivation(selectedService);
        }
    })

    .text("تغییر بازه زمانی", async (ctx: any) => {
        console.log(ctx.session.canChangeSettings)
        if(ctx.session.canChangeSettings){
            await ctx.conversation.enter("getIntervalConversation")
        }
    })

    .text("لغو", (ctx: any) => {
        ctx.session = initialSession;
        ctx.reply("تنظیمات لغو شد")
    });