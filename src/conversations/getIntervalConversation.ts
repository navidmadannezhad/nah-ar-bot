import { ContextType, ConversationType } from "../../main";
import { isInterval } from "../validators/isInterval";
import { ServiceIndetifier } from "../types";
import { updateInterval } from "../storage/dataManager";
import { initialSession } from "../storage/sessionManager";

export const getIntervalConversation = async (conversation: ConversationType, ctx: ContextType) => {
    const selectedService = ctx.session.selectedService;
    await ctx.reply("لطفا بازه زمانی مورد نظر خود را وارد کنید");
    const { message } = await conversation.wait();
    if(isInterval(message?.text)){
        try{
            await updateInterval(selectedService as ServiceIndetifier, message?.text as string);
            ctx.session = initialSession;
            ctx.reply("بازه زمانی با موفقیت تغییر کرد");
        }catch(e){
            console.log(e)
            ctx.reply("در تغییر بازه زمانی مشکلی پیش آمده است");
        }
    }else{
        ctx.session = initialSession;
        ctx.reply("ورودی نا معتبر")
    }
}