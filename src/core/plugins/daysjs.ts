import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import customParseFormat from "dayjs/plugin/customParseFormat";

import "dayjs/locale/fr";

dayjs.extend(localeData);
dayjs.extend(customParseFormat);

dayjs.locale("fr");
