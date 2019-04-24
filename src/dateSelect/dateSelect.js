// components/dateSelect/dateSelect.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    startYear: {
        type: Number,
        value: new Date().getFullYear()
    },
    endYear: {
        type: Number,
        value: new Date().getFullYear() + 10
    },
    show: {
        type: Boolean,
        value: false
    },
    key: {
        type: String,
        value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
        weekList: {
            cn: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            cns: ['日', '一', '二', '三', '四', '五', '六'],
            en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        },
        dayList:[

        ],
        monthList: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        yearList: [],
        pickerList: [],
        currentMonth: '',
        currentYear: '',
        selectDate: '',
        selectYear: '',
        selectMonth: '',
        pickerValue: [],
        showMonthList: false

  },
  attached () {
        this.init();
        console.log(this.data);
        
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
        this.setData({
            show: false
        });
    },
    dayUpdate() {
        this.triggerEvent('dateselect', { value: this.data.selectDate, key: this.data.key }, {});
    },
    daySelect(e) {
        // console.log('dayIndex', e);
        const dayIndex = e.currentTarget.dataset.key;
        let selectDay = this.data.dayList[dayIndex];
        
        if (selectDay.monthType === 'pre' || selectDay.monthType === 'next') {
            if (selectDay.monthType === 'pre') {
                let selectMonth = this.data.selectMonth;
                // 月份减小一个月,判断是否需要到前一年
                if (selectMonth - 1 <= 0) {
                    // 判断提前一年是否超过了起始年份
                    let startYear = this.data.startYear;
                    let selectYear = this.data.selectYear;
                    if ((selectYear - 1) - startYear < 0) {
                        return;
                    } else {
                        this.initDayList(selectYear - 1, 12, selectDay.dayNum);
                        this.setData({
                            selectYear: selectYear - 1,
                            selectMonth: 12,
                            selectDay: selectDay.dayNum,
                            pickerValue: [this.data.pickerValue[0] - 1, this.data.pickerValue[this.data.pickerValue.length - 1]]
                        })
                    }
                } else {
                    this.initDayList(this.data.selectYear, selectMonth - 1, selectDay.dayNum);
                    this.setData({
                        selectMonth: selectMonth - 1,
                        selectDay: selectDay.dayNum,
                        pickerValue: [this.data.pickerValue[0], this.data.pickerValue[1] - 1]
                    })
                }
            } else {
                // 判断是否为最后一个月,下一年
                let selectMonth = this.data.selectMonth;
                if (12 - selectMonth <= 0) {
                    // 判断下一年是否超过了限制的最后一年
                    let endYear = this.data.endYear;
                    let selectYear = this.data.selectYear;
                    if (endYear - (selectYear + 1) < 0) {
                        return;
                    } else {
                        this.initDayList(selectYear + 1, 1, selectDay.dayNum);
                        this.setData({
                            selectYear: selectYear + 1,
                            selectMonth: 1,
                            selectDay: selectDay.dayNum,
                            pickerValue: [this.data.pickerValue[0] + 1, this.data.pickerValue[0]]
                        })
                    }
                } else {
                    this.initDayList(this.data.selectYear, selectMonth + 1, selectDay.dayNum);
                    this.setData({
                        selectMonth: selectMonth + 1,
                        selectDay: selectDay.dayNum,
                         pickerValue: [this.data.pickerValue[0], this.data.pickerValue[1] + 1]
                    })
                }
            }
        } else {
            let list = this.data.dayList;
            list.forEach((item, ind, arr) => {
                if (dayIndex === ind) {
                    item.selected = true;
                } else {
                    item.selected = false;
                }
            });
            this.setData({
                selectDate: this.data.selectYear + '-' +(this.data.selectMonth < 10 ? '0' + this.data.selectMonth : this.data.selectMonth) + '-' + (selectDay.dayNum < 10 ? '0' + selectDay.dayNum : selectDay.dayNum),
                dayList: list
            }, () => {
                
            })
        }
    },
    getMonthDays(year, month) {
        return new Date(year, month, 0).getDate();
    },
    getWeekday(year, month, day) {
        return new Date(year, month - 1, day).getDay();
    },
    getweeksInMonth(year, month) {
        const days = getMonthDays(year, month);
        const FirstDayWeekday = getWeekday(year, month, 1);
        return Math.ceil(days + FirstDayWeekday);
    },
    getMonthDaysArray(year, month, day) {
        // if (typeof day === 'undefined' && year === YEAR && month === MONTH) day = DAY;
        const WEEKTABLE = this.data.weekList;
        let dayArrays = [];
        let days = this.getMonthDays(year, month),
            preDays = this.getMonthDays(year, month - 1);
        let thisMonthFirstDayInWeek = this.getWeekday(year, month, 1),
            thisMonthLastDayInWeek = this.getWeekday(year, month, days);


        //上月在当月日历面板中的排列
        for (let i = 0; i < thisMonthFirstDayInWeek; i++) {
            dayArrays.push({
                dayNum: (preDays - thisMonthFirstDayInWeek + i + 1),
                weekDay: WEEKTABLE.cn[i],
                monthType: 'pre'
            })
        }
        //当月日历面板中的排列
        for (let i = 1; i <= days; i++) {
            let weekDayFlag = (thisMonthFirstDayInWeek + i - 1) % 7
            dayArrays.push({
                dayNum: i,
                weekDay: WEEKTABLE.cn[weekDayFlag],
                selected: i === +day,
                monthType: 'curr'
            })
            if (i === +day) {
                this.setData({
                    selectDate: (year + '') +  '-' +(month < 10 ? '0'+ month : month + '') + '-' + (day < 10 ? '0' + day : day + '')
                })
            }
        };
        //下月在当月日历面板中的排列
        for (let i = 1; i <= (6 - thisMonthLastDayInWeek); i++) {
            let weekDayFlag = (thisMonthFirstDayInWeek + days + i - 1) % 7
            dayArrays.push({
                dayNum: i,
                weekDay: WEEKTABLE.cn[weekDayFlag],
                monthType: 'next'
            })
        };
        return dayArrays;
    },
    preMonth() {
        let selectMonth = this.data.selectMonth;
        // 月份减小一个月,判断是否需要到前一年
        if (selectMonth - 1 <= 0) {
            // 判断提前一年是否超过了起始年份
            let startYear = this.data.startYear;
            let selectYear = this.data.selectYear;
            if ((selectYear - 1) - startYear < 0) {
                return;
            } else {
                this.initDayList(selectYear - 1, 12, 1);
                this.setData({
                    selectYear: selectYear - 1,
                    selectMonth: 12,
                    selectDay: 1,
                    pickerValue: [this.data.pickerValue[0] - 1, this.data.pickerValue[this.data.pickerValue.length - 1]]
                })
            }
        } else {
            this.initDayList(this.data.selectYear, selectMonth - 1, 1);
            this.setData({
                selectMonth: selectMonth - 1,
                selectDay: 1,
                pickerValue: [this.data.pickerValue[0], this.data.pickerValue[1] - 1]
            })
        }
    },
    nextMonth() {
        let selectMonth = this.data.selectMonth;
        if (12 - selectMonth <= 0) {
            // 判断下一年是否超过了限制的最后一年
            let endYear = this.data.endYear;
            let selectYear = this.data.selectYear;
            if (endYear - (selectYear + 1) < 0) {
                return;
            } else {
                this.initDayList(selectYear + 1, 1, 1);
                this.setData({
                    selectYear: selectYear + 1,
                    selectMonth: 1,
                    selectDay: 1,
                    pickerValue: [this.data.pickerValue[0] + 1, this.data.pickerValue[0]]
                })
            }
        } else {
            this.initDayList(this.data.selectYear, selectMonth + 1, 1);
            this.setData({
                selectMonth: selectMonth + 1,
                selectDay: 1,
                pickerValue: [this.data.pickerValue[0], this.data.pickerValue[1] + 1]
            })
        }
    },
    init() {
        const now = new Date();
        this.initYearList();
        this.initDayList(now.getFullYear(), now.getMonth() + 1, now.getDate());
        this.initNowMon_Year();
        this.initPickerList();
    },
    initYearList() {
        let list = [];
        let startYear = this.data.startYear;
        for (let i = startYear; i <= this.data.endYear; i++) {
            list.push(startYear++);
        }
        this.setData({
            yearList: list
        });

        return list;
    },
    initDayList (year, month, day) {
        const now = new Date();
        this.setData({
            dayList: this.getMonthDaysArray(year, month, day)
        });
    },
    initPickerList() {
        let yearIndex = 0;
        let monthIndex = 0;
        const yearList = this.initYearList();
        const monthList = this.data.monthList;
        yearList.forEach((item, index, arr) => {
            if(item === this.data.currentYear) {
                yearIndex = index;
                return;
            }
        });
        monthList.forEach((m, index, arr) => {
            if (m === this.data.currentMonth) {
                monthIndex = index;
                return;
            }
        })


        this.setData({
            pickerList: [this.initYearList(), this.data.monthList],
            pickerValue: [yearIndex, monthIndex]
        })
    },
    initNowMon_Year() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        // const selet

        this.setData({
            currentMonth: currentMonth,
            currentYear: currentYear,
            selectYear: currentYear,
            selectMonth: currentMonth
        })
    },
    monthPickerChange(e) {
        //console.log('colu', e);
        this.setData({
            pickerValue: e.detail.value
        });
    },
    monthConfirm(e) {
        // console.log('chang',e);
        const value = this.data.pickerValue;
        const now = new Date();

        if (now.getFullYear() === this.data.yearList[value[0]] && now.getMonth() + 1 === this.data.monthList[value[1]]) {
            this.initDayList(this.data.yearList[value[0]], this.data.monthList[value[1]], now.getDate());
        } else {
            this.initDayList(this.data.yearList[value[0]], this.data.monthList[value[1]], 1);
        }
        
        this.setData({
            selectYear: this.data.yearList[value[0]],
            selectMonth: this.data.monthList[value[1]]
        })
        this.closeMonthList();
    },
    closeMonthList() {
        this.setData({
            showMonthList: false
        });
    },
    showMonthList() {
        this.setData({
            showMonthList: true
        })
    }
  }
})
