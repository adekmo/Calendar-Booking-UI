const slotConfig = {
startHour: 9,
endHour: 17,
slotDuration: 30
}

const bookedSlots = {
    "2026-06-14":[
    "09:30",
    "10:00",
    "14:30"
    ],

    "2026-06-15":[
    "11:00",
    "11:30"
    ],

    "2026-06-18":[
    "09:00",
    "13:30"
    ]
}

const slotsContainer = document.querySelector(".slots-grid")

const datesContainer = document.querySelector(".calendar-dates")
const monthTitle = document.querySelector(".month-title")

const prevBtn = document.getElementById("prevMonth")
const nextBtn = document.getElementById("nextMonth")

let currentDate = new Date()
let selectedDate = null

function formatDate(date){

    const year = date.getFullYear()

    const month = (date.getMonth()+1)
    .toString()
    .padStart(2,"0")

    const day = date.getDate()
    .toString()
    .padStart(2,"0")

    return `${year}-${month}-${day}`

}

function renderCalendar(){

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const totalDays = lastDay.getDate()

    const startDay = firstDay.getDay()

    const today = new Date()

    datesContainer.innerHTML = ""

    const monthNames = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ]

    monthTitle.innerText = `${monthNames[month]} ${year}`

    // FIX Sunday start
    let offset = startDay === 0 ? 6 : startDay - 1

    for(let i = 0; i < offset; i++){
        const empty = document.createElement("div")
        datesContainer.appendChild(empty)
    }

    for(let day = 1; day <= totalDays; day++){

        const date = new Date(year, month, day)

        const dateElement = document.createElement("div")
        dateElement.classList.add("calendar-date")
        dateElement.innerText = day

        const formattedDate = formatDate(date)

        if(bookedSlots[formattedDate]){
            dateElement.classList.add("has-booking")
        }

        // highlight today
        if(
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
            ){
            dateElement.classList.add("today")
        }

        // disable past dates
        if(date < new Date(today.getFullYear(), today.getMonth(), today.getDate())){
            dateElement.style.opacity = "0.3"
            dateElement.style.pointerEvents = "none"
        }

        // click event
        dateElement.addEventListener("click", ()=>{

            document.querySelectorAll(".calendar-date").forEach(d=>{
                d.classList.remove("selected")
            })

            dateElement.classList.add("selected")

            selectedDate = date
            generateTimeSlots(selectedDate)

            console.log("Selected:", selectedDate)

        })

        datesContainer.appendChild(dateElement)

    }

}

function generateTimeSlots(date){

    slotsContainer.innerHTML = ""

    if(!date) return

    const formattedDate = formatDate(date)

    const dayBookedSlots = bookedSlots[formattedDate] || []

    const {startHour,endHour,slotDuration} = slotConfig

    let start = new Date()
    start.setHours(startHour,0,0)

    let end = new Date()
    end.setHours(endHour,0,0)

    while(start < end){

        let hours = start.getHours().toString().padStart(2,"0")
        let minutes = start.getMinutes().toString().padStart(2,"0")

        let time = `${hours}:${minutes}`

        const slot = document.createElement("button")
        slot.classList.add("slot")

        slot.innerText = time

        // disable booked slot
        if(dayBookedSlots.includes(time)){
            slot.classList.add("booked")
            slot.disabled = true
        }

        slot.addEventListener("click",()=>{

                document.querySelectorAll(".slot").forEach(s=>{
                s.classList.remove("selected")
            })

            slot.classList.add("selected")

            console.log("Selected slot:", time)

        })

        // if(bookedSlots.includes(time)){
        //     slot.classList.add("booked")
        //     slot.disabled = true
        // }

    slotsContainer.appendChild(slot)

    start.setMinutes(start.getMinutes()+slotDuration)

    }

}

prevBtn.addEventListener("click", ()=>{

    currentDate.setMonth(currentDate.getMonth() - 1)

    renderCalendar()

})

nextBtn.addEventListener("click", ()=>{

    currentDate.setMonth(currentDate.getMonth() + 1)

    renderCalendar()

})

renderCalendar()