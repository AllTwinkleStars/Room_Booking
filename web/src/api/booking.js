import moment from 'moment'
import momentTimezone from 'moment-timezone'
import api from './init'

// Function to receive booking data (AEST) and convert to JS Date object
// Data expected in [year, month, date, hours, seconds] format
const dateUTC = (dataArray) => {
  // Ensure date data is saved in AEST and then converted to a Date object in UTC
  return momentTimezone(dataArray).tz('Australia/Sydney').toDate()
}

// Make a room booking
export function makeBooking(data, existingBookings) {
  // Convert booking data to UTC Date objects
  let bookingStart = dateUTC(data.startDate)
  let bookingEnd = dateUTC(data.endDate)

  // Convert booking Date objects into a number value
  let newBookingStart = bookingStart.getTime()
  let newBookingEnd = bookingEnd.getTime()

  // Check whether the new booking times overlap with any of the existing bookings
  let bookingClash = false

  existingBookings.forEach(booking => {

    // Convert existing booking Date objects into number values
    let existingBookingStart = new Date(booking.bookingStart).getTime()
    let existingBookingEnd = new Date(booking.bookingEnd).getTime()

    // Check whether there is a clash between the new booking and the existing booking
    if (newBookingStart >= existingBookingStart && newBookingStart < existingBookingEnd || 
        existingBookingStart >= newBookingStart && existingBookingStart < newBookingEnd) {
          // Switch the bookingClash variable if there is a clash
          return bookingClash = true
    }
  })

  // Check whether the new booking times are for past times
  let pastDate = false

  if (newBookingStart < new Date().getTime()) {
    return pastDate = true
  }
  
  // Save the booking to the database and return the booking if there are no clashes and the new booking time is not in the past
  if (!bookingClash && !pastDate) {
    return api.put(`/rooms/${data.roomId}`, {
      bookingStart: bookingStart,
      bookingEnd: bookingEnd,
      businessUnit: data.businessUnit,
      purpose: data.purpose,
      roomId: data.roomId,
      recurring: data.recurringData
    })
      .then(res => res.data)
      .catch(err => console.error(err))
  }
}

// Delete a room booking
export function deleteBooking(roomId, bookingId) {
  return api.delete(`/rooms/${roomId}/${bookingId}`)
    .then(res => res.data)
}

export function updateStateRoom(self, updatedRoom, loadMyBookings, onResetFilteredData) {
  self.setState((previousState) => {
    // Find the relevant room in React State and replace it with the new room data
    const updatedRoomData = previousState.roomData.map((room) => {
      if (room._id === updatedRoom._id) {
        return updatedRoom
      } else {
        return room
      }
    })
    return {
      // Update the room data in application state
      roomData: updatedRoomData,
      currentRoom: updatedRoom
    }
  })
  loadMyBookings()
  onResetFilteredData()
}