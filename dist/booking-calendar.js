class BookingCalendar {

    constructor(element, options = {}) {

        this.container = document.querySelector(element)

        if (!this.container) {
            throw new Error("BookingCalendar: container not found")
        }

        this.options = {

            startHour: 9,
            endHour: 17,
            slotDuration: 30,

            bookedSlots: {},

            theme: "light",
            primaryColor: "#687231",

            onDateSelect: null,
            onSlotSelect: null,

            ...options

        }

        this.currentDate = new Date()
        this.selectedDate = null
        this.selectedSlot = null
        this.viewMode = "month"

        this.init()

    }

    init() {

        this.applyTheme()

        this.renderLayout()
        this.renderCalendar()

    }

    applyTheme() {

        this.container.classList.add("bc-theme-" + this.options.theme)

        this.container.style.setProperty(
            "--bc-primary",
            this.options.primaryColor
        )

    }

    renderLayout() {
        this.container.innerHTML = `
        <div class="booking-calendar-wrapper">
            <div class="calendar-header">
                <h2 class="month-title"></h2>
                <div class="calendar-actions">
                    <button class="theme-toggle">🌙</button>
                    <div class="nav-btns">
                        <button class="prev-btn">‹</button>
                        <button class="next-btn">›</button>
                    </div>
                </div>
            </div>

            <div class="calendar-days">
                <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
            </div>

            <div class="calendar-dates"></div>

            <div class="time-slots">
                <h3>Available Time</h3>
                <div class="slots-grid"></div>
            </div>

            <button class="book-btn">Book Appointment</button>

            <div class="booking-modal" style="display: none;">
                <div class="modal-content">
                    <h3>Confirm Booking</h3>
                    <p>You are booking for:</p>
                    <div class="booking-info"></div>
                    <div class="modal-actions">
                        <button class="confirm-booking">Confirm Booking</button>
                        <button class="close-modal">Maybe Later</button>
                    </div>
                </div>
            </div>
        </div>
        `;

        // RE-ASSIGN SELECTORS (Penting: harus setelah innerHTML)
        this.datesContainer = this.container.querySelector(".calendar-dates");
        this.monthTitle = this.container.querySelector(".month-title");
        this.slotsContainer = this.container.querySelector(".slots-grid");
        this.themeToggle = this.container.querySelector(".theme-toggle");
        this.prevBtn = this.container.querySelector(".prev-btn");
        this.nextBtn = this.container.querySelector(".next-btn");
        this.modal = this.container.querySelector(".booking-modal"); // Referensi Baru
        this.bookingInfo = this.container.querySelector(".booking-info");
        this.confirmBtn = this.container.querySelector(".confirm-booking");
        this.closeModal = this.container.querySelector(".close-modal");
        this.bookBtn = this.container.querySelector(".book-btn");

        this.attachEvents();
    }

    attachEvents() {
        // Tombol Utama
        this.bookBtn.onclick = () => {
            if (!this.selectedDate || !this.selectedSlot) {
                alert("Please select date and time first");
                return;
            }
            const dateStr = this.formatDate(this.selectedDate);
            this.bookingInfo.innerText = `${dateStr} at ${this.selectedSlot}`;
            
            // Munculkan Modal
            this.modal.style.display = "flex";
            setTimeout(() => this.modal.classList.add("active"), 10);
        };

        // Tombol Close Modal
        this.closeModal.onclick = () => {
            this.modal.classList.remove("active");
            setTimeout(() => this.modal.style.display = "none", 300);
        };

        // Tombol Confirm Modal
        this.confirmBtn.onclick = () => {
            const dateStr = this.formatDate(this.selectedDate);
            this.addBooking(dateStr, this.selectedSlot);
            this.modal.classList.remove("active");
            setTimeout(() => this.modal.style.display = "none", 300);
            alert("Booking Successful!");
        };

        // Navigasi & Theme
        this.prevBtn.onclick = () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        };
        this.nextBtn.onclick = () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        };
        this.themeToggle.onclick = () => this.toggleTheme();
    }

    formatDate(date) {

        const year = date.getFullYear()

        const month = (date.getMonth() + 1)
            .toString()
            .padStart(2, "0")

        const day = date.getDate()
            .toString()
            .padStart(2, "0")

        return `${year}-${month}-${day}`

    }

    renderCalendar() {
        // if(this.viewMode === "week"){
        //     this.renderWeekView();
        //     return;
        // }
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const totalDays = lastDay.getDate();
        const startDay = firstDay.getDay();

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.monthTitle.innerText = `${monthNames[month]} ${year}`;

        this.datesContainer.innerHTML = "";
        this.slotsContainer.innerHTML = "";

        let offset = startDay === 0 ? 6 : startDay - 1;
        for (let i = 0; i < offset; i++) {
            const empty = document.createElement("div");
            empty.classList.add("calendar-date", "empty");
            this.datesContainer.appendChild(empty);
        }

        const today = new Date();
        today.setHours(0,0,0,0);

        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(year, month, day);
            const dateElement = document.createElement("div");
            dateElement.classList.add("calendar-date");
            dateElement.innerText = day;

            if (date < today) {
                dateElement.classList.add("disabled");
            }

            const formattedDate = this.formatDate(date);

            // LOGIKA DOT: Muncul jika ada booking di tanggal tersebut
            if (this.options.bookedSlots[formattedDate] && this.options.bookedSlots[formattedDate].length > 0) {
                dateElement.classList.add("has-booking");
            }

            dateElement.addEventListener("click", () => {
                this.container.querySelectorAll(".calendar-date").forEach(d => d.classList.remove("selected"));
                dateElement.classList.add("selected");
                this.selectedDate = date;
                
                if (this.options.onDateSelect) {
                    this.options.onDateSelect({ date: this.formatDate(date) });
                }
                this.generateTimeSlots(date);
            });

            this.datesContainer.appendChild(dateElement);
        }
    }

    generateTimeSlots(date) {
        this.slotsContainer.innerHTML = "";
        if (!date) return;

        const formattedDate = this.formatDate(date);
        // Ambil daftar jam yang sudah dibooking untuk tanggal ini
        const booked = this.options.bookedSlots[formattedDate] || [];

        let start = new Date(date);
        start.setHours(this.options.startHour, 0, 0);
        let end = new Date(date);
        end.setHours(this.options.endHour, 0, 0);

        while (start < end) {
            let hours = start.getHours().toString().padStart(2, "0");
            let minutes = start.getMinutes().toString().padStart(2, "0");
            let time = `${hours}:${minutes}`;

            const slot = document.createElement("button");
            slot.classList.add("slot");
            slot.innerText = time;

            // MATIKAN JAM: Jika jam ada di daftar 'booked'
            if (booked.includes(time)) {
                slot.classList.add("booked");
                slot.disabled = true; // Tombol tidak bisa diklik
            }

            slot.addEventListener("click", () => {
                if (slot.classList.contains("booked")) return;
                this.container.querySelectorAll(".slot").forEach(s => s.classList.remove("selected"));
                slot.classList.add("selected");
                this.selectedSlot = time;

                if (this.options.onSlotSelect) {
                    this.options.onSlotSelect({ date: this.formatDate(date), time: time });
                }
            });

            this.slotsContainer.appendChild(slot);
            start.setMinutes(start.getMinutes() + this.options.slotDuration);
        }
    }

    toggleTheme(){

        if(this.options.theme === "light"){
            this.options.theme = "dark"
        }else{
            this.options.theme = "light"
        }

        this.container.classList.remove("bc-theme-light","bc-theme-dark")
        this.container.classList.add("bc-theme-"+this.options.theme)

    }

    getSelectedDate() {
        return this.selectedDate
    }

    getSelectedSlot() {
        return this.selectedSlot
    }

    addBooking(date, time) {

        const formattedDate = this.formatDate(new Date(date))

        if (!this.options.bookedSlots[formattedDate]) {
            this.options.bookedSlots[formattedDate] = []
        }

        this.options.bookedSlots[formattedDate].push(time)

        this.renderCalendar()

    }

    clearSelection() {

        this.selectedDate = null
        this.selectedSlot = null

        this.container.querySelectorAll(".selected")
            .forEach(el => el.classList.remove("selected"))

        this.slotsContainer.innerHTML = ""

    }

    destroy() {
        this.container.innerHTML = ""
    }

}

window.BookingCalendar = BookingCalendar