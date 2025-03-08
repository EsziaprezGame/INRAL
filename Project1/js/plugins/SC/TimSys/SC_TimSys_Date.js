class Game_Date {
    constructor(timestamp = 0, isLocal = 0) {
        this.timestamp = $dataTimeSystem.start_timestamp || timestamp;
        this._tick = 0;
        this._scrollSpeedMode = 1;
    }

    passMin(minutes = 1) {
        this.timestamp += minutes;
    }

    passHr(hours = 1) {
        this.passMin(hours * $dataTimeSystem.minutes_per_hour);
    }
    passTick() {
        if (this.getScrollSpeedMode() > 0) {
            this._tick++;
            if (this._tick >= this.getTickPerMin()) {
                this.timestamp++;
                this._tick = 0;
            }
        }

    }
    setScrollSpeedMode(value){
        this._scrollSpeedMode = value.clamp(0, 4);
    }
    getScrollSpeedMode() {
        this._scrollSpeedMode = this._scrollSpeedMode.clamp(0, 4);
        return this._scrollSpeedMode;
    }
    getTickPerMin() {
        return $dataTimeSystem.tick_per_min[this.getScrollSpeedMode()];
    }
    getMin() {
        return this.timestamp % $dataTimeSystem.minutes_per_hour;
    }

    getHr() {
        return Math.floor((this.timestamp % ($dataTimeSystem.hours_per_day * $dataTimeSystem.minutes_per_hour)) / $dataTimeSystem.minutes_per_hour);
    }
    getHrAmPm() {
        return this.getHr() % 12;
    }

    getDay() {
        return Math.floor(this.timestamp / this.getTotalMinPerDay()) % 10; // Jour dans la décade
    }
    getTotalMinPerDay(){
        return $dataTimeSystem.hours_per_day * $dataTimeSystem.minutes_per_hour;
    }
    getDayMonth() {
        const totalMinutesPerDay = $dataTimeSystem.hours_per_day * $dataTimeSystem.minutes_per_hour;
        return Math.floor(this.timestamp / totalMinutesPerDay) % $dataTimeSystem.days_per_month;
    }

    getMonth() {
        const totalMinutesPerMonth = $dataTimeSystem.days_per_month * $dataTimeSystem.hours_per_day * $dataTimeSystem.minutes_per_hour;
        return (Math.floor(this.timestamp / totalMinutesPerMonth) % $dataTimeSystem.months_per_year) + 1;
    }

    getYear() {
        const totalMinutesPerYear = $dataTimeSystem.months_per_year * $dataTimeSystem.days_per_month * $dataTimeSystem.hours_per_day * $dataTimeSystem.minutes_per_hour;
        return Math.floor(this.timestamp / totalMinutesPerYear);
    }

    getPartOfDayName() {
        return this.getVocab().dayParts[this.getPartOfDayIndex()];
    }
    getPartOfDayIndex() {
        const minutes = this.timestamp % ($dataTimeSystem.hours_per_day * $dataTimeSystem.minutes_per_hour);
        if (minutes >= 360 && minutes < 480) return 1;
        if (minutes >= 480 && minutes < 660) return 2;
        if (minutes >= 660 && minutes < 780) return 3;
        if (minutes >= 780 && minutes < 1020) return 4;
        if (minutes >= 1020 && minutes < 1200) return 5;
        if (minutes >= 1200 && minutes < 1320) return 6;
        return 7;
    }
    isNightTime(){
        return this.getPartOfDayIndex() > 5
            || this.getPartOfDayIndex() < 2
    }
    getSeasonName() {
        const seasons = this.isLocal() ? $dataTimeSystem.seasons_local : $dataTimeSystem.seasons_global;
        return seasons[this.getSeasonIndex()];
    }
    isLocal(){
        return $dataMap.meta.localDate;
    }
    getSeasonIndex() {
        return Math.floor((this.getMonth() - 1) / 3);
    }
    getVocab(){
        return $dataTimeSystem[$dataSystem.locale];
    }
    getWording() {
        const dayName = $dataTimeSystem.days_of_decade[this.getDay()];
        const dayOfMonth = this.getDayMonth() + 1;
        const decadeNumber = Math.ceil(dayOfMonth / 10);
        const monthName = $dataTimeSystem.months_of_year[this.getMonth() - 1];
        const year = this.getYear();
        const hours = String(this.getHr()).padStart(2, '0');
        const minutes = String(this.getMin()).padStart(2, '0');
        const template = this.getVocab().wordingTemplate;

        return template.format([dayName,dayOfMonth,decadeNumber,this.getPartDec(decadeNumber),monthName,year,hours,minutes]);
    }
    getHrWording() {
        const hours = String(this.getHr()).padStart(2, '0');
        const minutes = String(this.getMin()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    getHudWording() {
        const dayName = $dataTimeSystem.days_of_decade[this.getDay()];
        const dayOfMonth = this.getDayMonth() + 1;
        const monthName = $dataTimeSystem.months_of_year[this.getMonth() - 1];
        const year = this.getYear();
        const template = this.getVocab().wordingShortTemplate;

        return template.format(dayName, dayOfMonth, monthName.toUpperCase(), this.getPartDec(dayOfMonth, true), year);
    }
    getPartDec(number, male){
        let partDec = number === 1 ? "ère" : "ème";
        if(male){
            partDec = number === 1 ? "er" : "ème";
        }
        if($dataSystem.locale === "en_EN"){
            switch(decadeNumber){
                case 1: partDec = "st";break;
                case 2: partDec = "nd";break;
                default:partDec = "th";break;
            }
        }
        return partDec;
    }
    getShortDate() {
        return `${this.getDayMonth() + 1}/${this.getMonth()}/${this.getYear()} - ${String(this.getHr()).padStart(2, '0')}:${String(this.getMin()).padStart(2, '0')} - ${this.getPartOfDay().toUpperCase()}`;
    }

    compare(otherDate) {
        if (!(otherDate instanceof SC_TimSys_GameDate)) {
            throw new Error("Argument must be an instance of SC_TimSys_GameDate.");
        }
        return this.timestamp - otherDate.timestamp;
    }

    compareToDate(otherDate) {
        if (!(otherDate instanceof SC_TimSys_GameDate)) {
            throw new Error("Argument must be an instance of SC_TimSys_GameDate.");
        }

        const diff = Math.abs(this.timestamp - otherDate.timestamp);
        const isPast = this.timestamp < otherDate.timestamp;

        const totalMinutesPerYear = $dataTimeSystem.months_per_year * $dataTimeSystem.days_per_month * $dataTimeSystem.hours_per_day * $dataTimeSystem.minutes_per_hour;
        const totalMinutesPerMonth = $dataTimeSystem.days_per_month * $dataTimeSystem.hours_per_day * $dataTimeSystem.minutes_per_hour;
        const totalMinutesPerDay = $dataTimeSystem.hours_per_day * $dataTimeSystem.minutes_per_hour;

        const years = Math.floor(diff / totalMinutesPerYear);
        const months = Math.floor((diff % totalMinutesPerYear) / totalMinutesPerMonth);
        const days = Math.floor((diff % totalMinutesPerMonth) / totalMinutesPerDay);
        const hours = Math.floor((diff % totalMinutesPerDay) / $dataTimeSystem.minutes_per_hour);
        const minutes = diff % $dataTimeSystem.minutes_per_hour;

        const parts = [];
        if (years) parts.push(`${years} année(s)`);
        if (months) parts.push(`${months} mois`);
        if (days) parts.push(`${days} jour(s)`);
        if (hours) parts.push(`${hours} heure(s)`);
        if (minutes) parts.push(`${minutes} minute(s)`);

        return `${isPast ? "Il y a" : "Dans"} ${parts.join(", ")}`;
    }
}

SC._temp = SC._temp || {};
SC._temp.pluginRegister     = {
    name                : "SC_TimSys_Date",
    icon                : "\u{23F3}",
    version             : "0.2.1",
    author              : AUTHOR,
    license             : LICENCE,
    dependencies        : ["SC_SystemLoader"],
    loadDataFiles       : [{filename:"TimeSystem",instName:"$dataTimeSystem"}],
    createObj           : {autoCreate  : true, classProto: Game_Date, instName: '$gameInLudeDate'},
    autoSave            : true
}
$simcraftLoader.checkPlugin(SC._temp.pluginRegister);