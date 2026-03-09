# Booking Calendar

Lightweight **JavaScript Booking Calendar Plugin** with time slot selection.

This plugin allows users to select a **date and time slot** for booking appointments.  
Built with **Vanilla JavaScript**, no dependencies required.

---

# Features

- 📅 Interactive calendar UI
- ⏰ Time slot booking
- 🌗 Light & Dark theme
- 🎨 Custom primary color
- 🚫 Disable past dates
- ❌ Disable booked slots
- 📱 Responsive design
- 🔁 Multiple calendar instances
- 🧩 Easy integration
- ⚡ Lightweight (no dependencies)

---

# Demo

Open the demo page: demo/index.html


---

# Installation

Include the CSS and JavaScript files in your project.

```html
<link rel="stylesheet" href="dist/booking-calendar.css">

<script src="dist/booking-calendar.min.js"></script>

Add a container element where the calendar will be rendered.
<div id="calendar"></div>

Basic Usage
const calendar = new BookingCalendar("#calendar", {

    theme: "light",

    primaryColor: "#FFEB00",

    startHour: 9,
    endHour: 18,

    bookedSlots: {
        "2026-03-12": ["09:00","10:30"],
        "2026-03-15": ["14:00"]
    },

    onDateSelect: (data) => {
        console.log("Selected date:", data.date)
    },

    onSlotSelect: (data) => {
        console.log("Selected slot:", data.time)
    }

})

Configuration Options
Option	        Type	    Description
theme	        string	    "light" or "dark"
primaryColor	string	    Main accent color
startHour	    number	    Start booking hour
endHour	        number	    End booking hour
slotDuration	number	    Time slot interval (minutes)
bookedSlots	    object	    Predefined booked slots
onDateSelect	function	Callback when date selected
onSlotSelect	function	Callback when slot selected

Example:
    new BookingCalendar("#calendar",{
    theme:"dark",
    primaryColor:"#22c55e",
    startHour:10,
    endHour:20
})