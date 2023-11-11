import { ContextType, ConversationType } from "../../main";

export const sendNoticeMsgConversation = async (conversation: ConversationType, ctx: ContextType) => {
    let selectedDrink = 'غزنوی'
    let selectedCook = 'هدایتی'
    await ctx.reply(`<b>برنامه امروز</b><p>نوشیدنی: </p><p>${selectedDrink}</p><p>گرمکن: </p><p>${selectedCook}</p>`, { parse_mode: "HTML" });
}