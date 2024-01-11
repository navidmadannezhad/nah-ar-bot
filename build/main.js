"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
require('dotenv').config();
const grammy_1 = require("grammy");
const menus_1 = require("./src/menus");
const sessionManager_1 = require("./src/storage/sessionManager");
const conversations_1 = require("@grammyjs/conversations");
const fileManager_1 = require("./src/storage/fileManager");
const conversations_2 = require("./src/conversations");
const dataManager_1 = require("./src/storage/dataManager");
const volunteer_1 = require("./volunteer");
const axios_1 = __importDefault(require("axios"));
const cron = require('node-cron');
const bot_token = process.env.BOT_TOKEN;
if (!bot_token)
    throw new Error("Bot Token is Unset!");
exports.bot = new grammy_1.Bot(process.env.BOT_TOKEN);
const initial = () => {
    return sessionManager_1.initialSession;
};
exports.bot.use((0, grammy_1.session)({ initial }));
exports.bot.use((0, conversations_1.conversations)());
const isAdmin = (ctx) => { var _a; return ((_a = ctx.update.message) === null || _a === void 0 ? void 0 : _a.from.id) == process.env.ADMIN_ID; };
// menu functions
const openFeaturesMenu = (ctx) => {
    ctx.session.canChangeSettings = true;
    return ctx.reply("لطفا قابلیت مورد نظر را انتخاب کنید", { reply_markup: menus_1.ServiceSelectMenu });
};
// register conversations
exports.bot.use((0, conversations_1.createConversation)(conversations_2.getIntervalConversation));
exports.bot.use((0, conversations_1.createConversation)(conversations_2.sendNoticeMsgConversation));
// register menus
exports.bot.use(menus_1.ServiceControllerMenu);
exports.bot.use(menus_1.ServiceSelectMenu);
exports.bot.command("cancel", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(ctx);
}));
exports.bot.command("settings", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (isAdmin(ctx)) {
        yield openFeaturesMenu(ctx);
    }
    else {
        yield ctx.reply("حاج آقا نا-ادمین!");
    }
}));
const sendMsgOnInterval = () => {
    const allowedWeekDays = [
        'Saturday',
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
    ];
    cron.schedule(`*/3 * * * * * ${allowedWeekDays.join(',')}`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield sendNoticeMsg();
    }));
    // cron.schedule(`00 11 * * ${ allowedWeekDays.join(',') }`, async () => {
    //     await sendNoticeMsg();
    // })
};
const getTodayQuote = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield axios_1.default.get(`https://one-api.ir/sokhan/?token=${process.env.ONE_API_TOKEN}&action=random`);
    return res.data.result;
});
const sendNoticeMsg = () => __awaiter(void 0, void 0, void 0, function* () {
    const quote = yield getTodayQuote();
    const quoteStructure = `📚 <strong>${quote.text}</strong>\n\n<i>${quote.author}</i>`;
    const currentDrinkOrder = yield (0, dataManager_1.getCurrentOrder)("drink" /* ServiceIndetifier.DRINK */);
    const currentCookOrder = yield (0, dataManager_1.getCurrentOrder)("cook" /* ServiceIndetifier.COOK */);
    const drinkIsActive = yield (0, dataManager_1.getServiceActivity)("drink" /* ServiceIndetifier.DRINK */);
    const cookIsActive = yield (0, dataManager_1.getServiceActivity)("cook" /* ServiceIndetifier.COOK */);
    let selectedDrink = volunteer_1.DRINK_LIST[currentDrinkOrder];
    let selectedCook = volunteer_1.COOK_LIST[currentCookOrder];
    exports.bot.api.sendMessage(process.env.TARGET_GROUP_ID, `${quoteStructure}\n\n${drinkIsActive ? "<b>نوبت نوشیدنی: </b><b>" + selectedDrink + "</b>" : ""}\n${cookIsActive ? "<b>نوبت گرمکن:</b><b> " + selectedCook + "</b>" : ""}`, { parse_mode: "HTML" });
    const nextDrinkOrder = currentDrinkOrder == volunteer_1.DRINK_LIST.length - 1 ? 0 : currentDrinkOrder + 1;
    const nextCookOrder = currentCookOrder == volunteer_1.COOK_LIST.length - 1 ? 0 : currentCookOrder + 1;
    yield (0, dataManager_1.updateOrder)("cook" /* ServiceIndetifier.COOK */, nextCookOrder);
    yield (0, dataManager_1.updateOrder)("drink" /* ServiceIndetifier.DRINK */, nextDrinkOrder);
});
const initiateSystem = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, fileManager_1.configureStorageFile)();
    exports.bot.start();
    sendMsgOnInterval();
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield initiateSystem();
}))();
