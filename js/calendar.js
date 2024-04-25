import eventsList from "./events_list.js";

const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                      "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const whichMonthNames = ["января", "февраля", "марта", "апреля", "мая", "июня",
"июля", "августа", "сентября", "октября", "ноября", "декабря"];
const daysOfWeek = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"]

const getDay = (date) => {
    let day = date.getDay();
    if (day == 0) day = 7;
    return day - 1;
}

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
let year = currentYear;
const currentMonth = currentDate.getMonth() + 1;
let month = currentMonth;
const currentDay = currentDate.getDate();
let activeDay = currentDay;
const currentWeekDayNum = getDay(new Date());
let weekDayNum = currentWeekDayNum;

const createCalendar = (el, year, month) => {
    el = document.querySelector(el);

    el.innerHTML = '';

    let mon = month - 1;
    let d = new Date(year, mon)

    let table = `
    <table class='calendar__table'>
        <caption class='calendar__date'>${monthNames[month - 1]} ${year}</caption>
        <thead>
            <tr>
                <th>Пн</th>
                <th>Вт</th>
                <th>Ср</th>
                <th>Чт</th>
                <th>Пт</th>
                <th>Сб</th>
                <th>Вс</th>
            </tr>
        </thead>
        <tbody>
            <tr data-calendar-week>
    `

    for (let i = 0; i < getDay(d); i++) {
        table += '<td></td>'
    }

    for (let i = 0; d.getMonth() == mon; i++) {
        table += `<td class='${currentMonth == month ? 'current-month-day' : 'not-current-month-day'} special-day' data-calendar-day='${i + 1}'>${d.getDate()}</td>`

        if(getDay(d) % 7 == 6) {
            table += `</tr><tr data-calendar-week>`
        }
        d.setDate(d.getDate() + 1)
    }

    if (getDay(d) != 0) {
        for (let i = getDay(d); i < 7; i++) {
            table += '<td></td>'
        }
    }
    
    table += '</tr></tbody></table>';
    el.innerHTML = table;
}

const selectInCalendar = () => {
    document.querySelectorAll('[data-calendar-day]').forEach(day => {
        if (day.textContent == activeDay || day.textContent == currentDay && month == currentMonth) {
            day.classList.add('current-day');
        }
    });
    document.querySelectorAll('[data-calendar-week]').forEach(week => {
        const daysInWeek = week.querySelectorAll('[data-calendar-day]')
        daysInWeek.forEach(day => {
            if (day.textContent == currentDay && month == currentMonth) {
                week.classList.add('current-week');
            }
            if (day.textContent == activeDay) {
                addDataInFE(daysInWeek);
            }
        })
    })
};

const addDataInChoiceDay = () => {
    document.querySelector('.events__choice-day').textContent = activeDay;
    document.querySelector('.events__choice-month').textContent = whichMonthNames[month - 1];
    document.querySelector('.events__choice-week').textContent = daysOfWeek[getDay(new Date(year, month - 1, activeDay))];
}

// Finance Evenings
const addDataInFE = (daysInWeek) => {
    document.querySelector('.events__finance-evenings-period-month').textContent = whichMonthNames[month - 1];

    document.querySelector('.events__finance-evenings-period-start').textContent = Number(daysInWeek[0].textContent);
    document.querySelector('.events__finance-evenings-period-end').textContent = Number(daysInWeek[daysInWeek.length - 1].textContent);

    const FEDaysList = document.querySelector('.events__finance-evenings-days');
    FEDaysList.innerHTML = '';

    daysInWeek.forEach(day => {
        const li = document.createElement('li');
        li.classList.add('events__finance-evenings-day');
        li.classList.add('events__finance-evenings-day--current');
        li.id = day.textContent;
        
        const numberDiv = document.createElement('div');
        numberDiv.classList.add('events__finance-evenings-number');
        if (day.textContent < 10) {
            numberDiv.textContent = `0${day.textContent}`
        } else {
            numberDiv.textContent = day.textContent
        }

        const monthDiv = document.createElement('div');
        monthDiv.innerHTML = whichMonthNames[month - 1];
        monthDiv.classList.add('events__finance-evenings-month');

        li.appendChild(numberDiv);
        li.appendChild(monthDiv);
        FEDaysList.appendChild(li);
    })

    const FEDays = document.querySelectorAll('.events__finance-evenings-day');
    FEDays.forEach(item => {
        if (item.getAttribute('id') == activeDay) {
            item.classList.add('active')
        }
    })
};

const changeDayFromArrows = () => {
    document.querySelectorAll('[data-calendar-arrow]').forEach(arrow => {
        arrow.addEventListener('click', () => {
            const calendarDays = document.querySelectorAll('[data-calendar-day]');
            if (arrow.classList.contains('events__choice-arrow-left')) {
                if (activeDay != 1) {
                    calendarDays.forEach(day => {
                        if (day.textContent == activeDay && day.textContent != currentDay || !day.classList.contains('current-month-day')) {
                            day.classList.remove('current-day')
                        }
                    })
        
                    activeDay--;
                    weekDayNum--;
                } else if (activeDay == 1 && month > currentMonth) {
                    const newMonth = month - 1;
                    month--;
                    activeDay = new Date(year, month, 0).getDate();
                    weekDayNum = getDay(new Date(year, month - 1, activeDay))

                    createCalendar('.events__calendar', year, newMonth);
                    selectInCalendar();
                    addDataInChoiceDay();
                    addEventsList();
                }
                changeEventInFE();
                changeArrowsColor();
            } else if (arrow.classList.contains('events__choice-arrow-right')) {
                if (activeDay != new Date(year, month, 0).getDate()) {
                    calendarDays.forEach(day => {
                        if (day.textContent == activeDay && day.textContent != currentDay || !day.classList.contains('current-month-day')) {
                            day.classList.remove('current-day')
                        }
                    })
        
                    activeDay++;
                    weekDayNum++;
                } else if (activeDay == new Date(year, month, 0).getDate()) {
                    const newMonth = month + 1;
                    month++;
                    activeDay = 1;
                    weekDayNum = getDay(new Date(year, month - 1, activeDay))

                    createCalendar('.events__calendar', year, newMonth);
                    selectInCalendar();
                    addDataInChoiceDay();
                    addEventsList();
                }
                changeEventInFE();
                changeArrowsColor();
            }

            if (weekDayNum == -1 || weekDayNum == daysOfWeek.length) {
                document.querySelectorAll('[data-calendar-week]').forEach(week => {
                    const daysInWeek = week.querySelectorAll('[data-calendar-day]')
                    daysInWeek.forEach(day => {
                        if (day.textContent == activeDay) {
                            addDataInFE(daysInWeek);
                        }
                    })

                    if (weekDayNum == -1) {
                        weekDayNum = daysOfWeek.length - 1;
                    } else if (weekDayNum == daysOfWeek.length) {
                        weekDayNum = 0;
                    }
                })
            }

            calendarDays.forEach(day => {
                if (day.textContent == activeDay) {
                    day.classList.add('current-day');
                }
            })
            
            changeActiveFEDay();
            addDataInChoiceDay();
        })
    })
};

const changeActiveFEDay = () => {
    const FEDays = document.querySelectorAll('.events__finance-evenings-day');
    FEDays.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('id') == activeDay) {
            item.classList.add('active');
        }
    });
};

const changeEventInFE = () => {
    const FESchedule = document.querySelector('.events__finance-evenings-schedule');
    FESchedule.innerHTML = '';

    const FEEvent = document.createElement('li');
    FEEvent.classList.add('events__finance-evenings-schedule-item');

    const FEEventTime = document.createElement('div');
    FEEventTime.classList.add('events__finance-evenings-schedule-time');
    FEEventTime.textContent = '19:00'

    const FEEventDescription = document.createElement('p');
    FEEventDescription.classList.add('events__finance-evenings-schedule-description');

    let startDay = 1;
    let startMonth = 2;
    let startYear = 2024;

    let startDate;

    startDate = new Date(startYear, startMonth, startDay);
    const endDate = new Date(year, month - 1, activeDay);
    let diffInTime = endDate.getTime() - startDate.getTime();
    let diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));
    
    if (diffInDays > eventsList.length - 1 && eventsList.length != 0) {
        startDay = activeDay;
        startMonth = month - 1;
        startDate = new Date(year, startMonth, startDay);
        diffInTime = endDate.getTime() - startDate.getTime();
        diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));
    }
    FEEventDescription.textContent = eventsList[diffInDays];

    FEEvent.appendChild(FEEventTime);
    FEEvent.appendChild(FEEventDescription);

    FESchedule.appendChild(FEEvent);
}

const changeArrowsColor = () => {
    if (activeDay == 1 && month == currentMonth) {
        document.getElementById('arrow-left--left').style.display = 'block';
        document.getElementById('arrow-left--right').style.display = 'none';
    } else {
        document.getElementById('arrow-left--left').style.display = 'none';
        document.getElementById('arrow-left--right').style.display = 'block';
    }
}

const addEventsList = () => {
    const specialDaysList = document.querySelector('.events__calendar-special');
    specialDaysList.innerHTML = '';
    for (let i = 0; i < new Date(year, month, 0).getDate(); i++) {
        const li = document.createElement('li');
        li.classList.add('events__calendar-special-item');

        const wrap = document.createElement('div');
        wrap.classList.add('events__calendar-special-date-wrapper');

        const date = document.createElement('div');
        date.classList.add('events__calendar-special-date')
        const day = document.createElement('div');
        day.classList.add('events__calendar-special-day')
        const specialMonth = document.createElement('div');
        specialMonth.classList.add('events__calendar-special-month');
        date.appendChild(day);
        date.appendChild(specialMonth);

        const week = document.createElement('p');
        week.classList.add('events__calendar-special-week');

        wrap.appendChild(date);
        wrap.appendChild(week);

        const title = document.createElement('h4');
        title.classList.add('events__calendar-special-title');

        li.appendChild(wrap);
        li.appendChild(title);

        day.textContent = i + 1;
        const dayOfWeekIndex = getDay(new Date(year, month - 1, i + 1));
        week.textContent = daysOfWeek[dayOfWeekIndex]; 

        specialMonth.textContent = whichMonthNames[month - 1];

        specialDaysList.appendChild(li);

        let startDay = 1;
        let startMonth = 2;
        let startYear = 2024;

        let startDate = new Date(startYear, startMonth, startDay);
        const endDate = new Date(year, month - 1, i + 1);
        let diffInTime = endDate.getTime() - startDate.getTime();
        let diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

        if (diffInDays > eventsList.length - 1) {
            startDay = activeDay;
            startMonth = month;
            startDate = new Date(year, startMonth, startDay);
            diffInTime = endDate.getTime() - startDate.getTime();
            diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));
        }

        title.textContent = eventsList[diffInDays];
    }
};

const changeDayFromEventsList = () => {
    document.querySelector('.events__calendar-special').addEventListener('click', e => {
        const item = e.target.closest('.events__calendar-special-item');
        if (item) {
            document.querySelectorAll('[data-calendar-day]').forEach(day => {
                if (day.textContent == activeDay && day.textContent != currentDay) {
                    day.classList.remove('current-day');
                }
            })
            const newDay = item.querySelector('.events__calendar-special-day')
            activeDay = newDay.textContent;
            weekDayNum = getDay(new Date(year, month - 1, activeDay))
            document.querySelectorAll('[data-calendar-day]').forEach(day => {
                if (day.textContent == activeDay) {
                    day.classList.add('current-day');
                }
            })

            addDataInChoiceDay();
            document.querySelectorAll('[data-calendar-week]').forEach(week => {
                const daysInWeek = week.querySelectorAll('[data-calendar-day]')
                daysInWeek.forEach(day => {
                    if (day.textContent == activeDay) {
                        addDataInFE(daysInWeek);
                    }
                })
            })
            changeEventInFE();
        }
    })
}

const mainFunction = () => {
    createCalendar('.events__calendar', year, month);

    selectInCalendar();

    addDataInChoiceDay();

    changeDayFromArrows();

    changeEventInFE();

    changeArrowsColor();

    addEventsList();

    changeDayFromEventsList();
}

mainFunction();