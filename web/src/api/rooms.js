import React from 'react'
import moment from 'moment'
import momentTimezone from 'moment-timezone'
import api from './init'

export function listRooms() {
  return api.get('/rooms').then(res => res.data)
}

// Accepts the search date in 'YYYY/MM/DD' format and all of a room's bookings and filters the array for bookings that match the search date
export function dailyBookings(currentDate, roomBookings) {
  const filteredBookings = roomBookings.filter(
    (
      booking // Check if the booking is for the current date
    ) =>
      moment(booking.bookingStart).format('YYYY-MM-DD') ===
      moment(currentDate).format('YYYY-MM-DD')
  )
  return filteredBookings
}


// A function to take the bookings for a particular room on a given date and insert them into an array which maps each hour of that day
export function bookingArray(filteredBookings) {
  
  // An array from 1 to 24 representing each hour of the day
  let dayHours = [...Array(24).keys()]

  filteredBookings.forEach(booking => {
    let startTime = booking.startHour
    let duration = booking.duration
    let finalHour = startTime + duration

    // Push each booking into the relevant hour in the 24 hour array 
    // Loop from the beginning of the start hour to the end of the final hour (rounding half hours)
    for (let i = Math.floor(startTime); i < Math.ceil(finalHour); i++) {

      // Create a copy of the booking to customise for each hour
      let bookingData = Object.assign({}, booking)

      // Check if the start time is on the hour, or half hour, and that this is the start of the booking duration
      if (i === Math.floor(startTime) && startTime % 1 !== 0 ) {
        // If on the half hour, add this to the booking object
        bookingData.secondHalfHour = true
      }

      // Check if the end time is on the hour, or half hour, and that this is the end of the booking duration
      if (i === Math.ceil(finalHour - 1) && finalHour % 1 !== 0 ) {
        bookingData.firstHalfHour = true
      }

      // Add the booking object to the relevant hour in the 24 hour array
      dayHours[i] = bookingData
    }
  })

  // Return the 24 hour array with all booking objects added to each hour they apply to
  return dayHours
}
  
// Accept the 24 hour dayHours array as the day's booking data for a room
export function rowMapper(dayHours){
  let tableRow = []

  // Loop through each hour from 8AM to 9PM (starting at 8AM = 0)
  for (var i = 0; i < 13; i++) {

    // Extract the corresponding data from the 24 hour array 
    let bookingData = dayHours[i + 8]

    // If the data for that hour is a number (not a booking object), there is no booking
    // Add a <td> element that indicates the time slot is available
    if (typeof bookingData == 'number') {
      tableRow.push(
        <td className="available">Available</td>
      )

    // If there is a booking object, add a <td> element with custom class name to enable stlying
    } else {
      tableRow.push(
        <td
        // Class name will show the business unit that made the booking, and whether the <td> element should be fully shaded, or half shaded (indicating a half-hour booking)
          className={`${bookingData.businessUnit
            .replace(/ /g, '-')
            .toLowerCase()}
            ${bookingData.firstHalfHour ? "first-half-hour" : '' }
            ${bookingData.secondHalfHour ? "last-half-hour" : '' }
          `}
        >
          {bookingData.businessUnit}
        </td>
      )
    }
  }
  return tableRow
}
  