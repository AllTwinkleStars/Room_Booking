import moment from 'moment'
import momentTimezone from 'moment-timezone'
import api from './init'

export function listRooms() {
  return api.get('/rooms')
    .then((res) => res.data)
}

// Function to convert retrieved booking data (as a UTC JS Date object) to a Moment.js object in AEST
const dateAEST = (date) => {
  return momentTimezone(date).tz('Australia/Sydney')
}

// Function to calculate the duration of the hours between the start and end of the booking
const durationHours = (bookingStart, bookingEnd) => {
  // convert the UTC Date objects to AEST Moment.js objeccts
  let startDateLocal = dateAEST(bookingStart)
  let endDateLocal = dateAEST(bookingEnd)
  // calculate the duration of the difference between the two times
  let difference = moment.duration(endDateLocal.diff(startDateLocal))
  // return the difference in decimal format
  return difference.hours() + difference.minutes() / 60
}

// Accepts the current date in 'YYYY/MM/DD' format and all of a room's bookings and returns an array of each booking which matches that date
export function dailyBookings(currentDate, roomBookings) {
  // Map each booking to an array
  Object.keys(roomBookings).map((booking) => {
    // Check if the booking is for the current date 
    if (dateAEST(booking.bookingStart).format('YYYY/MM/DD') === currentDate) {
      return booking
    } else {
      return null
    }
  })
}


