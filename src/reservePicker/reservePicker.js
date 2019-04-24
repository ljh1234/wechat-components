// components/reservePicker/reservePicker.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        timespace: {
            type: Number,
            value: 30
        },
        yearspace: {
            type: Number,
            value: 3
        },
        title: {
            type: String,
            value: '请选择预约时间'
        }
    },
    lifetimes: {
        attached() {
            this.setData({
                STARTDATE_: new Date(new Date().getTime() + this.data.timespace * 60000)
            }, () => {
                this.init();
            })
            // console.log(this.data);
            
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        STARTDATE_: '',
        years: [],
        months: [],
        days: [],
        hours: [],
        minutes: [],
        pickerValue: [0,0,0,0,0],
        show: false
    },

    /**
     * 组件的方法列表
     */
    methods: {
        show() {
            this.init();
            this.setData({
                show: true
            })
        },
        close() {
            this.setData({
                show: false
            });
        },
        confirm() {
            const year = this.data.years[this.data.pickerValue[0]];
            const month = this.data.months[this.data.pickerValue[1]];
            const day = this.data.days[this.data.pickerValue[2]];
            const hour = this.data.hours[this.data.pickerValue[3]];
            const minute = this.data.minutes[this.data.pickerValue[4]];

            this.triggerEvent('pickerconfirm', {
                value: (year + '-' + (month < 10 ? '0' + month : month) + "-" + (day < 10 ? '0' + day : day) + ' ' + (hour < 10 ? '0' + hour : hour) + ":" + (minute < 10 ? '0' + minute : minute)) + ':00'
            }, {});
            this.close();
            return (year + '-' + (month < 10 ? '0' + month : month) + "-" + (day < 10 ? '0' + day : day) + ' ' + (hour < 10 ? '0' + hour : hour) + ":" + (minute < 10 ? '0' + minute : minute)) + ':00';
        },
        init() {
            const startDate = this.data.STARTDATE_;
            this.setData({
                pickerValue: [0, 0, 0, 0, 0]
            });
            this.initYears(startDate.getFullYear());
            this.initMonth(startDate.getMonth() + 1);
            this.initDays(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
            this.initHours(startDate.getHours());
            this.initMinutes(startDate.getMinutes(), this.data.timespace);
        },
        initYears(startYear) {
            let year_list = [];
            
            for (let i = startYear; i <= (startYear + this.data.yearspace); i++) {
                year_list.push(i)
            }

            this.setData({
                years: year_list
            });
        },
        initMonth(startMonth) {
            let month_list  = [];
            for(let i = startMonth; i <= 12; i++) {
                month_list.push(i);
            }
            this.setData({
                months: month_list 
            });
        },
        initDays(year, month, startDay) {
            let day_list = [];
            for (let i = startDay; i <= this._getMonthDays(year, month); i++) {
                day_list.push(i)
            }

            this.setData({
                days: day_list
            });
        },
        initHours(startHour) {
            let hour_list = [];
            for(let i = startHour; i <= 23; i++) {
                hour_list.push(i);
            }

            this.setData({
                hours: hour_list
            });
        },
        initMinutes(startMinutes, timeSpace) {
            let minute_list = [startMinutes];
            this._iterationAdd(minute_list, startMinutes, timeSpace);
            // console.log(minute_list);
            
            this.setData({
                minutes: minute_list
            });
           
        },
        _iterationAdd(arr, start, gradient) {
            if (start + gradient < 60) {
                arr.push(start + gradient);
               // debugger;
                this._iterationAdd(arr, start + gradient, gradient);
            } else {
                return;
            }
        },
        _getMonthDays(year, month) {
            return new Date(year, month, 0).getDate();
        },
        _pickerChange(e) {
            // console.log('pickerChange', e);
            const startDate = this.data.STARTDATE_;
            const nowValue = e.detail.value;
            const whichMove = this._whichViewIsMove(this.data.pickerValue, nowValue);
            if (whichMove === 'years') {
                if (this.data.years[nowValue[0]] === Number(startDate.getFullYear())) {
                    this.init()
                } else {
                    this.initMonth(1);
                    this.initDays(this.data.years[nowValue[0]], 1, 1);
                    this.initHours(0);
                    this.initMinutes(0, this.data.timespace);
                }
               
            } else if(whichMove === 'months') {
                if (this.data.years[nowValue[0]] === Number(startDate.getFullYear()) 
                    && this.data.months[nowValue[1]] === Number(startDate.getMonth() + 1)
                ) {
                    this.init();
                } else {
                    this.initDays(this.data.years[nowValue[0]], this.data.months[nowValue[1]], 1);
                    this.initHours(0);
                    this.initMinutes(0, this.data.timespace);
                } 
            } else if(whichMove === 'days') {
                if (this.data.years[nowValue[0]] === Number(startDate.getFullYear())
                    && this.data.months[nowValue[1]] === Number(startDate.getMonth() + 1)
                    && this.data.days[nowValue[2]] === Number(startDate.getDate())
                ) {
                    this.init();
                } else {
                    this.initHours(0);
                    this.initMinutes(0, this.data.timespace);
                }
            } else if(whichMove === 'hours') {
                 if (this.data.years[nowValue[0]] === Number(startDate.getFullYear())
                    && this.data.months[nowValue[1]] === Number(startDate.getMonth() + 1)
                    && this.data.days[nowValue[2]] === Number(startDate.getDate())
                    && this.data.hours[nowValue[3]] === Number(startDate.getHours())
                ) {
                    this.init();
                } else {
                    this.initMinutes(0, this.data.timespace);
                }
            }
            this.setData({
                pickerValue: nowValue
            });
        },
        _whichViewIsMove(preValue, nowValue) {
            let whichMove = '';
            
            preValue.forEach((item, i, arr) => {
                if(nowValue[i]- item !== 0) {
                    switch (i) {
                        case 0:
                            whichMove = 'years'
                            break;
                        case 1:
                            whichMove = 'months'
                            break;
                        case 2: 
                            whichMove = 'days'
                            break;
                        case 3: 
                            whichMove = 'hours'
                            break;
                        case 4:
                            whichMove = 'minutes'
                            break;
                        default:
                            break;
                    }
                    return;
                }
            });

            return whichMove
        },
    }
})