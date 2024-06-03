import { ContextType, ConversationType } from "../../main";

export const sendAdminMessage = async (conversation: ConversationType, ctx: ContextType) => {
    try{
        await ctx.reply("پیام خود را بنویسید");
        const { message } = await conversation.wait();
        console.log(message);
        ctx.reply("پیام با موفقیت ارسال شد");
    }catch(e){
        ctx.reply("ارسال پیام ناموفق");
    }
}