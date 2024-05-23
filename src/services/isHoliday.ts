import * as cheerio from 'cheerio';
import axios from 'axios';

const CALENDAR_REFERENCE: string = "https://www.time.ir/";

export const isHoliday = async (): Promise<boolean> => {
    const pageContent = await axios.get(CALENDAR_REFERENCE);
    const selector = cheerio.load(pageContent.data);

    return selector(".mainCalendar .today").children()[0].attribs['class'] == " holiday";
}