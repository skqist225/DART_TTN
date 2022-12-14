export const noticePeriodMappings = {
    1: "7:00-9:00",
    3: "9:00-11:00",
    5: "13:00-15:00",
    7: "15:00-17:00",
};

export default function checkExamTime({ examDate, noticePeriod, type = "checkBetween" }) {
    const [date, month, year] = examDate.split("/");

    const tempExamDate = `${month}/${date}/${year}`;

    const todayTime = new Date().getTime();
    const startTime = new Date(
        tempExamDate + " " + noticePeriodMappings[noticePeriod].split("-")[0]
    ).getTime();
    const endTime = new Date(
        tempExamDate + " " + noticePeriodMappings[noticePeriod].split("-")[1]
    ).getTime();

    if (type === "checkBetween") {
        return todayTime >= startTime && todayTime <= endTime;
    } else if (type === "checkLesser") {
        // current time must less than startTime of exam
        return todayTime < startTime;
    } else if (type === "checkGreater") {
        return todayTime > endTime;
    }
}
